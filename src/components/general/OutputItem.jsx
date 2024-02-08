import PropTypes from "prop-types";
import {
  createImagePath,
  displayFavMessage,
  formatDateToString,
} from "../../utils/helperFunction";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBookmark,
  faCircleCheck,
  faLocationDot,
} from "@fortawesome/free-solid-svg-icons";

/* CSS */
import styles from "./OutputItem.module.css";
import { Link } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { addEventFavorites } from "../../utils/fetchData";
import { SetFavoriteMessageContext, ThemeContext } from "../../context/context";

const OutputItem = ({
  data,
  allFavorites,
  favMessageTimer,
  isOnFavSite,
  registeredEvents,
  itemWidth,
}) => {
  const [eventFavorite, setEventFavorite] = useState(null);

  const { setFavMessage } = useContext(SetFavoriteMessageContext);

  useEffect(() => {
    if (isOnFavSite) {
      return;
    }

    // Registrierte Events holen
    const favId = allFavorites.filter((fav) => fav === data.id).join("");

    setEventFavorite(favId);

    if (window.location.pathname !== "/event/search") {
      return () => {
        const cleanUpRef = favMessageTimer;
        if (cleanUpRef.current) {
          clearTimeout(cleanUpRef.current);
          setFavMessage(null);
        }
      };
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data.id, allFavorites, favMessageTimer]);

  const toggleFavorites = async (favId, eventName) => {
    setEventFavorite((cur) => {
      const fav = cur === favId ? null : favId;

      // message einblenden
      if (fav) {
        displayFavMessage(
          `${eventName} was added as a favorite`,
          setFavMessage,
          favMessageTimer,
          "favorites"
        );
      } else {
        displayFavMessage(
          `${eventName} has been removed from favorites`,
          setFavMessage,
          favMessageTimer,
          "favorites"
        );
      }
      console.log(fav);
      return fav;
    });

    // persistieren
    await addEventFavorites(favId);
  };

  const { theme } = useContext(ThemeContext);

  return (
    <section className={theme ? styles.dark : ""}>
      <div className={styles.item_box} width={itemWidth}>
        <img
          src={`${
            createImagePath(data.image, data.id)
              ? createImagePath(data.image, data.id)
              : "/images/No_image_available.svg.png"
          }`}
          alt="event image"
        />
        <div className={styles.item_box_info}>
          <p>{formatDateToString(data.date)}</p>
          <Link to={`/eventdetails/${data.id}`}>
            <h2>{data.name}</h2>
          </Link>
          <div className={styles.item_location} style={{ marginTop: "auto" }}>
            <FontAwesomeIcon icon={faLocationDot} />
            <span>{data.location}</span>
          </div>
        </div>
        <div className={styles.item_favorite}>
          {isOnFavSite ? (
            registeredEvents.some((regEv) => regEv.id === data.id) && (
              <FontAwesomeIcon
                icon={faCircleCheck}
                style={{ color: "#63E6BE", height: "20px", width: "20px" }}
              />
            )
          ) : eventFavorite === data.id ? (
            <FontAwesomeIcon
              icon={faBookmark}
              style={{ color: "#63E6BE", height: "20px", width: "20px" }}
              onClick={() => toggleFavorites(data.id, data.name)}
            />
          ) : (
            <FontAwesomeIcon
              icon={["far", "bookmark"]}
              style={{ color: "#63E6BE", height: "20px", width: "20px" }}
              onClick={() => toggleFavorites(data.id, data.name)}
            />
          )}
        </div>
      </div>
    </section>
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
