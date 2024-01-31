import PropTypes from 'prop-types';
import { getCategories, getCategoryIcons } from '../../../utils/helperFunction';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

/* CSS */
import styles from './EventFilterBox.module.css';

const EventFilterBox = ({ eventFilter, eventFilterDispatch }) => {
  return (
    <article className={styles.filter_event_box_wrapper}>
      <div className={styles.filter_event_box}>
        <div>
          <img src="/images/filter_box_line.png" alt="line" />
        </div>
        <h2>Filter</h2>
        <div className={styles.event_box_content}>
          <p>Category</p>
          <div className={styles.box_content_buttons}>
            {getCategories().map((category) => {
              return (
                <div key={crypto.randomUUID()} className={styles.category_button_box}>
                  <button
                    className={`${styles.category_button} ${styles.scrollButton} ${
                      eventFilter.category.includes(category) && styles.isButtonClicked
                    }`}
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
          <div className={styles.box_content_buttons}>
            <button>Today</button>
            <button>Tomorrow</button>
            <button>This week</button>
            <button>Choose from calendar</button>
          </div>
        </div>
      </div>
    </article>
  );
};

EventFilterBox.propTypes = {
  eventFilter: PropTypes.object,
  eventFilterDispatch: PropTypes.func,
};

export default EventFilterBox;
