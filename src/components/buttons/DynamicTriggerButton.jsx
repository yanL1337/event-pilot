import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PropTypes from 'prop-types';

/* CSS */
import styles from './DynamicTriggerButton.module.css';

const DynamicTriggerButton = ({ children, hasArrow, onTriggerEventFn }) => {
  return (
    <button className={styles.trigger_button} onClick={onTriggerEventFn}>
      <div>{children}</div>
      {hasArrow && <FontAwesomeIcon icon={faArrowRight} className={styles.button_arrow} />}
    </button>
  );
};

DynamicTriggerButton.propTypes = {
  hasArrow: PropTypes.bool,
  children: PropTypes.string,
  onTriggerEventFn: PropTypes.func,
};

export default DynamicTriggerButton;
