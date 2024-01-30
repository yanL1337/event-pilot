import PocketBase from "pocketbase";
import { useState, useEffect } from "react";

export function EventDetails() {
  const [detailEvent, setDetailEvent] = useState([]);
  const pb = new PocketBase("https://event-pilot.pockethost.io");

  useEffect(() => {
    const getDetailEvent = async () => {
      await fetch(
        "https://event-pilot.pockethost.io" +
          "/api/collections/events/records/3vs2qi7yoookt8n"
      )
        .then((response) => response.json())
        .then((data) => setDetailEvent(data));
    };
    getDetailEvent();
  }, []);

  console.log("Detailevent: ", detailEvent);

  //   * Bestätigungsmail senden, wenn man sich für das Event registriert
  function sendMail() {
    console.log("send mail function");
  }

  if (!detailEvent) return <p>loading</p>;
  return (
    <main>
      <h1>Eventdetails</h1>
      <img
        src={`https://event-pilot.pockethost.io/api/files/${detailEvent.collectionId}/${detailEvent.id}/${detailEvent.image}`}
        alt="Image"
      />
      <p>{detailEvent.name}</p>
      <p>{detailEvent.category}</p>
      <p>{detailEvent.description}</p>
      <p>{detailEvent.location}</p>
      <p>{detailEvent.creator}</p>
      <button onClick={sendMail}>register</button>
    </main>
  );
}
