import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import pb from "../lib/pocketbase";
import FallbackLoadingScreen from "../components/loading/FallbackLoadingScreen";
import style from "./css/EventDetails.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { formatDateToString } from "../utils/helperFunction";

export function EventDetails() {
  const [detailEvent, setDetailEvent] = useState([]);
  const [creator, setCreator] = useState([]);
  const { id } = useParams();

  // - fetch für die Eventdaten
  useEffect(() => {
    const getDetailEvent = async () => {
      await fetch(pb.baseUrl + "/api/collections/events/records/" + id)
        .then((response) => response.json())
        .then((data) => setDetailEvent(data));
    };
    getDetailEvent();
  }, []);

  // - fetch für Creator Daten
  useEffect(() => {
    async function getCreator() {
      const record = await pb.collection("users").getOne(detailEvent.creator);
      console.log(record);
      setCreator(record);
    }
    getCreator();
  }, [detailEvent]);

  //   * Bestätigungsmail senden, wenn man sich für das Event registriert
  const sendMail = async () => {
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
          <button className={style.bookmark}>
            <FontAwesomeIcon
              icon={["far", "bookmark"]}
              style={{ color: "#63E6BE", height: "25px" }}
            />
          </button>
          <h1>Event Details</h1>
        </div>

        {detailEvent.registeredUser >= 0 && (
          <div className={style.registered}>
            <img src="../images/Group.png" alt="" />
            <p>{detailEvent.registeredUser.length} registered</p>
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
