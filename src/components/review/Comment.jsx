import { useEffect, useState } from "react";
import pb from "../../lib/pocketbase";
import { formatDateToString } from "../../utils/helperFunction";
import { Rating } from "./Rating";
import FallbackLoadingScreen from "../loading/FallbackLoadingScreen";
import style from "../../pages/css/Review.module.css";

export function Comment({ singleComment }) {
  const [writer, setWriter] = useState([]);

  //   * Verfasser des Comments fetchen
  useEffect(() => {
    async function getWriter() {
      const record = await pb.collection("users").getOne(singleComment.writer);
      setWriter(record);
    }
    getWriter();
  }, [singleComment]);

  if (singleComment && writer) {
    return (
      <section className={style.wrapper}>
        <div className={style.flexdiv}>
          <div>
            <img
              className={style.profilpic}
              src={`${pb.baseUrl}/api/files/${writer.collectionId}/${writer.id}/${writer.profilImage}`}
              alt="Profilbild des Verfassers der Bewertung"
            />
            <h3>{writer.firstname}</h3>
          </div>
          <p className={style.date}>
            {formatDateToString(singleComment.created)}
          </p>
        </div>
        <Rating />
        <p className={style.comment}>{singleComment.comment}</p>
      </section>
    );
  } else {
    <FallbackLoadingScreen />;
  }
}
