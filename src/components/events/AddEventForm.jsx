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

const AddEventForm = () => {
  // reduce
  const [eventData, eventFormDispatch] = useReducer(reducer, initialEventState);
  const [addSuccess, setAddSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const userDataAuth = useLocalStorage('pocketbase_auth', null);

  useEffect(() => {
    // Hole Location und sette den state
    getCityFromLocation().then((city) => {
      if (city) {
        eventFormDispatch({ type: 'SET_FIELD', field: 'location', value: city });
      }
    });

    eventFormDispatch({ type: 'SET_FIELD', field: 'creator', value: userDataAuth[0].model.id });
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
      eventFormDispatch({ type: 'SET_FIELD', field: e.target.name, value: e.target.files[0] });
      return;
    }

    eventFormDispatch({ type: 'SET_FIELD', field: e.target.name, value: e.target.value });
  };

  return (
    <section className={styles.section}>
      <article
        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100vw' }}
      >
        <h1>ADD EVENT</h1>
        <form
          onSubmit={onSubmitForm}
          style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', position: 'relative' }}>
            <label htmlFor="name"></label>
            <input
              type="text"
              name="name"
              id="name"
              placeholder="Name"
              value={eventData.name}
              onChange={handleChangeEventFormData}
            />
            <div className={styles.error_wrapper}>
              {eventData.errors && eventData.errors.name && (
                <span className={styles.errormessage}>{eventData.errors.name}</span>
              )}
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', position: 'relative' }}>
            <label htmlFor="category"></label>
            <select name="category" value={eventData.category} onChange={handleChangeEventFormData}>
              <option value="">Bitte auswählen</option>
              {getCategories().map((category) => {
                return (
                  <option value={category} key={crypto.randomUUID()}>
                    {category}
                  </option>
                );
              })}
            </select>
            <div className={styles.error_wrapper}>
              {eventData.errors && eventData.errors.category && (
                <span className={styles.errormessage}>{eventData.errors.category}</span>
              )}
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', position: 'relative' }}>
            <label htmlFor="date"></label>
            <input
              type="datetime-local"
              name="date"
              id="date"
              {...lockLastDays()}
              placeholder="Date"
              value={eventData.date}
              onChange={handleChangeEventFormData}
            />
            <div className={styles.error_wrapper}>
              {eventData.errors && eventData.errors.date && (
                <span className={styles.errormessage}>{eventData.errors.date}</span>
              )}
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <label htmlFor="location"></label>
            <input
              type="text"
              name="location"
              id="location"
              placeholder="Location"
              value={eventData.location}
              onChange={handleChangeEventFormData}
            />
            <div className={styles.error_wrapper}>
              {eventData.errors && eventData.errors.location && (
                <span className={styles.errormessage}>{eventData.errors.location}</span>
              )}
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', position: 'relative' }}>
            <label htmlFor="description"></label>
            <textarea
              type="text"
              name="description"
              id="description"
              placeholder="About"
              cols="30"
              rows="10"
              value={eventData.description}
              onChange={handleChangeEventFormData}
            ></textarea>

            <div className={styles.error_wrapper}>
              {eventData.errors && eventData.errors.description && (
                <span className={styles.errormessage}>{eventData.errors.description}</span>
              )}
            </div>
          </div>
          <div>
            <label htmlFor="image"></label>
            <input type="file" name="image" id="image" onChange={handleChangeEventFormData} />
          </div>
          {!isLoading ? (
            <div>
              <button className={styles.button}>ADD</button>
            </div>
          ) : (
            <LoadingElement />
          )}
        </form>
      </article>
      {addSuccess && (
        <article className={styles.successmessage_wrapper}>
          <div className={styles.successmessage_box}>
            <p>Sie haben das Event erfolgreich anglegt</p>
            <Link to="/events">Zurück zu Events</Link>
          </div>
        </article>
      )}
    </section>
  );
};

export default AddEventForm;
