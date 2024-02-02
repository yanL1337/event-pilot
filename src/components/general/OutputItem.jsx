import PropTypes from 'prop-types';
import { createImagePath, formatDateToString } from '../../utils/helperFunction';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBookmark, faCircleCheck, faLocationDot } from '@fortawesome/free-solid-svg-icons';

/* CSS */
import styles from './OutputItem.module.css';
import { Link } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import { addEventFavorites } from '../../utils/fetchData';
import { SetFavoriteMessageContext } from '../../context/context';

const OutputItem = ({ data, allFavorites, favMessageTimer, isOnFavSite, registeredEvents }) => {
  const [eventFavorite, setEventFavorite] = useState(null);

  const { setFavMessage } = useContext(SetFavoriteMessageContext);

  useEffect(() => {
    if (isOnFavSite) {
      // Registrierte Events holen
      return;
    }

    const favId = allFavorites.filter((fav) => fav === data.id).join('');

    setEventFavorite(favId);

    return () => {
      if (favMessageTimer.current) {
        clearTimeout(favMessageTimer.current);
        setFavMessage(null);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data.id, allFavorites, favMessageTimer]);

  const toggleFavorites = async (favId, eventName) => {
    setEventFavorite((cur) => {
      const fav = cur === favId ? null : favId;

      // message einblenden
      if (fav) {
        displayFavMessage(`${eventName} wurde als Favoriten hinzugefügt`);
      } else {
        displayFavMessage(`${eventName} wurde aus den Favoriten entfernt`);
      }

      return fav;
    });

    // persistieren
    await addEventFavorites(favId);
  };

  const displayFavMessage = (message) => {
    setFavMessage(message);

    // Wir löschen wieder den Timer wenn eine neue message reinkommt
    if (favMessageTimer.current) {
      clearTimeout(favMessageTimer.current);
    }

    favMessageTimer.current = setTimeout(() => {
      setFavMessage(null);
      favMessageTimer.current = null;
    }, 3000);
  };

  return (
    <div className={styles.item_box}>
      <img
        src={`${
          createImagePath(data.image, data.id)
            ? createImagePath(data.image, data.id)
            : '/images/No_image_available.svg.png'
        }`}
        alt="event image"
      />
      <div className={styles.item_box_info}>
        <p>{formatDateToString(data.date)}</p>
        <Link to={`/eventdetails/${data.id}`}>
          <h2>{data.name}</h2>
        </Link>
        <div className={styles.item_location} style={{ marginTop: 'auto' }}>
          <FontAwesomeIcon icon={faLocationDot} />
          <span>{data.location}</span>
        </div>
      </div>
      <div className={styles.item_favorite}>
        {isOnFavSite ? (
          registeredEvents.includes(data.id) && (
            <FontAwesomeIcon
              icon={faCircleCheck}
              style={{ color: '#63E6BE', height: '20px', width: '20px' }}
            />
          )
        ) : eventFavorite === data.id ? (
          <FontAwesomeIcon
            icon={faBookmark}
            style={{ color: '#63E6BE', height: '20px', width: '20px' }}
            onClick={() => toggleFavorites(data.id, data.name)}
          />
        ) : (
          <FontAwesomeIcon
            icon={['far', 'bookmark']}
            style={{ color: '#63E6BE', height: '20px', width: '20px' }}
            onClick={() => toggleFavorites(data.id, data.name)}
          />
        )}
      </div>
    </div>
  );
};

OutputItem.propTypes = {
  data: PropTypes.object,
  allFavorites: PropTypes.array,
  favMessageTimer: PropTypes.object,
  isOnFavSite: PropTypes.bool,
  registeredEvents: PropTypes.array,
};

export default OutputItem;
