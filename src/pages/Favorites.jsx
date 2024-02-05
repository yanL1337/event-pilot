import PropTypes from 'prop-types';

/* CSS */
import styles from './Favorites.module.css';
import { useEffect, useState } from 'react';
import { getEventFavoritesData, getRegisteredEventsByUser } from '../utils/fetchData';
import LoadingElement from '../components/loading/LoadingElement';
import OutputItem from '../components/general/OutputItem';
import DynamicTriggerButton from '../components/buttons/DynamicTriggerButton';
import { useNavigate } from 'react-router-dom';
import ToggleFavoritesBar from '../components/events/favorites/ToggleFavoritesBar';

export function Favorites({ children }) {
  const [toggleButton, setToggleButton] = useState('up');
  const [isLoading, setIsLoading] = useState(false);
  const [favEvents, setFavEvents] = useState({});
  const [registeredEvents, setRegisteredEvents] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    fetchFavoriteData();

    // Wir holen uns nur die registered Events wenn wir noch keine haben
    // if (registeredEvents.length === 0) {
    fetchRegisteredEventsData();
    // }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [toggleButton]);

  const fetchFavoriteData = async () => {
    setIsLoading(true);
    const response = await getEventFavoritesData();

    if (response.length > 0) {
      // Wir erstellen nun aus response ein upcoming und ein past Event array
      const pastEvents = response.filter((events) => new Date(events.date) < new Date());
      const upComingEvents = response.filter((events) => new Date(events.date) >= new Date());

      setFavEvents(() => ({ pastEvents, upComingEvents }));
    }

    // holen uns die registrierten Events für die marker

    setIsLoading(false);

    // Loading data in up und past splitten
  };

  const fetchRegisteredEventsData = async () => {
    setIsLoading(true);
    const response = await getRegisteredEventsByUser();

    if (response.length > 0) {
      setRegisteredEvents(response);
    }

    setIsLoading(false);
  };

  const handleToggleButton = (value) => {
    setToggleButton(value);
  };

  const navigateToSearchEvents = () => {
    navigate('/event/search');
  };

  return (
    <>
      <section className={styles.favorite_section}>
        <article>
          <ToggleFavoritesBar
            styles={styles}
            onHandleToggleButton={handleToggleButton}
            toggleButton={toggleButton}
          />
        </article>
        <article className={styles.favorite_output_wrapper}>
          {isLoading ? (
            <div style={{ marginTop: '200px' }}>
              <LoadingElement />
            </div>
          ) : (
            <>
              {toggleButton === 'up' &&
              favEvents.upComingEvents &&
              favEvents.upComingEvents.length > 0
                ? favEvents.upComingEvents.map((event) => (
                    <OutputItem
                      data={event}
                      key={event.id}
                      isOnFavSite={true}
                      registeredEvents={registeredEvents}
                    />
                  ))
                : toggleButton === 'registered' && registeredEvents && registeredEvents.length > 0
                ? registeredEvents.map((event) => (
                    <OutputItem
                      data={event}
                      key={event.id}
                      isOnFavSite={true}
                      registeredEvents={registeredEvents}
                    />
                  ))
                : !isLoading && (
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginTop: '30%',
                        gap: '20px',
                      }}
                    >
                      <h2>No Upcoming Events</h2>
                      <p>There are no events yet!</p>
                    </div>
                  )}
            </>
          )}
        </article>
        <article className={styles.favorite_button_wrapper}>
          <DynamicTriggerButton hasArrow={true} onTriggerEventFn={navigateToSearchEvents}>
            SEARCH EVENTS
          </DynamicTriggerButton>
        </article>
      </section>
      {children}
    </>
  );
}

Favorites.propTypes = {
  children: PropTypes.object,
};
