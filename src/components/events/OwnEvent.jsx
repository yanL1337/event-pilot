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
import { useContext } from "react";
import { SetFavoriteMessageContext, ThemeContext } from "../../context/context";

export function OwnEvent({ singleEvent, favMessageTimer, onDeleteEvents }) {
  // const [singleEventState, setSingleEventState] = useState(true);

  const { setFavMessage } = useContext(SetFavoriteMessageContext);
  const { theme } = useContext(ThemeContext);

  async function deleteEvent(eventName, eventId) {
    onDeleteEvents(eventId);
    await pb.collection("events").delete(eventId);

    displayFavMessage(
      `Das Event ${eventName} wurde gelöscht`,
      setFavMessage,
      favMessageTimer,
      "deleteEvent"
    );
  }

  return (
    <section className={`${style.wrapper} ${theme ? style.dark : ""}`}>
      <Link
        className={style.categoryOutput_box}
        to={`/eventdetails/${singleEvent.id}`}
      >
        <img
          src={`${
            createImagePath(singleEvent.image, singleEvent.id)
              ? createImagePath(singleEvent.image, singleEvent.id)
              : "/images/No_image_available.svg.png"
          }`}
          alt="event image"
        />
        <div className={style.categoryOutput_box_info}>
          <p>{formatDateToString(singleEvent.date)}</p>
          <h2>{singleEvent.name}</h2>
          <div
            className={style.categoryOutput_location}
            style={{ marginTop: "auto" }}
          >
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
    </section>
  );
}

OwnEvent.propTypes = {
  singleEvent: PropTypes.object,
  favMessageTimer: PropTypes.object,
  setRefresh: PropTypes.func,
};
