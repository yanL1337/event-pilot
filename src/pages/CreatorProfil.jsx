import { useParams, Link } from "react-router-dom";
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
  const [followed, setFollowed] = useState(false);
  const [following, setFollowing] = useState();
  const { id } = useParams();

  useEffect(() => {
    async function getCreator() {
      const record = await pb.collection("users").getOne(id);
      setCreator(record);
    }
    getCreator();
  }, [followed]);

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
    setColor((prev) => !prev);
  }

  function events() {
    setState("events");
    setColor((prev) => !prev);
  }

  function reviews() {
    setState("reviews");
    setColor((prev) => !prev);
  }

  //* follow/unfollow-function
  async function follow() {
    let vorhanden = false;
    creator.follower.forEach((userID) => {
      userID == pb.authStore.model.id ? (vorhanden = true) : false;
    });
    console.log("Vorhanden?:", vorhanden);

    if (!vorhanden) {
      const record = await pb
        .collection("users")
        .update(creator.id, { "follower+": [pb.authStore.model.id] });
      console.log("follower wurde hinzugefügt: ", record);
      setFollowed((prev) => !prev);
    } else {
      const record = await pb
        .collection("users")
        .update(creator.id, { "follower-": [pb.authStore.model.id] });
      setFollowed((prev) => !prev);
      console.log("follower wurde entfernt: ", record);
    }
  }

  // * following
  useEffect(() => {
    let count = 0;
    const getFollowing = async () => {
      const records = await pb.collection("users").getFullList();

      records.forEach((userRecord) =>
        userRecord?.follower.forEach((follower) =>
          follower == creator?.id ? count++ : null
        )
      );
      setFollowing(count);
    };
    getFollowing();
  }, [creator]);

  //   ======================================
  if (creator) {
    if (state === "about") {
      return (
        <main>
          <Link to="/home">←</Link>
          <h2>{creator.firstname}</h2>
          <img
            className={style.creatorprofil_img}
            src={`${pb.baseUrl}/api/files/${creator.collectionId}/${creator.id}/${creator.profilImage}`}
            alt="Profilbild des Creators"
          />
          <p>Follower {creator.follower?.length}</p>
          <p>Following {following}</p>
          <button className={style.followbutton} onClick={follow}>
            follow
          </button>

          <div className={style.tabs}>
            <button className={color ? style.lila : null} onClick={about}>
              ABOUT
            </button>
            <button className={color ? style.lila : null} onClick={events}>
              EVENTS
            </button>
            <button className={color ? style.lila : null} onClick={reviews}>
              REVIEWS
            </button>
          </div>

          <h1>ABOUT</h1>
          <p>{creator.description}</p>
        </main>
      );
    } else if (state === "events") {
      return (
        <main>
          <Link to="/home">←</Link>
          <h2>{creator.firstname}</h2>
          <img
            className={style.creatorprofil_img}
            src={`${pb.baseUrl}/api/files/${creator.collectionId}/${creator.id}/${creator.profilImage}`}
            alt="Profilbild des Creators"
          />
          <p>Follower {creator.follower?.length}</p>
          <button className={color ? style.lila : null} onClick={follow}>
            follow
          </button>
          <button onClick={unfollow}>unfollow</button>

          <div className={style.tabs}>
            <button className={color ? style.lila : null} onClick={about}>
              ABOUT
            </button>
            <button className={color ? style.lila : null} onClick={events}>
              EVENTS
            </button>
            <button className={color ? style.lila : null} onClick={reviews}>
              REVIEWS
            </button>
          </div>
          <h1>EVENTS</h1>
          {event.items.map((singleEvent) => {
            return <CreatorEvent singleEvent={singleEvent} />;
          })}
        </main>
      );
    } else if (state === "reviews") {
      return (
        <main>
          <Link to="/home">←</Link>
          <h2>{creator.firstname}</h2>
          <img
            className={style.creatorprofil_img}
            src={`${pb.baseUrl}/api/files/${creator.collectionId}/${creator.id}/${creator.profilImage}`}
            alt="Profilbild des Creators"
          />
          <p>Follower {creator.follower?.length}</p>
          <button className={color ? style.lila : null} onClick={follow}>
            follow
          </button>
          <button onClick={unfollow}>unfollow</button>

          <div className={style.tabs}>
            <button className={color ? style.lila : null} onClick={about}>
              ABOUT
            </button>
            <button className={color ? style.lila : null} onClick={events}>
              EVENTS
            </button>
            <button className={color ? style.lila : null} onClick={reviews}>
              REVIEWS
            </button>
          </div>
          <h1>REVIEWS</h1>
        </main>
      );
    } else {
      return <FallbackLoadingScreen />;
    }
  }
}
