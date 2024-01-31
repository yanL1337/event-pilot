import axios from 'axios';
import pb from '../lib/pocketbase';

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
  let query = pb.collection('events');
  console.log(filter);

  Object.keys(filter).forEach((key) => {
    const value = filter[key];

    // Wir erzeugen unsere filter für den querybuilder / diese werden immer mit angehangen
    if (Array.isArray(value) && value.length > 0) {
      // filtern unser category Array anhand jedes items im Array
      value.forEach((item) => {
        query = query.filter(key, '=', item);
      });
    } else if (value) {
      // Der Query wird mit "keyname=value" erzeugt
      query = query.filter(key, '=', value);
    }

    // Wenn quer gebaut ist holen wir uns die data
    try {
      // query builder einbauen
    } catch (error) {
      return null;
    }
  });

  const records = await pb.collection('events', filter);

  console.log(records);
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
