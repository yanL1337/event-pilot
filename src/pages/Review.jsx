import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef, useContext } from "react";
import pb from "../lib/pocketbase";
import style from "./css/Review.module.css";
import { Header } from "../components/header/Header";
import { Rating } from "react-simple-star-rating";
import { displayFavMessage } from "../utils/helperFunction";
import { SetFavoriteMessageContext } from "../context/context";

export function Review() {
  const [creator, setCreator] = useState([]);
  const [rating, setRating] = useState(0);
  const { id } = useParams();

  const navigate = useNavigate();

  const favMessageTimer = useRef(null);
  const { setFavMessage } = useContext(SetFavoriteMessageContext);

  //   Ref
  const commentRef = useRef();

  //   * Welcher Creator soll bewertet werden? - id anhand useParams
  useEffect(() => {
    async function getCreator() {
      const record = await pb.collection("users").getOne(id);
      setCreator(record);
    }
    getCreator();

    return () => {
      const cleanUpRef = favMessageTimer;
      if (cleanUpRef.current) {
        clearTimeout(cleanUpRef.current);
        setFavMessage(null);
      }
    };
  }, []);

  //   - Review in db speichern
  const sendReview = async () => {
    const review = {
      comment: commentRef.current.value,
      creator_id: id,
      writer: pb.authStore.model.id,
      rating: rating,
    };
    try {
      const response = await pb.collection("reviews").create(review);
      navigate(`/creator/${id}`);
      return response;
    } catch (error) {
      console.log(error);
    }
    if (response.ok) {
      displayFavMessage(
        `Deine Review wurde gespeichert`,
        setFavMessage,
        favMessageTimer
      );
    } else {
      displayFavMessage(
        `Upps, deine Review konnte nicht gespeichert werden.`,
        setFavMessage,
        favMessageTimer
      );
    }
  };

  // - Sterne Rating
  const handleRating = (rate) => {
    setRating(rate);
  };

  if (creator) {
    return (
      <>
        <Header
          headertext={`Review ${creator.firstname} ${creator.lastname}`}
        />
        <main className={style.wrapper}>
          <div>
            <img
              className={style.creatorprofil_img}
              src={`${pb.baseUrl}/api/files/${creator.collectionId}/${creator.id}/${creator.profilImage}`}
              alt="Profilbild"
            />
          </div>
          <div>
            <Rating
              onClick={handleRating}
              fillColor="#00ECAA"
              className={style.stars}
            />
            <div className={style.commentdiv}>
              <label className={style.label}>★ Your Review</label>
              <input type="text" ref={commentRef} className={style.input} />
            </div>
          </div>
          <button className={style.button} onClick={sendReview}>
            SUBMIT
          </button>
        </main>
      </>
    );
  }
}
