import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import pb from "../lib/pocketbase";
import style from "./css/Review.module.css";

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
      <main>
        Review {creator.firstname} {creator.lastname}
        <div>
          <label htmlFor="">Comment</label>
          <input type="text" ref={commentRef} />
          <label htmlFor="">Rating</label>
          <input type="number" min="0" max="5" ref={ratingRef} />
        </div>
        <button onClick={sendReview}>review</button>
      </main>
    );
  }
}
