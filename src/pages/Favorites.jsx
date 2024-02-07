import PropTypes from "prop-types";

/* CSS */

import { useEffect, useState } from "react";
import {
  getEventFavoritesData,
  getRegisteredEventsByUser,
} from "../utils/fetchData";
import LoadingElement from "../components/loading/LoadingElement";
import OutputItem from "../components/general/OutputItem";
import DynamicTriggerButton from "../components/buttons/DynamicTriggerButton";
import { useNavigate } from "react-router-dom";
import ToggleFavoritesBar from "../components/events/favorites/ToggleFavoritesBar";
import LoadMoreButton from "../components/buttons/LoadMoreButton";
import style from "./css/Favorites.module.css";

const eventsPerRow = 6;

export function Favorites({ children }) {
  const [toggleButton, setToggleButton] = useState("up");
  const [isLoading, setIsLoading] = useState(false);
  const [favEvents, setFavEvents] = useState({});
  const [registeredEvents, setRegisteredEvents] = useState([]);
  const [next, setNext] = useState(eventsPerRow);

  const navigate = useNavigate();

  useEffect(() => {
    if (
      (favEvents.length === 0 || registeredEvents.length === 0) &&
      !isLoading
    ) {
      fetchFavoriteData();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [toggleButton]);

  const fetchFavoriteData = async () => {
    setIsLoading(true);
    const response = await getEventFavoritesData();

    if (response.length > 0) {
      // Wir erstellen nun aus response ein upcoming und ein past Event array
      const pastEvents = response.filter(
        (events) => new Date(events.date) < new Date()
      );
      const upComingEvents = response.filter(
        (events) => new Date(events.date) >= new Date()
      );

      setFavEvents(() => ({ pastEvents, upComingEvents }));
    }

    // holen uns die registrierten Events für die marker
    await fetchRegisteredEventsData();
  };

  const fetchRegisteredEventsData = async () => {
    const response = await getRegisteredEventsByUser();

    if (response.length > 0) {
      setRegisteredEvents(response);
    }

    setIsLoading(false);
  };

  const handleToggleButton = (value) => {
    setToggleButton(value);

    // Wir sollten den loadmore next state dann auch wieder resetten oder?
    setNext(eventsPerRow);
  };

  const navigateToSearchEvents = () => {
    navigate("/event/search");
  };

  const handleMoreEvents = () => {
    setNext(next + eventsPerRow);
  };

  return (
    <>
      <section className={style.wrapper}>
        <header>
          <section>
            <article className={style.header_article}>
              <h2 className={style.headline}>
                {toggleButton === "up" ? "LIKED EVENTS" : "REGISTERED EVENTS"}
              </h2>
            </article>
          </section>
        </header>
        <main>
          <section className={style.favorite_section}>
            <article>
              <ToggleFavoritesBar
                styles={style}
                onHandleToggleButton={handleToggleButton}
                toggleButton={toggleButton}
              />
            </article>
            <article className={style.favorite_output_wrapper}>
              {isLoading ? (
                <div style={{ marginTop: "200px" }}>
                  <LoadingElement />
                </div>
              ) : (
                <>
                  {toggleButton === "up" &&
                  favEvents.upComingEvents &&
                  favEvents.upComingEvents.length > 0 ? (
                    <>
                      {favEvents.upComingEvents?.slice(0, next).map((event) => (
                        <OutputItem
                          data={event}
                          key={event.id}
                          isOnFavSite={true}
                          registeredEvents={registeredEvents}
                        />
                      ))}
                      {next < favEvents.upComingEvents?.length && (
                        <LoadMoreButton handleMoreEvents={handleMoreEvents} />
                      )}
                    </>
                  ) : toggleButton === "registered" &&
                    registeredEvents &&
                    registeredEvents.length > 0 ? (
                    <>
                      {registeredEvents?.slice(0, next).map((event) => (
                        <OutputItem
                          data={event}
                          key={event.id}
                          isOnFavSite={true}
                          registeredEvents={registeredEvents}
                        />
                      ))}
                      {next < registeredEvents?.length && (
                        <LoadMoreButton handleMoreEvents={handleMoreEvents} />
                      )}
                    </>
                  ) : (
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        marginTop: "30%",
                        gap: "20px",
                      }}
                    >
                      <h2>No Upcoming Events</h2>
                      <p>There are no events yet!</p>
                    </div>
                  )}
                </>
              )}
            </article>
            <article className={style.favorite_button_wrapper}>
              <DynamicTriggerButton
                hasArrow={true}
                onTriggerEventFn={navigateToSearchEvents}
              >
                SEARCH EVENTS
              </DynamicTriggerButton>
            </article>
          </section>
        </main>
      </section>
      {children}
    </>
  );
}

Favorites.propTypes = {
  children: PropTypes.object,
};
