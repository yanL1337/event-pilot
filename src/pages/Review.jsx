import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import pb from "../lib/pocketbase";
import style from "./css/Review.module.css";
import { Header } from "../components/header/Header";

export function Review() {
  const [creator, setCreator] = useState([]);
  const { id } = useParams();

  const navigate = useNavigate();

  //   Refs
  const commentRef = useRef();
  const ratingRef = useRef();

  //   * Welcher Creator soll bewertet werden? - id anhand useParams
  useEffect(() => {
    async function getCreator() {
      const record = await pb.collection("users").getOne(id);
      setCreator(record);
    }
    getCreator();
  }, []);

  //   - Review in db speichern
  const sendReview = async () => {
    const review = {
      comment: commentRef.current.value,
      creator_id: id,
      writer: pb.authStore.model.id,
      rating: ratingRef.current.value,
    };
    try {
      await pb.collection("reviews").create(review);
      navigate(`/creator/${id}`);
    } catch (error) {
      console.log(error);
    }
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
            <label className={style.labelrating}>Rating</label>
            <input type="number" min="0" max="5" ref={ratingRef} />
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
