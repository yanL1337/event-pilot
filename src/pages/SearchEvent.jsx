import { useEffect, useState } from 'react';
import CategoryOutput from '../components/events/search/CategoryOutput';
import CategoryScrollBar from '../components/events/search/CategoryScrollBar';
import SearchFilterBar from '../components/events/search/SearchFilterBar';

/* CSS */
import styles from './SearchEvent.module.css';
import { viewAllEvents } from '../utils/fetchData';

const SearchEvent = () => {
  const [viewEventData, setViewEventData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    // Hole erstmal alle Events bei laden der Seite
    async function fetchInitialEvents() {
      const response = await viewAllEvents();
      setIsLoading(false);

      console.log(response);

      if (response && response.length > 0) {
        setViewEventData(response);
        return;
      }
    }

    fetchInitialEvents();
  }, []);

  return (
    <>
      <section className={styles.search_event}>
        <SearchFilterBar />
        <CategoryScrollBar />
      </section>
      <section>
        <CategoryOutput viewEventData={viewEventData} isLoading={isLoading} />
      </section>
    </>
  );
};

export default SearchEvent;
