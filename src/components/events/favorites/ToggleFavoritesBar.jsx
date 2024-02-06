import PropTypes from 'prop-types';

const ToggleFavoritesBar = ({ styles, onHandleToggleButton, toggleButton }) => {
  return (
    <div className={styles.toggle_events}>
      <button
        className={`${styles.reset_button_styles} ${toggleButton === 'up' && styles.toggle_button}`}
        onClick={() => onHandleToggleButton('up')}
      >
        UPCOMING
      </button>
      <button
        className={`${styles.reset_button_styles} ${
          toggleButton === 'registered' && styles.toggle_button
        }`}
        onClick={() => onHandleToggleButton('registered')}
      >
        REGISTERED
      </button>
    </div>
  );
};

ToggleFavoritesBar.propTypes = {
  styles: PropTypes.object,
  onHandleToggleButton: PropTypes.func,
  toggleButton: PropTypes.string,
};

export default ToggleFavoritesBar;
