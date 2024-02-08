import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef, useContext } from "react";
import pb from "../lib/pocketbase";
import style from "./css/Review.module.css";
import { Header } from "../components/header/Header";
import { Rating } from "react-simple-star-rating";
import { displayFavMessage } from "../utils/helperFunction";
import { SetFavoriteMessageContext, ThemeContext } from "../context/context";
import LoadingElement from "../components/loading/LoadingElement";

export function Review() {
  const { theme } = useContext(ThemeContext);
  const [creator, setCreator] = useState([]);
  const [rating, setRating] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
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
  }, [id]);

  //   - Review in db speichern
  const sendReview = async () => {
    const review = {
      comment: commentRef.current.value,
      creator_id: id,
      writer: pb.authStore.model.id,
      rating: rating,
    };
    try {
      setIsLoading(true);
      const response = await pb.collection("reviews").create(review);

      if (response.rating > 0 && response.rating < 6) {
        displayFavMessage(
          `Your review has been saved`,
          setFavMessage,
          favMessageTimer
        );
      } else {
        displayFavMessage(
          `Oops, your review couldn't be saved.`,
          setFavMessage,
          favMessageTimer
        );
      }
    } catch (error) {
      console.log(error);
    }
    setTimeout(() => {
      setIsLoading(false);
      navigate(`/creator/${id}`, { state: "review" });
    }, 1500);
  };

  // - Sterne Rating
  const handleRating = (rate) => {
    setRating(rate);
  };

  if (creator) {
    return (
      <section className={theme ? style.dark : null}>
        <article className={style.article}>
          <Header
            headertext={`Review ${creator.firstname}`}
            className={style.header}
          />
          <main className={style.wrapper1}>
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
                {/* <label className={style.label}>★ Your Review</label> */}
                //#######
                <textarea
                  type="text"
                  placeholder="★ Your Review"
                  ref={commentRef}
                  className={style.input}
                />
              </div>
            </div>
            {!isLoading ? (
              <button className={style.button} onClick={sendReview}>
                SUBMIT
              </button>
            ) : (
              <LoadingElement />
            )}
          </main>
        </article>
      </section>
    );
  }
}
