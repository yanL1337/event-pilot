import axios from 'axios';
import pb from '../lib/pocketbase';
import { formatDateToPB, getEndOfCurrentWeek } from './helperFunction';

/* POCKETBASE */

export const createEventByUser = async (eventData, authToken) => {
  try {
    if (!authToken) {
      throw new Error('Das Event anzulegen ist fehlgeschlagen');
    }

    // Daten aufbereiten
    const data = {
      name: eventData.name,
      registeredUser: [],
      date: new Date(eventData.date).toISOString(),
      category: eventData.category,
      image: eventData.image,
      description: eventData.description,
      location: eventData.location,
      creator: eventData.creator,
    };

    const record = await pb.collection('events').create(data);

    return record;
  } catch (error) {
    console.log(error);
  }
};

export const viewAllEvents = async () => {
  const records = await pb.collection('events').getFullList({
    sort: '-created',
  });

  return records;
};

export const viewEventByFilter = async (filter) => {
  // Wir erstellen uns einen queryFilterBuilder
  const filterString = queryBuilder(filter);

  // Wenn wir nix im Filter haben rufen wir alle Daten wieder ab?...
  if (!filterString) {
    return await viewAllEvents();
  }

  // Wenn query gebaut ist holen wir uns die data
  try {
    // query builder einbauen
    const records = await pb.collection('events').getFullList({
      filter: filterString,
      // filter: '(category="Sport")&&location="Essen, Germany"',
    });

    return records;
  } catch (error) {
    return null;
  }
};

/* NODEMAILER */
export const sendRegisteredEventEmail = async (method, email, urlParams, headers = {}) => {
  const url = `${import.meta.env.VITE_POCKET_FETCH_URL}${urlParams}`;
  // sende Email, wenn User sich an einem Event registriert hat!
  try {
    const response = await axios({
      method,
      url,
      email,
      headers,
      withCredentials: true,
    });

    return response;
  } catch (error) {
    return error;
  }
};

// wird später wieder gelöscht
export const getUserExample = async (_pb) => {
  //
  try {
    const authData = await _pb.collection('users').authWithPassword('testuser@test.de', 'test1234');

    return authData;
  } catch (error) {
    console.log(error);
    return false;
  }
};

const queryBuilder = (filter) => {
  let queryParams = [];

  for (const key in filter) {
    const value = filter[key];

    if (Array.isArray(value) && value.length > 0) {
      // für category müssen wir den string mit or operatoren verknüpfen und in Klammern setzten
      const arrayFilter = '(' + value.map((item) => `${key}="${item}"`).join('||') + ')';
      queryParams.push(arrayFilter);
    } else if ((value && value.length > 0) || value.type) {
      switch (key) {
        case 'date':
          {
            if (value.type === 'equal') {
              const date = new Date(value.value);
              const startDate = date.toISOString();
              date.setSeconds(date.getSeconds() + 1);
              const endDate = date.toISOString();

              const valueFilter = `${key}>="${formatDateToPB(
                startDate
              )}" && ${key}<="${formatDateToPB(endDate)}"`;

              queryParams.push(valueFilter);
            }

            if (value.type === 'today') {
              // jetziges Datum / Uhrzeit
              const date = new Date();
              const startDate = date.toISOString();
              // erzeugen das Ende des Tages
              date.setHours(23, 59, 59, 999);
              const endDate = date.toISOString();

              const valueFilter = `${key}>="${formatDateToPB(
                startDate
              )}" && ${key} <=  "${formatDateToPB(endDate)}"`;
              queryParams.push(valueFilter);
            }

            if (value.type === 'tomorrow') {
              // Erzeugen morgigen StartTag
              const date = new Date();
              date.setDate(date.getDate() + 1);
              // Setze die Uhrzeit auf 00:00:00 für morgen
              date.setHours(0, 0, 0, 0);
              const startDate = date.toISOString();

              // erzeugen das Ende des Tages
              date.setHours(23, 59, 59, 999);
              const endDate = date.toISOString();

              const valueFilter = `${key}>="${formatDateToPB(
                startDate
              )}" && ${key} <=  "${formatDateToPB(endDate)}"`;
              queryParams.push(valueFilter);
            }

            if (value.type === 'week') {
              // jetziges Datum / Uhrzeit
              const date = new Date();
              const startDate = date.toISOString();

              // erzeugen Ende der Woche => Sonntag 23:59::59 lokale Zeit => in pb hinterlegt als 22:59:59 utc
              const endDate = getEndOfCurrentWeek(date).toISOString();

              const valueFilter = `${key}>="${formatDateToPB(
                startDate
              )}" && ${key} <=  "${formatDateToPB(endDate)}"`;
              queryParams.push(valueFilter);
            }
          }
          break;

        case 'name':
          {
            const valueFilter = `${key}~"${value}"`;
            queryParams.push(valueFilter);
          }
          break;

        default:
          // Hier kommen alle anderen Werte rein
          {
            // Ganz normal den Wert setzen
            const valueFilter = `${key}="${value}"`;
            queryParams.push(valueFilter);
          }

          break;
      }
    }
  }

  // Wir verknüpfen die queries dann mit dem und operator und returnen den Rotz
  return queryParams.join('&&');
};

export const addEventFavorites = async (favId) => {
  const userId = pb.authStore.model.id;
  // Holen uns die Daten vom user
  const user = await pb.collection('users').getOne(userId);

  const hasFavorite = user.favoriteEvents.filter((eventId) => eventId === favId);

  try {
    if (hasFavorite.length > 0) {
      await pb.collection('users').update(userId, { 'favoriteEvents-': [favId] });

      return false;
    } else {
      await pb.collection('users').update(userId, { 'favoriteEvents+': [favId] });
      return true;
    }
  } catch (error) {
    console.log(error);
  }
};

export const getEventFavorites = async () => {
  try {
    const userId = pb.authStore.model.id;

    const record = await pb.collection('users').getOne(userId, {
      expand: 'favoriteEvents',
    });

    return record.favoriteEvents;
  } catch (error) {
    return null;
  }
};
