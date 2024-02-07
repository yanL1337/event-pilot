import { useState } from "react";
import style from "../../pages/css/UserProfil.module.css";

const AddInterest = ({ addInterest }) => {
  const [showModal, setShowModal] = useState(false);

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  const add = async (event) => {
    addInterest(event.target.value);
    toggleModal();
  };

  const userInterests = [
    "Programming",
    "Concerts",
    "Cinema",
    "Music",
    "Art",
    "Online Games",
    "Sport",
  ];

  return (
    <div>
      <div onClick={toggleModal} className={style.selectinterest}>
        Add Interest
      </div>

      {showModal && (
        <dialog style={{ padding: "5px" }} open>
          <select onChange={add}>
            <option>Select Interest</option>
            {userInterests.map((interest, index) => {
              return (
                <option key={index} value={interest}>
                  {interest}
                </option>
              );
            })}
          </select>
          <button onClick={toggleModal}>X</button>
        </dialog>
      )}
    </div>
  );
};

export default AddInterest;
