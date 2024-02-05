import PropTypes from 'prop-types';

/* CSS */
import styles from './LoadMoreButton.module.css';

const LoadMoreButton = ({ handleMoreEvents }) => {
  return (
    <button className={styles.loadmore_button} onClick={handleMoreEvents}>
      Load more
    </button>
  );
};

LoadMoreButton.propTypes = {
  handleMoreEvents: PropTypes.func,
};

export default LoadMoreButton;
