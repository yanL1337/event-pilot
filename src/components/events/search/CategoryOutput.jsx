import PropTypes from 'prop-types';

import { faLocationDot } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

/* CSS */
import styles from './CategoryOutput.module.css';
import LoadingElement from '../../loading/LoadingElement';
import { createImagePath } from '../../../utils/helperFunction';

const CategoryOutput = ({ viewEventData, isLoading }) => {
  return (
    <article className={styles.categoryOutput_wrapper}>
      {isLoading ? (
        <LoadingElement />
      ) : viewEventData && viewEventData.length > 0 ? (
        viewEventData.map((event) => {
          return (
            <div className={styles.categoryOutput_box} key={event.id}>
              {/* {console.log(createImagePath())} */}
              <img
                src={`${
                  createImagePath(event.image, event.id)
                    ? createImagePath(event.image, event.id)
                    : '/images/No_image_available.svg.png'
                }`}
                alt="event image"
              />
              <div className={styles.categoryOutput_box_info}>
                {/* <p>3RD JUN-SUN - 8:00 PM</p> */}
                <p>{event.date}</p>
                <h2>{event.name}</h2>
                <div className={styles.categoryOutput_location} style={{ marginTop: 'auto' }}>
                  <FontAwesomeIcon icon={faLocationDot} />
                  <span>{event.location}</span>
                </div>
              </div>

              <div className={styles.categoryOutput_favorite}>
                <FontAwesomeIcon
                  icon={['far', 'bookmark']}
                  style={{ color: '#63E6BE', height: '25px' }}
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
};

export default CategoryOutput;
