import { useParams, Link } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import pb from "../lib/pocketbase";
import style from "./css/CreatorProfile.module.css";
import { CreatorEvent } from "../components/events/CreatorEvents";
import FallbackLoadingScreen from "../components/loading/FallbackLoadingScreen";
import { Comment } from "../components/review/Comment";
import { Rating } from "../components/review/Rating";
import styles from "./css/Review.module.css";
import { Header } from "../components/header/Header";

export function CreatorProfil() {
  const [creator, setCreator] = useState([]);
  const [state, setState] = useState("about");
  const [event, setEvent] = useState();
  const [comments, setComments] = useState();

  const [colorAbout, setColorAbout] = useState(true);
  const [colorEvents, setColorEvents] = useState(false);
  const [colorReviews, setColorReviews] = useState(false);

  const [followed, setFollowed] = useState();
  const [following, setFollowing] = useState();
  const { id } = useParams();

  useEffect(() => {
    async function getCreator() {
      const record = await pb.collection("users").getOne(id);
      setCreator(record);
    }
    getCreator();
  }, [followed]);

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

  //* comments des creators fetchen
  useEffect(() => {
    async function getComments() {
      const commentList = await pb.collection("reviews").getList(1, 20, {
        filter: `creator_id="${creator?.id}"`,
        sort: "-created",
      });
      setComments(commentList);
    }
    getComments();
  }, [creator]);

  //- functions für die verschiedenen Tabs
  function about() {
    setState("about");
    setColorAbout(true);
    setColorEvents(false);
    setColorReviews(false);
  }

  function events() {
    setState("events");
    setColorAbout(false);
    setColorEvents(true);
    setColorReviews(false);
  }

  function reviews() {
    setState("reviews");
    setColorAbout(false);
    setColorEvents(false);
    setColorReviews(true);
  }

  //* follow/unfollow-function
  useEffect(() => {
    async function startFollow() {
      creator.follower?.forEach((userID) => {
        userID == pb.authStore.model.id ? setFollowed(true) : false;
      });
    }
    startFollow();
  }, [creator]);

  async function follow() {
    if (!followed) {
      await pb
        .collection("users")
        .update(creator.id, { "follower+": [pb.authStore.model.id] });
      setFollowed(true);
    } else {
      await pb
        .collection("users")
        .update(creator.id, { "follower-": [pb.authStore.model.id] });
      setFollowed(false);
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
        <main className={style.wrapper}>
          <Header headertext={creator.firstname} />

          <img
            className={style.creatorprofil_img}
            src={`${pb.baseUrl}/api/files/${creator.collectionId}/${creator.id}/${creator.profilImage}`}
            alt="Profilbild des Creators"
          />
          <div className={style.followdiv}>
            <div className={style.follow}>
              <p>{following}</p>
              <p className={style.light}>Following</p>
            </div>
            <div>
              <p>{creator.follower?.length}</p>
              <p className={style.light}>Followers</p>
            </div>
          </div>
          <div className={style.button}>
            <button
              className={
                followed ? style.activefollowbutton : style.followbutton
              }
              onClick={follow}
            >
              Follow
            </button>
            <Link to={`/review/${id}`}>Review</Link>
          </div>

          <div className={style.tabs}>
            <button
              className={colorAbout ? style.activeTab : null}
              onClick={about}
            >
              ABOUT
            </button>
            <button
              className={colorEvents ? style.activeTab : null}
              onClick={events}
            >
              EVENTS
            </button>
            <button
              className={colorReviews ? style.activeTab : null}
              onClick={reviews}
            >
              REVIEWS
            </button>
          </div>

          <p className={style.description}>{creator.description}</p>
        </main>
      );
    } else if (state === "events") {
      return (
        <main className={style.wrapper}>
          <Header headertext={creator.firstname} />
          <img
            className={style.creatorprofil_img}
            src={`${pb.baseUrl}/api/files/${creator.collectionId}/${creator.id}/${creator.profilImage}`}
            alt="Profilbild des Creators"
          />
          <div className={style.followdiv}>
            <div className={style.follow}>
              <p>{following}</p>
              <p className={style.light}>Following</p>
            </div>
            <div>
              <p>{creator.follower?.length}</p>
              <p className={style.light}>Followers</p>
            </div>
          </div>
          <div className={style.button}>
            <button
              className={
                followed ? style.activefollowbutton : style.followbutton
              }
              onClick={follow}
            >
              Follow
            </button>
            <Link to={`/review/${id}`}>Review</Link>
          </div>

          <div className={style.tabs}>
            <button
              className={colorAbout ? style.activeTab : null}
              onClick={about}
            >
              ABOUT
            </button>
            <button
              className={colorEvents ? style.activeTab : null}
              onClick={events}
            >
              EVENTS
            </button>
            <button
              className={colorReviews ? style.activeTab : null}
              onClick={reviews}
            >
              REVIEWS
            </button>
          </div>

          {event.items.map((singleEvent) => {
            return <CreatorEvent singleEvent={singleEvent} />;
          })}
        </main>
      );
    } else if (state === "reviews") {
      return (
        <main className={style.wrapper}>
          <Header headertext={creator.firstname} />
          <img
            className={style.creatorprofil_img}
            src={`${pb.baseUrl}/api/files/${creator.collectionId}/${creator.id}/${creator.profilImage}`}
            alt="Profilbild des Creators"
          />
          <div className={style.followdiv}>
            <div className={style.follow}>
              <p>{following}</p>
              <p className={style.light}>Following</p>
            </div>
            <div>
              <p>{creator.follower?.length}</p>
              <p className={style.light}>Followers</p>
            </div>
          </div>
          <div className={style.button}>
            <button
              className={
                followed ? style.activefollowbutton : style.followbutton
              }
              onClick={follow}
            >
              Follow
            </button>
            <Link to={`/review/${id}`}>Review</Link>
          </div>

          <div className={style.tabs}>
            <button
              className={colorAbout ? style.activeTab : null}
              onClick={about}
            >
              ABOUT
            </button>
            <button
              className={colorEvents ? style.activeTab : null}
              onClick={events}
            >
              EVENTS
            </button>
            <button
              className={colorReviews ? style.activeTab : null}
              onClick={reviews}
            >
              REVIEWS
            </button>
          </div>

          {comments.items.map((singleComment) => {
            return (
              <div className={styles.ratingCard}>
                <Rating rating={singleComment.rating} />
                <Comment singleComment={singleComment} />
              </div>
            );
          })}
        </main>
      );
    } else {
      return <FallbackLoadingScreen />;
    }
  }
}
