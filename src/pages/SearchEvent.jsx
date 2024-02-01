import { useEffect, useReducer, useState } from "react";
import CategoryOutput from "../components/events/search/CategoryOutput";
import CategoryScrollBar from "../components/events/search/CategoryScrollBar";
import SearchFilterBar from "../components/events/search/SearchFilterBar";

/* CSS */
import styles from "./SearchEvent.module.css";
import { viewAllEvents, viewEventByFilter } from "../utils/fetchData";
import { initialEventFilterState, reducer } from "../utils/stateHandler";
import EventFilterBox from "../components/events/search/EventFilterBox";

const SearchEvent = ({ children }) => {
  const [eventFilter, eventFilterDispatch] = useReducer(
    reducer,
    initialEventFilterState
  );
  const [viewEventData, setViewEventData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [showFilter, setShowFilter] = useState(false);

  useEffect(() => {
    // if (eventFilter.name) {
    //   console.log('CHANGE NAME');
    //   return;
    // }

    setIsLoading(true);
    // Hole erstmal alle Events bei laden der Seite und übergeben die fetchfunctions als callback

    if (showFilter) {
      return;
    }

    if (isInitialLoad) {
      fetchEventData(viewAllEvents);
      setIsInitialLoad(false);
    } else {
      fetchEventData(() => viewEventByFilter(eventFilter));
    }
    return;

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventFilter, showFilter]);

  const fetchEventData = async (cb) => {
    const response = await cb();
    setIsLoading(false);

    console.log(response);

    if (response && response.length > 0) {
      setViewEventData(response);
      return;
    }

    setViewEventData(null);
  };

  const handleShowFilterBox = () => {
    setShowFilter((cur) => !cur);
  };

  return (
    <>
      <section className={styles.search_event}>
        <SearchFilterBar
          onHandleShowFilterBox={handleShowFilterBox}
          eventFilter={eventFilter}
          eventFilterDispatch={eventFilterDispatch}
        />
        <CategoryScrollBar eventFilter={eventFilter} eventFilterDispatch={eventFilterDispatch} />
      </section>
      <section>
        <CategoryOutput
          viewEventData={viewEventData}
          isLoading={isLoading}
          eventFilter={eventFilter}
        />
      </section>
      <section className={styles.filter_event}>
        {showFilter && (
          <EventFilterBox
            eventFilter={eventFilter}
            eventFilterDispatch={eventFilterDispatch}
            onHandleShowFilterBox={handleShowFilterBox}
          />
        )}
      </section>
      {children}
    </>
  );
};

export default SearchEvent;
