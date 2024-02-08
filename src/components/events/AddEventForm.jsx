import { useEffect, useReducer, useState } from 'react';
import { initialEventState, reducer, validateEventForm } from '../../utils/stateHandler';
import { getCityFromLocation } from '../../utils/geoLocation';
import { getCategories, lockLastDays } from '../../utils/helperFunction';
import useLocalStorage from '../../hooks/useLocalStorage';

/* CSS */
import styles from './AddEventForm.module.css';
import { createEventByUser } from '../../utils/fetchData';
import { Link } from 'react-router-dom';
import LoadingElement from '../loading/LoadingElement';
import DynamicTriggerButton from '../buttons/DynamicTriggerButton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBarsStaggered,
  faCalendarDays,
  faLocationDot,
  faThumbsUp,
  faUpload,
} from '@fortawesome/free-solid-svg-icons';
import { germanCities } from '../../utils/data';

const AddEventForm = () => {
  const [citySuggestions, setCitySuggestion] = useState([]);
  const [eventData, eventFormDispatch] = useReducer(reducer, initialEventState);
  const [addSuccess, setAddSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const userDataAuth = useLocalStorage('pocketbase_auth', null);

  useEffect(() => {
    // Hole Location und sette den state
    getCityFromLocation().then((city) => {
      if (city) {
        eventFormDispatch({
          type: 'SET_FIELD',
          field: 'location',
          value: city,
        });
      }
    });

    // Setzen den Creator
    eventFormDispatch({
      type: 'SET_FIELD',
      field: 'creator',
      value: userDataAuth[0].model.id,
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSubmitForm = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Wir clearn erstmal unsere Errors
    eventFormDispatch({ type: 'SET_ERROR', errors: {} });

    // Wir validieren auf empty
    const formErrors = validateEventForm(eventData);

    // Falls empty füllen wir unseren Error State
    if (Object.keys(formErrors).length > 0) {
      setIsLoading(false);
      eventFormDispatch({ type: 'SET_ERROR', errors: formErrors });
      return;
    }

    // Nun senden wir die Daten
    const response = await createEventByUser(eventData, userDataAuth);

    if (response) {
      setIsLoading(false);
      setAddSuccess(true);
      return;
    }
  };

  const handleChangeEventFormData = (e) => {
    // Die File müssen wir anders behandeln
    if (e.target.name === 'image') {
      eventFormDispatch({
        type: 'SET_FIELD',
        field: e.target.name,
        value: e.target.files[0],
      });

      // Wir müssen die upload datei anzeigen lassen hinter dem Button
      const file = e.target.files[0];

      if (file) {
        setSelectedImage(URL.createObjectURL(file));
      }
      return;
    }

    eventFormDispatch({
      type: 'SET_FIELD',
      field: e.target.name,
      value: e.target.value,
    });

    if (e.target.name === 'location') {
      handleCitySuggestionClick(e.target.name, e.target.value);
    }
  };

  const handleCitySuggestionClick = (field, value) => {
    eventFormDispatch({ type: 'SET_FIELD', field: field, value: value });

    if (field === 'location' && value.length > 0) {
      const regex = new RegExp(`^${value}`, 'i');

      const filteredSuggestions = germanCities.sort().filter((v) => regex.test(v));
      setCitySuggestion(filteredSuggestions);
    } else {
      setCitySuggestion([]);
    }
  };

  const resetForm = () => {
    // Clearn State
    eventFormDispatch({ type: 'RESET_FORM_STATE' });
    // clearn Image
    handleClearImage();
    setAddSuccess(false);
  };

  const handleClearImage = () => {
    setSelectedImage(null);
    // Wir hauen das Bild wieder raus
    document.getElementById('image').value = '';
    eventFormDispatch({ type: 'SET_FIELD', field: 'image', value: '' });
  };

  return (
    <section className={styles.section}>
      <article>
        <form onSubmit={onSubmitForm}>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              position: 'relative',
            }}
          >
            <div className={styles.wrapperdiv}>
              <FontAwesomeIcon
                icon={faBarsStaggered}
                style={{
                  color: 'gray',
                  height: '30px',
                  position: 'absolute',

                  left: '16px',
                  top: '15%',
                }}
              />
              <input
                type="text"
                name="name"
                id="name"
                placeholder="Name"
                value={eventData.name}
                onChange={handleChangeEventFormData}
                className={styles.fields}
              />
            </div>
            <div className={styles.error_wrapper}>
              {eventData.errors && eventData.errors.name && (
                <span className={styles.errormessage}>{eventData.errors.name}</span>
              )}
            </div>
          </div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              position: 'relative',
            }}
          >
            <label htmlFor="category"></label>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <FontAwesomeIcon
                icon={faBarsStaggered}
                style={{
                  color: 'gray',
                  height: '30px',
                  position: 'absolute',
                  left: '16px',
                  top: '15%',
                }}
              />
              <select
                name="category"
                value={eventData.category}
                onChange={handleChangeEventFormData}
                className={styles.fields}
              >
                <option value="">Bitte auswählen</option>
                {getCategories().map((category) => {
                  return (
                    <option value={category} key={crypto.randomUUID()}>
                      {category}
                    </option>
                  );
                })}
              </select>
            </div>
            <div className={styles.error_wrapper}>
              {eventData.errors && eventData.errors.category && (
                <span className={styles.errormessage}>{eventData.errors.category}</span>
              )}
            </div>
          </div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              position: 'relative',
            }}
          >
            <label htmlFor="date"></label>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <FontAwesomeIcon
                icon={faCalendarDays}
                style={{
                  color: 'gray',
                  height: '30px',
                  position: 'absolute',
                  left: '16px',
                  top: '15%',
                }}
              />
              <input
                type="datetime-local"
                name="date"
                id="date"
                {...lockLastDays()}
                placeholder="Date"
                value={eventData.date}
                onChange={handleChangeEventFormData}
                className={styles.fields}
              />
            </div>
            <div className={styles.error_wrapper}>
              {eventData.errors && eventData.errors.date && (
                <span className={styles.errormessage}>{eventData.errors.date}</span>
              )}
            </div>
          </div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              position: 'relative',
            }}
          >
            <label htmlFor="location"></label>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <FontAwesomeIcon
                icon={faLocationDot}
                style={{
                  color: 'gray',
                  height: '30px',
                  position: 'absolute',
                  left: '16px',
                  top: '15%',
                }}
                onClick={() => {
                  getCityFromLocation().then((city) => {
                    if (city) {
                      eventFormDispatch({
                        type: 'SET_FIELD',
                        field: 'location',
                        value: city,
                      });
                    }
                  });
                }}
              />
              <input
                type="text"
                name="location"
                id="location"
                placeholder="Location"
                value={eventData.location}
                onChange={handleChangeEventFormData}
                className={styles.fields}
              />
            </div>
            {citySuggestions.length > 0 && (
              <ul
                style={{
                  position: 'absolute',
                  width: '100%',
                  top: '95%',
                  height: '300px',
                  overflow: 'scroll',
                  zIndex: '10',
                }}
              >
                {citySuggestions.map((suggestion, index) => (
                  <li
                    key={index}
                    onClick={() => {
                      handleCitySuggestionClick('location', suggestion);
                      setCitySuggestion([]);
                    }}
                    style={{
                      width: '100%',
                      backgroundColor: '#00ECAA',
                      fontSize: '1.25rem',
                      border: '1px solid lightgray',
                      padding: '10px',
                      color: 'white',
                      fontWeight: '800',
                    }}
                  >
                    {suggestion}
                  </li>
                ))}
              </ul>
            )}
            <div className={styles.error_wrapper}>
              {eventData.errors && eventData.errors.location && (
                <span className={styles.errormessage}>{eventData.errors.location}</span>
              )}
            </div>
          </div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              position: 'relative',
            }}
          >
            <label htmlFor="description"></label>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <FontAwesomeIcon
                icon={faBarsStaggered}
                style={{
                  color: 'gray',
                  height: '30px',
                  position: 'absolute',
                  left: '16px',
                  top: '5%',
                }}
              />
              <textarea
                type="text"
                name="description"
                id="description"
                placeholder="About"
                cols="30"
                rows="10"
                value={eventData.description}
                onChange={handleChangeEventFormData}
                className={styles.fields}
              ></textarea>
            </div>

            <div className={styles.error_wrapper}>
              {eventData.errors && eventData.errors.description && (
                <span className={styles.errormessage}>{eventData.errors.description}</span>
              )}
            </div>
          </div>
          <div>
            <label htmlFor="image" className={styles.custom_file_upload}>
              <FontAwesomeIcon icon={faUpload} style={{ color: 'gray', height: '30px' }} />
              <span> Event Image Upload</span>
            </label>
            <input
              className={styles.uploadfile}
              type="file"
              name="image"
              id="image"
              onChange={handleChangeEventFormData}
            />
            {selectedImage && (
              <div className={styles.imagePreview}>
                <p onClick={handleClearImage}>Clear Image</p>
                <img src={selectedImage} alt="Event" />
              </div>
            )}
          </div>
          <div className={styles.error_wrapper}>
            {eventData.errors && eventData.errors.creator && (
              <span className={styles.errormessage}>{eventData.errors.creator}</span>
            )}
          </div>
          {!isLoading ? (
            <DynamicTriggerButton hasArrow={true}>ADD</DynamicTriggerButton>
          ) : (
            <LoadingElement />
          )}
        </form>
      </article>
      {addSuccess && (
        <article className={styles.successmessage_wrapper}>
          <div className={styles.successmessage_box}>
            <FontAwesomeIcon icon={faThumbsUp} />
            <p>Sie haben das Event erfolgreich angelegt</p>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <p>
                <Link to="/home" className={styles.successmessage_box_elements}>
                  Zurück zu Events
                </Link>
              </p>
              <p className={styles.successmessage_box_elements} onClick={resetForm}>
                Neues Event anlegen
              </p>
            </div>
          </div>
        </article>
      )}
    </section>
  );
};

export default AddEventForm;
