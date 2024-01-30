export const initialEventState = {
  name: '',
  registeredUser: [],
  date: '',
  category: '',
  image: '',
  description: '',
  location: '',
  creator: '',

  eventErrors: {
    name: 'Das Event brauch einen Namen',
    date: 'Das Startdatum muss eingetragen werden',
    category: 'Die Kategorie muss eingetragen werden',
    location: 'Die Location des Event muss eingetragen werden',
    description: 'Die Beschreibung muss eingetragen werden',
    creator: 'Fehler, Ihre Userdaten konnten nicht abgerufen werden',
  },
};

export const reducer = (state, action) => {
  switch (action.type) {
    case 'SET_FIELD':
      return { ...state, [action.field]: action.value };
    case 'SET_ERROR':
      return { ...state, errors: action.errors };

    default:
      throw new Error();
  }
};

export const validateEventForm = (fields) => {
  let errors = {};

  Object.keys(initialEventState.eventErrors).forEach((fieldValue) => {
    if (!fields[fieldValue]) {
      errors[fieldValue] = initialEventState.eventErrors[fieldValue];
    }
  });

  return errors;
};
