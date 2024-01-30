import {
  faMusic,
  faPalette,
  faVolleyball,
  faUtensils,
  faHeadset,
} from '@fortawesome/free-solid-svg-icons';

const categoryObj = {
  Sport: faVolleyball,
  Music: faMusic,
  Art: faPalette,
  Food: faUtensils,
  Gaming: faHeadset,
};

export const getCategories = () => {
  return Object.keys(categoryObj);
};

export const getCategoryIcons = (key) => {
  return categoryObj[key];
};

export const lockLastDays = () => {
  const today = new Date();
  const date = today.toISOString().split('T')[0];
  const time = today.toTimeString().split(' ')[0].substring(0, 5);
  const dateTimeAttributes = { min: `${date}T${time}` };

  return dateTimeAttributes;
};

export const createImagePath = (image, recordId) => {
  if (!image) {
    return null;
  }
  const pocketBaseURL = `${import.meta.env.VITE_POCKET_FETCH_URL}`; // Ersetzen Sie dies durch die tatsächliche URL Ihrer PocketBase-Instanz
  const imagePath = '/api/files/events/'; // Pfad zum Ordner, in dem die Bilder gespeichert sind

  const imageUrl = `${pocketBaseURL}${imagePath}${recordId}/${image}`;

  return imageUrl;
};

export const formatDateToString = (inputDate) => {};
