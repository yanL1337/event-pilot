import { useState } from "react";
import pb from "../../lib/pocketbase";

const AddInterest = ({ user }) => {
  const [showModal, setShowModal] = useState(false);

  // Funktion zum Umschalten der Anzeige des Modals
  const toggleModal = () => {
    setShowModal(!showModal);
  };

  const add = async (event) => {
    pb.collection("users").update(user.id, {
      "interests+": [event.target.value],
    });
    console.log(event.target.value);
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
      <div
        onClick={toggleModal}
        style={{
          marginTop: "2vh",
          background: "rgba(93, 62, 222, 0.30)",
          padding: "2vw",
          borderRadius: "20px",
          cursor: "pointer", // Mauszeiger ändern, um Klickbarkeit anzuzeigen
        }}
      >
        Add +
      </div>

      {showModal && (
        <dialog style={{ padding: "5px" }} open>
          <select onSelect={add}>
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
