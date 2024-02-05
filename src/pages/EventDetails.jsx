import { useState, useEffect, useContext, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import pb from '../lib/pocketbase';
import FallbackLoadingScreen from '../components/loading/FallbackLoadingScreen';
import style from './css/EventDetails.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { displayFavMessage, formatDateToString } from '../utils/helperFunction';
import { addEventFavorites, getEventFavorites } from '../utils/fetchData';
import { SetFavoriteMessageContext } from '../context/context';
import { faBookmark } from '@fortawesome/free-solid-svg-icons';

export function EventDetails() {
  const [detailEvent, setDetailEvent] = useState([]);
  const [registered, setRegistered] = useState([]);
  const [creator, setCreator] = useState([]);
  const [eventFavorite, setEventFavorite] = useState(null);

  const favMessageTimer = useRef(null);

  const { id } = useParams();

  const { setFavMessage } = useContext(SetFavoriteMessageContext);

  // - fetch für die Eventdaten
  useEffect(() => {
    const getDetailEvent = async () => {
      await fetch(pb.baseUrl + '/api/collections/events/records/' + id)
        .then((response) => response.json())
        .then((data) => {
          setDetailEvent(data);
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

      const record = await pb.collection("users").getOne(detailEvent.creator);

      setCreator(record);
    }
    getCreator();
    // Holen uns die Favs aus DB
  }, [detailEvent]);

  //   * Bestätigungsmail senden, wenn man sich für das Event registriert

  const sendMail = () => {
    const Mail = async () => {
      console.log("sendmail function");
      await fetch(import.meta.env.VITE_BACKEND + "/sendmail", {
        method: "POST",
        body: JSON.stringify({
          email: pb.authStore.model.email,
          name: pb.authStore.model.firstname,
          event: detailEvent.name,
        }),
        headers: {
          "content-type": "application/json",
        },
      });
    };
    const registerUser = async () => {
      await pb.collection("events").update(detailEvent.id, {
        "registeredUser+": [pb.authStore.model.id],
      });
    };
    Mail();
    registerUser();
  };



  const toggleFavorites = async (favId, eventName) => {
    setEventFavorite((cur) => {
      const fav = cur === favId ? null : favId;

      // message einblenden
      if (fav) {
        displayFavMessage(
          `${eventName} wurde als Favoriten hinzugefügt`,
          setFavMessage,
          favMessageTimer
        );
      } else {
        displayFavMessage(
          `${eventName} wurde aus den Favoriten entfernt`,
          setFavMessage,
          favMessageTimer
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


  if (detailEvent && creator) {
    return (
      <main className={style.main}>
        <img
          className={style.img}
          src={`${pb.baseUrl}/api/files/${detailEvent.collectionId}/${detailEvent.id}/${detailEvent.image}`}
          alt="Image"
        />
        <div className={style.eventDetails}>
          <Link to="/event/search">←</Link>
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
          <h1>Event Details</h1>
        </div>

        {detailEvent.registeredUser?.length >= 0 && (
          <div className={style.registered}>
            <img src="../images/Group.png" alt="" />
            <p>{detailEvent.registeredUser?.length} registered</p>
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
                src={`${pb.baseUrl}/api/files/${creator.collectionId}/${creator.id}/${creator.profilImage}`}
                alt="Profilbild des Creators"
              />
              <div className={style.creatorname}>
                <p>{creator.firstname}</p>
                <p>Organizer</p>
              </div>
            </div>

            <button>Follow</button>
          </Link>
          <div className={style.description}>
            <p>About Event:</p>
            <p>{detailEvent.description}</p>
          </div>

          <button className={style.register} onClick={sendMail}>
            REGISTER
          </button>
        </section>
      </main>
    );
  } else {
    return <FallbackLoadingScreen />;
  }
}
