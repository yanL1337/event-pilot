import PropTypes from 'prop-types';
import Pin from '../../general/Pin';
import LoadingElement from '../../loading/LoadingElement';
import OutputItem from '../../general/OutputItem';

const eventsPerRow = 6;

/* CSS */
import styles from './CategoryOutput.module.css';
import { useCallback, useEffect, useRef, useState } from 'react';
import { getEventFavorites } from '../../../utils/fetchData';
import { formatDateToString } from '../../../utils/helperFunction';
import LoadMoreButton from '../../buttons/LoadMoreButton';

const CategoryOutput = ({ viewEventData, isLoading, eventFilter }) => {
  const [allFavorites, setAllFavorites] = useState([]);
  const [next, setNext] = useState(eventsPerRow);
  const favMessageTimer = useRef(null);

  const fetchFavorites = useCallback(async () => {
    const response = await getEventFavorites();

    setAllFavorites(response);
  }, []);

  useEffect(() => {
    // Holen uns die Favorite und gleichen ab und sättän datt state
    fetchFavorites();
  }, [fetchFavorites]);

  const handleMoreEvents = () => {
    setNext(next + eventsPerRow);
  };

  return (
    <article className={styles.categoryOutput_wrapper}>
      <div className={styles.pin_list}>
        {eventFilter &&
          Object.keys(eventFilter).map((filter) => {
            if (!eventFilter[filter] || eventFilter[filter].length === 0) {
              return null;
            }

            if (filter === 'name') {
              return;
            }

            if (filter === 'date') {
              if (eventFilter[filter].type === 'equal') {
                return (
                  <Pin
                    key={crypto.randomUUID()}
                    value={formatDateToString(eventFilter[filter].value)}
                  />
                );
              }
              return <Pin key={crypto.randomUUID()} value={eventFilter[filter].type} />;
            }

            if (Array.isArray(eventFilter[filter])) {
              return eventFilter[filter].map((categories) => {
                return <Pin key={crypto.randomUUID()} value={categories} />;
              });
            }

            return <Pin key={crypto.randomUUID()} value={eventFilter[filter]} />;
          })}
      </div>
      {isLoading ? (
        <LoadingElement />
      ) : viewEventData && viewEventData.length > 0 ? (
        viewEventData?.slice(0, next)?.map((event) => {
          return (
            <OutputItem
              data={event}
              allFavorites={allFavorites}
              key={event.id}
              favMessageTimer={favMessageTimer}
            />
          );
        })
      ) : (
        <p style={{ textAlign: 'center' }}>no events found</p>
      )}
      {next < viewEventData?.length && !isLoading && (
        <LoadMoreButton handleMoreEvents={handleMoreEvents} />
      )}
    </article>
  );
};

CategoryOutput.propTypes = {
  viewEventData: PropTypes.array,
  isLoading: PropTypes.bool,
  eventFilter: PropTypes.object,
};

export default CategoryOutput;
