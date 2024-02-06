import { Link } from "react-router-dom";
import {
  createImagePath,
  formatDateToString,
} from "../../utils/helperFunction";
import { faLocationDot } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import style from "./CreatorEvent.module.css";
import pb from "../../lib/pocketbase";

export function OwnEvent({ singleEvent }) {
  async function deleteEvent() {
    await pb.collection("events").delete(singleEvent.id);
    console.log("Event abgesagt!!!!!");
  }
  return (
    <section className={style.wrapper}>
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
      <button className={style.deletebutton} onClick={deleteEvent}>
        ✘
      </button>
    </section>
  );
}
