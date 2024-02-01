import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass, faBars } from '@fortawesome/free-solid-svg-icons';

/* CSS */
import styles from './SearchFilterBar.module.css';

const SearchFilterBar = ({ onHandleShowFilterBox, eventFilter, eventFilterDispatch }) => {
  const setName = (name) => {
    console.log(name);
    eventFilterDispatch({
      type: 'SET_FIELD',
      field: 'name',
      value: name,
    });

    return eventFilter;
  };

  return (
    <article className={`${styles.searchbar_article}`}>
      <div className={`${styles.searchbar}`}>
        <FontAwesomeIcon icon={faMagnifyingGlass} className={`${styles.search_icon}`} />
        <label htmlFor="searchEvent"></label>
        <input
          type="text"
          placeholder="| Search..."
          className={`${styles.search_input}`}
          value={eventFilter.name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <button className={`${styles.filterbar_button}`} onClick={onHandleShowFilterBox}>
        <div className={`${styles.filterbar_icon}`}>
          <FontAwesomeIcon
            icon={faBars}
            style={{ color: 'white', fontWeight: 'bold', height: '25px' }}
          />
        </div>
        <span>Filter</span>
      </button>
    </article>
  );
};

SearchFilterBar.propTypes = {
  onHandleShowFilterBox: PropTypes.func,
  eventFilter: PropTypes.object,
  eventFilterDispatch: PropTypes.func,
};

export default SearchFilterBar;
