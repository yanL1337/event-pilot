import PropTypes from 'prop-types';
import { getCategories, getCategoryIcons, lockLastDays } from '../../../utils/helperFunction';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarDays, faLocationDot } from '@fortawesome/free-solid-svg-icons';

/* CSS */
import styles from './EventFilterBox.module.css';
import { useEffect, useRef } from 'react';
import { getCityFromLocation } from '../../../utils/geoLocation';
import DynamicTriggerButton from '../../buttons/DynamicTriggerButton';

const EventFilterBox = ({ eventFilter, eventFilterDispatch, onHandleShowFilterBox }) => {
  const dateInputRef = useRef(null);

  useEffect(() => {
    // Hier führen wir den Resetbutton noch aus

    // Hole Location und sette den state
    getCityFromLocation().then((city) => {
      if (city) {
        eventFilterDispatch({ type: 'SET_FIELD', field: 'location', value: city });
      }
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const openCalendar = () => {
    dateInputRef.current.showPicker();
  };

  const handleFilterClicks = (field, value) => {
    if (field === 'category') {
      eventFilterDispatch({ type: 'TOGGLE_ARRAY_MULTIPLE_ITEM', field: field, value: value });
      return;
    }
    eventFilterDispatch({ type: 'TOGGLE_FIELD', field: field, value: value });
  };

  const resetFilter = () => {
    eventFilterDispatch({ type: 'RESET_STATE' });
  };

  lockLastDays;

  return (
    <article className={styles.filter_event_box_wrapper}>
      <div className={styles.filter_event_box}>
        <div>
          <img src="/images/filter_box_line.png" alt="line" />
        </div>
        <h2>Filter</h2>
        <div className={styles.event_box_content}>
          <p>Category</p>
          <div className={styles.box_category_buttons}>
            {getCategories().map((category) => {
              return (
                <div key={crypto.randomUUID()} className={styles.category_button_box}>
                  <button
                    className={`${styles.category_button} ${
                      eventFilter.category.includes(category) && styles.isButtonClicked
                    }`}
                    onClick={() => handleFilterClicks('category', category)}
                  >
                    <FontAwesomeIcon
                      icon={getCategoryIcons(category)}
                      className={styles.category_button_icons}
                    />
                  </button>
                  <span> {category}</span>
                </div>
              );
            })}
          </div>
        </div>
        <div className={styles.event_box_content}>
          <p>Time & Date</p>
          <div className={styles.box_date_buttons}>
            <button
              className={`${styles.date_button} ${
                eventFilter.date.type === 'today' ? styles.isButtonClicked : ''
              }`}
              onClick={() => handleFilterClicks('date', { type: 'today', value: null })}
            >
              Today
            </button>
            <button
              className={`${styles.date_button} ${
                eventFilter.date.type === 'tomorrow' ? styles.isButtonClicked : ''
              }`}
              onClick={() => handleFilterClicks('date', { type: 'tomorrow', value: null })}
            >
              Tomorrow
            </button>
            <button
              className={`${styles.date_button} ${
                eventFilter.date.type === 'week' ? styles.isButtonClicked : ''
              }`}
              onClick={() => handleFilterClicks('date', { type: 'week', value: null })}
            >
              This week
            </button>
            <div
              style={{ position: 'relative', width: '100%', display: 'flex', alignItems: 'center' }}
            >
              <FontAwesomeIcon
                icon={faCalendarDays}
                style={{ color: '#876afd', height: '30px', position: 'absolute', left: '8px' }}
              />
              <button
                className={`${styles.date_button} ${styles.calendar} ${
                  eventFilter.date.type === 'equal' && eventFilter.date.value
                    ? styles.isButtonClicked
                    : ''
                }`}
                onClick={openCalendar}
              >
                {eventFilter.date.value ? eventFilter.date.value : 'Choose from calendar'}
              </button>
              <input
                type="datetime-local"
                ref={dateInputRef}
                {...lockLastDays()}
                style={{ position: 'absolute', left: 0, zIndex: '-1' }}
                onChange={(e) =>
                  handleFilterClicks('date', { type: 'equal', value: e.target.value })
                }
              />
            </div>
          </div>
        </div>
        <div className={styles.event_box_content}>
          <p>Location</p>
          <div className={styles.box_location}>
            <FontAwesomeIcon
              icon={faLocationDot}
              className={styles.box_location_icon}
              onClick={() => {
                getCityFromLocation().then((city) => {
                  if (city) {
                    eventFilterDispatch({ type: 'SET_FIELD', field: 'location', value: city });
                  }
                });
              }}
            />

            <label htmlFor="location"></label>
            <input
              type="text"
              name="location"
              id="location"
              value={eventFilter.location}
              onChange={(e) => handleFilterClicks('location', e.target.value)}
            />
            <div className={styles.box_location_arrow}>{'>'}</div>
          </div>
        </div>
        <div className={styles.trigger_buttons}>
          <button className={styles.resetButton} onClick={resetFilter}>
            RESET
          </button>
          <DynamicTriggerButton hasArrow={true} onTriggerEventFn={onHandleShowFilterBox}>
            APPLY
          </DynamicTriggerButton>
        </div>
      </div>
    </article>
  );
};

EventFilterBox.propTypes = {
  eventFilter: PropTypes.object,
  eventFilterDispatch: PropTypes.func,
  onHandleShowFilterBox: PropTypes.func,
};

export default EventFilterBox;