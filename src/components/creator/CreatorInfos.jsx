import style from "../../pages/css/CreatorProfil.module.css";

export function CreatorInfos({ creator, following }) {
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
      <div className={style.button}>
        <button
          className={followed ? style.activefollowbutton : style.followbutton}
          onClick={follow}
        >
          Follow
        </button>
        <Link to={`/review/${id}`}>Review</Link>
      </div>

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
}
