import PropTypes from 'prop-types';

/* CSS */
import styles from './Pin.module.css';

const Pin = ({ isEditable, value, triggerFn }) => {
  return (
    <>
      {value && (
        <p className={styles.pin}>
          <span style={{ fontSize: '2rem' }}>{value} </span>
          {isEditable && (
            <span
              style={{ color: '#00ECAA', fontWeight: '800', fontSize: '1.75rem' }}
              onClick={triggerFn}
            >
              x
            </span>
          )}
        </p>
      )}
    </>
  );
};

Pin.propTypes = {
  isEditable: PropTypes.bool,
  value: PropTypes.string,
  triggerFn: PropTypes.func,
};

export default Pin;
