import style from "../../pages/css/Review.module.css";

export function Rating({ rating }) {
  let count = Math.round(Number(rating));
  let stars = "";

  for (let i = 0; i < count; i++) {
    stars += "★";
  }

  for (let i = 0; i < 5 - count; i++) {
    stars += "☆";
  }

  return (
    <div>
      <p className={style.stars}>{stars}</p>
    </div>
  );
}
