import PropTypes from 'prop-types';
/* CSS */
import { useRef, useState } from 'react';
import { getCategories, getCategoryIcons } from '../../../utils/helperFunction';
import styles from './CategoryScrollBar.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const CategoryScrollBar = ({ eventFilter, eventFilterDispatch }) => {
  const scrollContainerRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [dragStartTimestamp, setDragStartTimestamp] = useState(null);

  const DRAG_THRESHOLD = 5;
  const CLICK_THRESHOLD_MS = 200;

  const handlePointerDown = (e) => {
    e.preventDefault();
    const initialPosition = e.pageX || e.touches[0].pageX;
    setStartX(initialPosition - scrollContainerRef.current.offsetLeft);
    setScrollLeft(scrollContainerRef.current.scrollLeft);
    setDragStartTimestamp(Date.now());

    scrollContainerRef.current.setPointerCapture(e.pointerId);
    scrollContainerRef.current.classList.add('grabbing');
  };

  const handlePointerMove = (e) => {
    if (!dragStartTimestamp) return;
    const currentPosition = e.pageX || e.touches[0].pageX;
    const walk = (currentPosition - startX) * 2;

    const elapsedTime = Date.now() - dragStartTimestamp;
    if (elapsedTime > CLICK_THRESHOLD_MS || Math.abs(walk) > DRAG_THRESHOLD) {
      setIsDragging(true);
    }

    if (isDragging) {
      e.preventDefault();
      scrollContainerRef.current.scrollLeft = scrollLeft - walk;
    }
  };

  const handlePointerUp = () => {
    const elapsedTime = Date.now() - dragStartTimestamp;
    if (elapsedTime <= CLICK_THRESHOLD_MS && !isDragging) {
      // wird als click dann behandelt
    }

    setIsDragging(false);
    scrollContainerRef.current.classList.remove('grabbing');
    setDragStartTimestamp(null);
  };

  const selectSingleCategory = (category) => {
    /* Wir sollten bei erneutem Click den Button wieder de-selecten
      Wir tauschen hier die Category immer aus
     */
    eventFilterDispatch({
      type: 'TOGGLE_ARRAY_MULTIPLE_ITEM',
      field: 'category',
      value: category,
    });

    return eventFilter;
  };

  return (
    <article className={styles.category_buttons}>
      <div
        ref={scrollContainerRef}
        className={`${styles.scrollContainer} ${isDragging ? 'grabbing' : ''}`}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        {getCategories().map((category) => {
          return (
            <button
              key={crypto.randomUUID()}
              className={`${styles.category_button} ${styles.scrollButton} ${
                eventFilter.category.includes(category) && styles.isButtonClicked
              }`}
              onClick={() => {
                // select Event auf Button
                selectSingleCategory(category);
              }}
            >
              <FontAwesomeIcon icon={getCategoryIcons(category)} />
              <span> {category}</span>
            </button>
          );
        })}
      </div>
    </article>
  );
};

CategoryScrollBar.propTypes = {
  eventFilter: PropTypes.object,
  eventFilterDispatch: PropTypes.func,
  loadEventDataByFilter: PropTypes.func,
};

export default CategoryScrollBar;
