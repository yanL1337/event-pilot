import React, { useEffect, useState } from "react";
import pb from "../lib/pocketbase.js";
import editProfile from "/images/EditIcon.svg";
import submitEdit from "/images/Arrow.svg";
import Following from "../components/following/Following.jsx";
import Interests from "../components/interests/Interests.jsx";

export const UserProfile = ({ children }) => {
  const [user, setUser] = useState();
  const [edit, setEdit] = useState(false);
  const [changes, setChanges] = useState();

  useEffect(() => {
    const getUser = async () => {
      const record = await pb.collection("users").getOne(pb.authStore.model.id);
      setUser(record);
      setChanges(record);
    };

    getUser();
  }, []);

  const submitChanges = async () => {
    //const record = await pb.collection("users").update(user.id, changes);
    setEdit(false);
  };

  console.log(user);
  return (
    <div style={{}}>
      <div
        style={{
          padding: "5vh 10vw",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {!edit ? (
          <>
            <div className="top-bar">
              <div className="name">
                {`${user?.firstname} ${user?.lastname}`}
              </div>
            </div>
            <div
              style={{
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
                backgroundSize: "cover",
                backgroundImage: `url(https://event-pilot.pockethost.io/api/files/${user?.collectionId}/${user?.id}/${user?.profilImage})`,
                height: "20vh",
              }}
            ></div>
            <div
              onClick={() => setEdit(true)}
              style={{
                borderRadius: "10px",
                border: "1.5px solid var(--4, #777BF3)",
                display: "flex",
                alignItems: "center",
                width: "30vw",
                padding: "1vh 1vw",
              }}
            >
              <img className="icon" alt="Icon" src={editProfile} />
              <p className="d">Edit Profile</p>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "5vw",
              }}
            >
              <div style={{ textAlign: "center" }}>
                <div className="text-wrapper-3">Following</div>
                <Following user={user} />
              </div>
              <div style={{ textAlign: "center" }}>
                <div className="text-wrapper-3">Followers</div>
                <div className="text-wrapper-4">{user?.follower.length}</div>
              </div>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <div className="headline">About Me</div>
              <p>{user?.description}</p>
            </div>
            <Interests user={user} edit={edit} />
          </>
        ) : (
          <form onSubmit={submitChanges} style={{ width: "100vw" }}>
            <img
              className="image"
              alt="Image"
              src={`https://event-pilot.pockethost.io/api/files/${changes?.collectionId}/${changes?.id}/${changes?.profilImage}`}
            />
            <div style={{ display: "flex", flexDirection: "column" }}>
              <input placeholder={changes.firstname} />
              <input placeholder={changes.lastname} />
            </div>

            <div className="about-me">
              <div className="headline">About Me</div>
              <p className="p">{changes?.description}</p>
            </div>
            <Interests changes={changes} setChanges={setChanges} edit={edit} />
            <button
              style={{ display: "flex", alignItems: "center" }}
              type="submit"
            >
              <p>Save changes</p>
              <img src={submitEdit} alt="" />
            </button>
          </form>
        )}
      </div>
      {children}
    </div>
  );
};
