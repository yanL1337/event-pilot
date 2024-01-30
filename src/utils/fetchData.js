import axios from 'axios';
import PocketBase from 'pocketbase';

// Die pb Instanz muss global kommen

/* POCKETBASE */

export const createEventByUser = async (eventData, authToken) => {
  const pb = new PocketBase(`${import.meta.env.VITE_POCKET_FETCH_URL}`);
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

/* NODEMAILER */
export const sendRegisteredEventEmail = async (method, email, urlParams, headers = {}) => {
  const url = `${import.meta.env.VITE_EMAIL_FETCH_URL}${urlParams}`;
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
