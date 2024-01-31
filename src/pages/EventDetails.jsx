import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import pb from "../lib/pocketbase";
import FallbackLoadingScreen from "../components/loading/FallbackLoadingScreen";

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

  console.log("Creator: ", creator);

  // console.log("Detailevent: ", detailEvent);

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

  // * für Datum und Uhrzeit
  const date = new Date(detailEvent.date);
  const year = date.getFullYear();
  const month = date.getMonth();
  const day = date.getDate();
  const hours = date.getHours();
  const minutes = date.getMinutes();

  if (detailEvent && creator) {
    return (
      <main>
        <h1>Eventdetails</h1>
        <img
          src={`${pb.baseUrl}/api/files/${detailEvent.collectionId}/${detailEvent.id}/${detailEvent.image}`}
          alt="Image"
        />
        {detailEvent.registeredUser >= 0 && (
          <p>{detailEvent.registeredUser.length} registered</p>
        )}

        <p>{detailEvent.name}</p>
        <p>{detailEvent.category}</p>
        <p>About Event:</p>
        <p>{detailEvent.description}</p>
        <p>{detailEvent.location}</p>
        <p>
          {day}.{month + 1}.{year} {hours - 1}:{minutes}0 Uhr
        </p>
        <Link to={`/creator/${creator.id}`}>
          <p>{creator.firstname}</p>
          <p>Organizer</p>
          <button>Follow</button>
        </Link>
        <button onClick={sendMail}>register</button>
      </main>
    );
  } else {
    return <FallbackLoadingScreen />;
  }
}
