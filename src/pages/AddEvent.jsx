import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import AddEventForm from "../components/events/AddEventForm";
import { faArrowLeftLong } from "@fortawesome/free-solid-svg-icons";

/* CSS */
import style from "./css/AddEvent.module.css";
import { useNavigate } from "react-router";

const AddEvent = () => {
  const navigate = useNavigate();

  const navigateBack = () => {
    navigate(-1);
  };

  return (
    <>
      <header>
        <section>
          <article className={style.header_article}>
            <FontAwesomeIcon
              icon={faArrowLeftLong}
              className={style.arrow}
              onClick={navigateBack}
            />
            <h2>
              Add <span className={style.green_h2}>Event</span>
            </h2>
          </article>
        </section>
      </header>
      <AddEventForm />
    </>
  );
};

export default AddEvent;
