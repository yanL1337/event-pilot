import AddInterest from "./AddInterest";

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
    <div
      style={{ display: "flex", flexDirection: "column", alignItems: "start" }}
    >
      <p>Interests</p>
      <div style={{ display: "flex", gap: "1vw" }}>
        {(edit ? changes?.interests || [] : user?.interests || []).map(
          (interest, index) => (
            <div
              key={index}
              style={{
                backgroundColor: "#5D3EDE",
                color: "white",
                padding: "2vw",
                borderRadius: "20px",
                display: "flex",
              }}
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
          )
        )}
      </div>
      {edit && <AddInterest addInterest={addInterest} />}
    </div>
  );
};

export default Interests;
