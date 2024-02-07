import PropTypes from 'prop-types';

/* CSS */
import styles from './FavoriteTriggerMessage.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleCheck, faXmark } from '@fortawesome/free-solid-svg-icons';

const FavoriteTriggerMessage = ({ favMessage }) => {
  return (
    <div className={styles.message_box}>
      {favMessage.type === 'favorites' && (
        <FontAwesomeIcon
          icon={['far', 'bookmark']}
          style={{ color: 'white', height: '30px', width: '30px' }}
        />
      )}

      {favMessage.type === 'deleteEvent' && (
        <FontAwesomeIcon icon={faXmark} style={{ color: 'red', height: '30px', width: '30px' }} />
      )}
      {favMessage.type === 'registerEvent' && (
        <FontAwesomeIcon
          icon={faCircleCheck}
          style={{ color: 'white', height: '20px', width: '20px' }}
        />
      )}

      <span>{favMessage.message}</span>
    </div>
  );
};

FavoriteTriggerMessage.propTypes = {
  favMessage: PropTypes.object,
};

export default FavoriteTriggerMessage;
