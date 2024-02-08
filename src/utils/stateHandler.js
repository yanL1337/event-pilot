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
    name: 'The event needs a name',
    date: 'The start date must be entered',
    category: 'Die Kategorie muss eingetragen werden',
    location: 'The category must be entered',
    description: 'The description must be entered',
    creator: 'Error, your user data could not be retrieved',
  },
};

export const initialEventFilterState = {
  name: '',
  category: [],
  date: {},
  location: '',
};

export const reducer = (state, action) => {
  switch (action.type) {
    case 'SET_FIELD':
      return { ...state, [action.field]: action.value };
    case 'SET_ARRAY':
      return {
        ...state,
        [action.field]: [...state[action.field], action.value].flat(),
      };

    case 'TOGGLE_FIELD':
      return {
        ...state,
        [action.field]: state[action.field] === action.value ? '' : action.value,
      };

    case 'TOGGLE_OBJECT': {
      const exists =
        state[action.field] &&
        state[action.field].type &&
        action.value.type === state[action.field].type;

      if (exists) {
        return {
          ...state,
          [action.field]: {},
        };
      } else {
        return { ...state, [action.field]: action.value };
      }
    }

    case 'TOGGLE_ARRAY_MULTIPLE_ITEM': {
      const array = state[action.field];
      const index = array.indexOf(action.value);
      let newArray = [...array];

      if (index === -1) {
        newArray.push(action.value);
      } else {
        newArray.splice(index, 1);
      }

      return { ...state, [action.field]: newArray };
    }

    case 'TOGGLE_ARRAY_SINGLE_ITEM': {
      const array = state[action.field];
      const index = array.indexOf(action.value);
      let newArray = [];

      if (index === -1) {
        newArray = [action.value];
      } else {
        newArray = [];
      }

      return { ...state, [action.field]: newArray };
    }

    case 'RESET_STATE':
      // clearn den Scheiss
      return initialEventFilterState;
    case 'RESET_FORM_STATE':
      return {
        ...initialEventState,
        location: state.location,
        creator: state.creator,
      };
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
