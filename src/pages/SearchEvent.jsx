import { useEffect, useReducer, useState } from 'react';
import CategoryOutput from '../components/events/search/CategoryOutput';
import CategoryScrollBar from '../components/events/search/CategoryScrollBar';
import SearchFilterBar from '../components/events/search/SearchFilterBar';

/* CSS */
import styles from './SearchEvent.module.css';
import { viewAllEvents, viewEventByFilter } from '../utils/fetchData';
import { initialEventFilterState, reducer } from '../utils/stateHandler';

const SearchEvent = () => {
  const [eventFilter, eventFilterDispatch] = useReducer(reducer, initialEventFilterState);
  const [viewEventData, setViewEventData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    // Hole erstmal alle Events bei laden der Seite
    if (isInitialLoad) {
      fetchInitialEvents();
      setIsInitialLoad(false);
    } else {
      loadEventDataByFilter();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventFilter]);

  const fetchInitialEvents = async () => {
    const response = await viewAllEvents();
    setIsLoading(false);

    console.log(response);

    if (response && response.length > 0) {
      setViewEventData(response);
      return;
    }

    setViewEventData(null);
  };

  const loadEventDataByFilter = async () => {
    const response = await viewEventByFilter(eventFilter);
    setIsLoading(false);

    if (response && response.length > 0) {
      setViewEventData(response);
      return;
    }

    setViewEventData(null);
  };

  return (
    <>
      <section className={styles.search_event}>
        <SearchFilterBar />
        <CategoryScrollBar eventFilter={eventFilter} eventFilterDispatch={eventFilterDispatch} />
      </section>
      <section>
        <CategoryOutput viewEventData={viewEventData} isLoading={isLoading} />
      </section>
    </>
  );
};

export default SearchEvent;
