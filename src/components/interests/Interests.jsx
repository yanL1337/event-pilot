import AddInterest from "./AddInterest";
import style from "../../pages/css/UserProfil.module.css";

const Interests = ({ user, changes, edit, setChanges }) => {
  const removeInterest = (selected) => {
    const updatedInterests = changes.interests.filter(
      (interest) => interest !== selected
    );

    setChanges({ ...changes, interests: updatedInterests });
  };

  const addInterest = (newInterest) => {
    if (!changes.interests.includes(newInterest)) {
      const updatedInterests = [...changes.interests, newInterest];
      setChanges({ ...changes, interests: updatedInterests });
    }
  };

  return (
    <article>
      <p className={style.aboutme}>Interests</p>
      <div className={style.aroundinterests}>
        {(edit ? changes?.interests || [] : user?.interests || []).map(
          (interest, index) => (
            <div key={index} className={style.interests}>
              {interest}
              {edit && (
                <div
                  onClick={() => removeInterest(interest)}
                  style={{
                    marginLeft: "2vw",
                    color: "#00ECAA",
                    fontWeight: "bolder",
                  }}
                >
                  X
                </div>
              )}
            </div>
          )
        )}
      </div>
      {edit && <AddInterest addInterest={addInterest} />}
    </article>
  );
};

export default Interests;
