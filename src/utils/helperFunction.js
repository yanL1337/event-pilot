import {
  faMusic,
  faPalette,
  faVolleyball,
  faUtensils,
  faHeadset,
} from '@fortawesome/free-solid-svg-icons';

/**  HELPER OBJECTS / ARRAYS **/
const categoryObj = {
  Sport: faVolleyball,
  Music: faMusic,
  Art: faPalette,
  Food: faUtensils,
  Gaming: faHeadset,
};

/** HELPER FUNCTIONS **/
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

export const formatDateToString = (inputDate) => {
  const date = new Date(inputDate);

  const weekDay = date
    .toLocaleDateString('default', { weekday: 'long' })
    .toLocaleUpperCase()
    .slice(0, 3);
  const month = date.toLocaleString('default', { month: 'long' }).toLocaleUpperCase().slice(0, 3);

  const day = date.getDate();

  const hours = date.getHours() % 12 || 12;
  const minutes = date.getMinutes();
  // Wir checken ob PM / AM
  const ampm = date.getHours() >= 12 ? 'PM' : 'AM';

  const dayWithSuffix =
    day +
    (day % 10 === 1 && day !== 11
      ? 'ST'
      : day % 10 === 2 && day !== 12
      ? 'ND'
      : day % 10 === 3 && day !== 13
      ? 'RD'
      : 'TH');

  return `${dayWithSuffix} ${month}-${weekDay} - ${hours}:${
    minutes < 10 ? '0' : ''
  }${minutes} ${ampm}`;
};
