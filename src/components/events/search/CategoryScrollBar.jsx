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

  // Minimale Bewegungsschwelle für das Starten des Dragging
  const DRAG_THRESHOLD = 5;

  const startDragging = (e) => {
    e.preventDefault();
    const initialPosition = e.type.includes('mouse') ? e.pageX : e.touches[0].pageX;
    setIsDragging(false); // Initial false setzen
    setStartX(initialPosition - scrollContainerRef.current.offsetLeft);
    setScrollLeft(scrollContainerRef.current.scrollLeft);
    scrollContainerRef.current.classList.add('grabbing');

    // Globale Event-Listener hinzufügen
    document.addEventListener('mousemove', onDrag);
    document.addEventListener('mouseup', stopDragging);
  };

  const stopDragging = () => {
    if (isDragging) {
      setIsDragging(false);
    }

    scrollContainerRef.current.classList.remove('grabbing');

    // Globale Event-Listener entfernen
    document.removeEventListener('mousemove', onDrag);
    document.removeEventListener('mouseup', stopDragging);
  };

  const onDrag = (e) => {
    const currentPosition = e.type.includes('mouse') ? e.pageX : e.touches[0].pageX;
    const walk = (currentPosition - startX) * 2; // Bewegungsfaktor anpassen nach Bedarf

    // Schwellenwert überprüfen, bevor isDragging auf true gesetzt wird
    if (!isDragging && Math.abs(currentPosition - startX) > DRAG_THRESHOLD) {
      setIsDragging(true);
    }

    if (isDragging) {
      e.preventDefault(); // Verhindert das Scrollen des Browsers oder ähnliche Aktionen
      scrollContainerRef.current.scrollLeft = scrollLeft - walk;
    }
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
        onMouseDown={startDragging}
        onMouseUp={stopDragging}
        onMouseLeave={stopDragging}
        onMouseMove={onDrag}
        onTouchStart={startDragging}
        onTouchEnd={stopDragging}
        onTouchMove={onDrag}
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
