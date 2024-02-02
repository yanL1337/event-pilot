import PropTypes from 'prop-types';

/* CSS */
import styles from './FavoriteTriggerMessage.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const FavoriteTriggerMessage = ({ favMessage }) => {
  return (
    <div className={styles.message_box}>
      <FontAwesomeIcon
        icon={['far', 'bookmark']}
        style={{ color: 'white', height: '30px', width: '30px' }}
      />
      <span>{favMessage}</span>
    </div>
  );
};

FavoriteTriggerMessage.propTypes = {
  favMessage: PropTypes.string,
};

export default FavoriteTriggerMessage;
