import PropTypes from "prop-types";

/* CSS */
import styles from "./Pin.module.css";

const Pin = ({ isEditable, value, triggerFn }) => {
  return (
    <>
      {value && (
        <p className={styles.pin}>
          <span>{value} </span>
          {isEditable && <span onClick={triggerFn}>x</span>}
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
