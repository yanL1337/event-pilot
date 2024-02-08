import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import {
  createImagePath,
  displayFavMessage,
  formatDateToString,
} from "../../utils/helperFunction";
import { faLocationDot } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import style from "./CreatorEvent.module.css";
import pb from "../../lib/pocketbase";
import { useContext, forwardRef, useState } from 'react'; // Importieren von useContext und forwardRef
import { SetFavoriteMessageContext, ThemeContext } from "../../context/context";
import LoadingElement from '../loading/LoadingElement';


const OwnEvent = forwardRef(({ singleEvent, favMessageTimer, onDeleteEvents }, ref) => {
  // Verwenden von forwardRef
  const { setFavMessage } = useContext(SetFavoriteMessageContext);

  const { theme } = useContext(ThemeContext);
  const [isLoading, setIsLoading] = useState(false);


  async function deleteEvent(eventName, eventId) {
    setIsLoading(true);
    onDeleteEvents(eventId);

    await pb.collection('events').delete(eventId);
    setIsLoading(false);


    displayFavMessage(
      `The event ${eventName} has been deleted`,
      setFavMessage,
      favMessageTimer,
      "deleteEvent"
    );
  }

  return (
    <section ref={ref} className={`${style.wrapper} ${theme ? style.dark : ""}`}>
      {!isLoading ? (
        <>
          {/* Hinzufügen von ref zum Wurzelelement */}
          <Link className={style.categoryOutput_box} to={`/eventdetails/${singleEvent.id}`}>
            <img
              src={
                createImagePath(singleEvent.image, singleEvent.id) ||
                '/images/No_image_available.svg.png'
              }
              alt="event image"
            />
            <div className={style.categoryOutput_box_info}>
              <p>{formatDateToString(singleEvent.date)}</p>
              <h2>{singleEvent.name}</h2>
              <div className={style.categoryOutput_location} style={{ marginTop: 'auto' }}>
                <FontAwesomeIcon icon={faLocationDot} />
                <span>{singleEvent.location}</span>
              </div>
            </div>
          </Link>
          <button
            className={style.deletebutton}
            onClick={() => deleteEvent(singleEvent.name, singleEvent.id)}
          >
            ✘
          </button>
        </>
      ) : (
        <LoadingElement />
      )}
    </section>
  );
});

OwnEvent.displayName = 'OwnEvent';

OwnEvent.propTypes = {
  singleEvent: PropTypes.object,
  favMessageTimer: PropTypes.object,
  onDeleteEvents: PropTypes.func,
};

export default OwnEvent;
