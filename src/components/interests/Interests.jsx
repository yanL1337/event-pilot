import { useState } from "react";
import pb from "../../lib/pocketbase";
import AddInterest from "./AddInterest";

const Interests = ({ changes, edit }) => {
  const [userInterests, setUserInterests] = useState(changes?.interests);
  //   const removeInterest = async (interest) => {
  //     const record = await pb
  //       .collection("users")
  //       .update(changes.id, { "interests-": [interest] });

  //     console.log(record);
  //   };

  const removeInterest = (selected) => {
    setUserInterests(userInterests.filter((interest) => interest != selected));
  };

  console.log(userInterests);
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "start",
      }}
    >
      <p>Interests</p>
      <div style={{ display: "flex", gap: "1vw" }}>
        {userInterests?.map((interest, index) => {
          return (
            <div
              style={{
                backgroundColor: "#5D3EDE",
                color: "white",
                padding: "2vw",
                borderRadius: "20px",
                display: "flex",
              }}
              key={index}
            >
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
          );
        })}
      </div>
      {edit && <AddInterest user={changes} />}
    </div>
  );
};

export default Interests;
