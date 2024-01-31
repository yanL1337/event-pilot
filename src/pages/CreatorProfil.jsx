import { useParams } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import pb from "../lib/pocketbase";
import style from "./css/CreatorProfile.module.css";
import { CreatorEvent } from "../components/events/CreatorEvents";
import FallbackLoadingScreen from "../components/loading/FallbackLoadingScreen";

export function CreatorProfil() {
  const [creator, setCreator] = useState([]);
  const [state, setState] = useState("about");
  const [event, setEvent] = useState();
  const [color, setColor] = useState(false);
  const { id } = useParams();

  useEffect(() => {
    async function getCreator() {
      const record = await pb.collection("users").getOne(id);
      setCreator(record);
    }
    getCreator();
  }, []);

  //   console.log("Creator: ", creator);

  //* events des creators fetchen
  useEffect(() => {
    async function getEvents() {
      const resultList = await pb.collection("events").getList(1, 50, {
        filter: `creator="${creator?.id}"`,
      });
      setEvent(resultList);
    }
    getEvents();
  }, [creator]);

  //   console.log("Events: ", event);

  //- functions für die verschiedenen Tabs
  function about() {
    setState("about");
    setColor(true);
  }

  function events() {
    setState("events");
    setColor(true);
  }

  function reviews() {
    setState("reviews");
    setColor(true);
  }

  //* follow/unfollow-function
  async function follow() {
    const record = await pb
      .collection("users")
      .update(creator.id, { "follower+": [pb.authStore.model.id] });
    console.log("updated creator: ", record);
    setColor(true);
  }

  async function unfollow() {
    const record = await pb
      .collection("users")
      .update(creator.id, { "follower-": [pb.authStore.model.id] });
    setColor(false);
    console.log("updated creator: ", record);
  }

  //   ======================================
  if (creator && event) {
    if (state === "about") {
      return (
        <main>
          <h2>Creator Profil</h2>
          <img
            src={`${pb.baseUrl}/api/files/${creator.collectionId}/${creator.id}/${creator.profilImage}`}
            alt="Profilbild des Creators"
          />
          <button className={color ? style.lila : null} onClick={follow}>
            follow
          </button>
          <button onClick={unfollow}>unfollow</button>
          <p>Follower {creator.follower?.length}</p>
          <p>{creator.firstname}</p>

          <button onClick={about}>About</button>
          <button onClick={events}>Events</button>
          <button onClick={reviews}>Reviews</button>
          <h1>ABOUT</h1>
          <p>{creator.description}</p>
        </main>
      );
    } else if (state === "events") {
      return (
        <main>
          <h2>Creator Profil</h2>
          <img
            src={`${pb.baseUrl}/api/files/${creator.collectionId}/${creator.id}/${creator.profilImage}`}
            alt="Profilbild des Creators"
          />
          <button onClick={follow}>follow</button>
          <p>Follower {creator.follower?.length}</p>
          <p>{creator.firstname}</p>

          <button onClick={about}>About</button>
          <button onClick={events}>Events</button>
          <button onClick={reviews}>Reviews</button>
          <h1>EVENTS</h1>
          {event.items.map((singleEvent) => {
            return <CreatorEvent singleEvent={singleEvent} />;
          })}
        </main>
      );
    } else if (state === "reviews") {
      return (
        <main>
          <h2>Creator Profil</h2>
          <img
            src={`${pb.baseUrl}/api/files/${creator.collectionId}/${creator.id}/${creator.profilImage}`}
            alt="Profilbild des Creators"
          />
          <button onClick={follow}>follow</button>
          <p>Follower {creator.follower?.length}</p>
          <p>{creator.firstname}</p>

          <button onClick={about}>About</button>
          <button onClick={events}>Events</button>
          <button onClick={reviews}>Reviews</button>
          <h1>REVIEWS</h1>
        </main>
      );
    } else {
      return <FallbackLoadingScreen />;
    }
  }
}
