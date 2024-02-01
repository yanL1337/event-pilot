import PropTypes from 'prop-types';
import { faLocationDot } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Pin from '../../general/Pin';

/* CSS */
import styles from './CategoryOutput.module.css';
import LoadingElement from '../../loading/LoadingElement';
import { createImagePath, formatDateToString } from '../../../utils/helperFunction';

const CategoryOutput = ({ viewEventData, isLoading, eventFilter }) => {
  return (
    <article className={styles.categoryOutput_wrapper}>
      <div className={styles.pin_list}>
        {eventFilter &&
          Object.keys(eventFilter).map((filter) => {
            if (!eventFilter[filter] || eventFilter[filter].length === 0) {
              return null;
            }

            if (filter === 'name') {
              return;
            }

            if (filter === 'date') {
              return <Pin key={crypto.randomUUID()} value={eventFilter[filter].type} />;
            }

            if (Array.isArray(eventFilter[filter])) {
              return eventFilter[filter].map((categories) => {
                return <Pin key={crypto.randomUUID()} value={categories} />;
              });
            }

            return <Pin key={crypto.randomUUID()} value={eventFilter[filter]} />;
          })}
      </div>
      {isLoading ? (
        <LoadingElement />
      ) : viewEventData && viewEventData.length > 0 ? (
        viewEventData.map((event) => {
          return (
            <div className={styles.categoryOutput_box} key={event.id}>
              <img
                src={`${
                  createImagePath(event.image, event.id)
                    ? createImagePath(event.image, event.id)
                    : '/images/No_image_available.svg.png'
                }`}
                alt="event image"
              />
              <div className={styles.categoryOutput_box_info}>
                <p>{formatDateToString(event.date)}</p>
                <h2>{event.name}</h2>
                <div className={styles.categoryOutput_location} style={{ marginTop: 'auto' }}>
                  <FontAwesomeIcon icon={faLocationDot} />
                  <span>{event.location}</span>
                </div>
              </div>

              <div className={styles.categoryOutput_favorite}>
                <FontAwesomeIcon
                  icon={['far', 'bookmark']}
                  style={{ color: '#63E6BE', height: '20px' }}
                />
              </div>
            </div>
          );
        })
      ) : (
        <p>Keine Events gefunden</p>
      )}
    </article>
  );
};

CategoryOutput.propTypes = {
  viewEventData: PropTypes.array,
  isLoading: PropTypes.bool,
  eventFilter: PropTypes.object,
};

export default CategoryOutput;
