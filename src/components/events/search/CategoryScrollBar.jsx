/* CSS */
import { useRef, useState } from 'react';
import { getCategories, getCategoryIcons } from '../../../utils/helperFunction';
import styles from './CategoryScrollBar.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const CategoryScrollBar = () => {
  const scrollContainerRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  /* DRAG FUNKTIONALITÄT EVENTUELL SPÄTER AUSLAGERN */
  const startDragging = (e) => {
    // Überprüfen ob desktop oder touchscreen/mobile
    const initialPosition = e.type.includes('mouse') ? e.pageX : e.touches[0].pageX;
    setIsDragging(true);
    setStartX(initialPosition - scrollContainerRef.current.offsetLeft);
    setScrollLeft(scrollContainerRef.current.scrollLeft);
  };

  const stopDragging = () => {
    setIsDragging(false);
  };

  const onDrag = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    // Überprüfen ob desktop oder touchscreen
    const currentPosition = e.type.includes('mouse') ? e.pageX : e.touches[0].pageX;
    const walk = (currentPosition - startX) * 1;
    scrollContainerRef.current.scrollLeft = scrollLeft - walk;
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
              className={`${styles.category_button} ${styles.scrollButton}`}
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

export default CategoryScrollBar;
