import pb from '../lib/pocketbase.js';
import { creatorThirdEvents as events } from './data.js';

// Funktion zur Erstellung eines Events mit einem authentischen Token
async function createEventByUser(eventData, authToken) {
  if (!authToken) {
    throw new Error('Das Event anzulegen ist fehlgeschlagen');
  }

  try {
    // Daten aufbereiten
    const data = {
      name: eventData.name,
      registeredUser: [],
      date: new Date(eventData.date).toISOString(),
      category: eventData.category,
      image: eventData.image || '', // Optional: Bildpfad hinzufügen
      description: eventData.description,
      location: eventData.location,
      creator: eventData.creator,
    };

    // Simuliere das Erstellen des Events in Pocketbase
    console.log('Erstelle Event:', data);

    // Hier würde normalerweise der API-Aufruf an Pocketbase erfolgen
    setTimeout(async () => {
      await pb.collection('events').create(data);
    }, 1000);
    // return record;
  } catch (error) {
    console.error(error);
  }
}

export const createData = () => {
  // Erstelle Events für jedes Event in der Liste (Demonstration)
  events.forEach((event) => createEventByUser(event, 'IhrAuthentifizierungsTokenHier'));
};
