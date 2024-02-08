import { useState, useEffect, useContext, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import pb from '../lib/pocketbase';
import FallbackLoadingScreen from '../components/loading/FallbackLoadingScreen';
import style from './css/EventDetails.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { displayFavMessage, formatDateToString } from '../utils/helperFunction';
import { addEventFavorites, addRegisteredEvents, getEventFavorites } from '../utils/fetchData';
import { SetFavoriteMessageContext, ThemeContext } from '../context/context';
import { faBookmark } from '@fortawesome/free-solid-svg-icons';
import DynamicTriggerButton from '../components/buttons/DynamicTriggerButton';
import { Header } from '../components/header/Header';
import LoadingElement from '../components/loading/LoadingElement';

export function EventDetails() {
  const { theme } = useContext(ThemeContext);
  const [detailEvent, setDetailEvent] = useState(null);
  const [registered, setRegistered] = useState(false);
  const [creator, setCreator] = useState([]);
  const [eventFavorite, setEventFavorite] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingRegister, setIsLoadingRegister] = useState(false);
  const [registeredUserCount, setRegisteredUserCount] = useState(0);
  const [initialLoad, setInitialLoad] = useState(true);

  const favMessageTimer = useRef(null);
  const { id } = useParams();
  const { setFavMessage } = useContext(SetFavoriteMessageContext);

  // - fetch für die Eventdaten
  useEffect(() => {
    const getDetailEvent = async () => {
      setIsLoading(true);
      await fetch(pb.baseUrl + '/api/collections/events/records/' + id)
        .then((response) => response.json())
        .then((data) => {
          // Wir setten die Event details
          setDetailEvent(data);
          // Wir setten die Registered User Anzahl
          setRegisteredUserCount(data.registeredUser?.length);

          // Wir checken ab ob user schon registriert ist
          const hasRegistered = data.registeredUser.some((id) => id === pb.authStore.model.id);

          setRegistered(hasRegistered);
          setIsLoading(false);
        });
    };

    getDetailEvent();

    getFavByUser();

    return () => {
      const cleanUpRef = favMessageTimer;
      if (cleanUpRef.current) {
        clearTimeout(cleanUpRef.current);
        setFavMessage(null);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // - fetch für Creator Daten
  useEffect(() => {
    async function getCreator() {
      const record = await pb.collection('users').getOne(detailEvent.creator);

      setCreator(record);
      setInitialLoad(false);
    }

    if (detailEvent) {
      getCreator();
    }

    // Holen uns die Favs aus DB
  }, [detailEvent]);

  useEffect(() => {
    // Die Meldung nicht beim neuladen des Components erscheinen
    if (registered && !initialLoad) {
      displayFavMessage(
        `You have registered with ${detailEvent.name}`,
        setFavMessage,
        favMessageTimer,
        'registerEvent'
      );
      setRegisteredUserCount((count) => count + 1);
    } else if (!registered && !initialLoad) {
      displayFavMessage(
        `You have unregister by ${detailEvent.name}`,
        setFavMessage,
        favMessageTimer,
        'deleteEvent'
      );
      setRegisteredUserCount((count) => count - 1);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [registered]);

  //   * Bestätigungsmail senden und Banner, wenn man sich für das Event registriert

  const register = async () => {
    setIsLoadingRegister(true);
    setRegistered((cur) => !cur);

    const Mail = async () => {
      await fetch(import.meta.env.VITE_BACKEND + '/sendmail', {
        method: 'POST',
        body: JSON.stringify({
          email: pb.authStore.model.email,
          name: pb.authStore.model.firstname,
          event: detailEvent.name,
        }),
        headers: {
          'content-type': 'application/json',
        },
      });
    };

    const response = await addRegisteredEvents(detailEvent.id);

    if (response) {
      Mail();
    }
    setIsLoadingRegister(false);
  };

  const toggleFavorites = async (favId, eventName) => {
    setEventFavorite((cur) => {
      const fav = cur === favId ? null : favId;

      // message einblenden
      if (fav) {
        displayFavMessage(
          `${eventName} was added as a favorite`,
          setFavMessage,
          favMessageTimer,
          'favorites'
        );
      } else {
        displayFavMessage(
          `${eventName} has been removed from favorites`,
          setFavMessage,
          favMessageTimer,
          'favorites'
        );
      }

      return fav;
    });

    // persistieren
    await addEventFavorites(favId);
  };

  const getFavByUser = async () => {
    const response = await getEventFavorites();
    if (response) {
      const favId = response.filter((fav) => fav === id).join('');
      setEventFavorite(favId);
    }
  };

  if (detailEvent && creator && !isLoading) {
    return (
      <section className={theme ? style.dark : null}>
        <main className={style.main}>
          <img
            className={style.img}
            src={`${
              detailEvent.image
                ? pb.baseUrl +
                  '/api/files/' +
                  detailEvent.collectionId +
                  '/' +
                  detailEvent.id +
                  '/' +
                  detailEvent.image
                : '/images/No_image_available.svg.png'
            }`}
            alt="Image"
          />
          <div className={style.eventDetails}>
            <Link to="/event/search" style={{ fontSize: '2rem' }}>
              ←
            </Link>
            <h1>Event Details</h1>
            {eventFavorite === detailEvent.id ? (
              <button
                className={style.bookmark}
                onClick={() => toggleFavorites(detailEvent.id, detailEvent.name)}
              >
                <FontAwesomeIcon
                  icon={faBookmark}
                  style={{ color: '#63E6BE', height: '20px', width: '20px' }}
                />
              </button>
            ) : (
              <button
                className={style.bookmark}
                onClick={() => toggleFavorites(detailEvent.id, detailEvent.name)}
              >
                <FontAwesomeIcon
                  icon={['far', 'bookmark']}
                  style={{ color: '#63E6BE', height: '25px' }}
                />
              </button>
            )}
          </div>

          {detailEvent.registeredUser?.length >= 0 && (
            <div className={style.registered}>
              <img src="../images/Group.png" alt="" />
              <p>{registeredUserCount} registered</p>
            </div>
          )}

          <section className={style.section}>
            <p className={style.eventname}>{detailEvent.name}</p>

            <div className={style.div}>
              <img src="../images/Location.png" alt="" />
              <p>{detailEvent.location}</p>
            </div>

            <div className={style.div}>
              <img src="../images/Date.png" alt="" />
              <p>{formatDateToString(detailEvent.date)}</p>
            </div>

            <Link className={style.creator} to={`/creator/${creator.id}`}>
              <div className={style.creatordiv}>
                <img
                  src={`${
                    creator.profilImage
                      ? pb.baseUrl +
                        '/api/files/' +
                        creator.collectionId +
                        '/' +
                        creator.id +
                        '/' +
                        creator.profilImage
                      : '/images/No_image_available.svg.png'
                  }`}
                  alt="Profilbild des Creators"
                />
                <div className={style.creatorname}>
                  <p>{creator.firstname}</p>
                  <p>Organizer</p>
                </div>
              </div>
            </Link>
            <div className={style.description}>
              <p>About Event:</p>
              <p>{detailEvent.description}</p>
            </div>

            {!isLoadingRegister ? (
              <DynamicTriggerButton
                className={style.register}
                hasArrow={true}
                onTriggerEventFn={register}
              >
                {registered ? 'UNREGISTER' : 'REGISTER'}
              </DynamicTriggerButton>
            ) : (
              <LoadingElement />
            )}
          </section>
        </main>
      </section>
    );
  } else {
    return <FallbackLoadingScreen />;
  }
}
