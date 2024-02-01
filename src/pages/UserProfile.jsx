import React, { useEffect, useState } from "react";
import pb from "../lib/pocketbase.js";
import editProfile from "/images/EditIcon.svg";
import submitEdit from "/images/Arrow.svg";

export const UserProfile = ({ children }) => {
  const [user, setUser] = useState();
  const [following, setFollowing] = useState();
  const [edit, setEdit] = useState(false);

  useEffect(() => {
    const getUser = async () => {
      const record = await pb.collection("users").getOne(pb.authStore.model.id);
      setUser(record);
    };

    getUser();
    //console.log(user);
  }, []);

  useEffect(() => {
    let count = 0;
    const getFollowing = async () => {
      const records = await pb.collection("users").getFullList();

      records.forEach((userRecord) =>
        userRecord?.follower.forEach((follower) =>
          follower == user?.id ? count++ : null
        )
      );
      setFollowing(count);
    };
    getFollowing();
  }, [user]);

  const editUser = () => {
    setEdit((prev) => !prev);
  };

  console.log(edit);

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
                {" "}
                {`${user?.firstname} ${user?.lastname}`}
              </div>
            </div>
            <img
              className="image"
              alt="Image"
              src={`https://event-pilot.pockethost.io/api/files/${user?.collectionId}/${user?.id}/${user?.profilImage}`}
            />
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
                <div className="text-wrapper-4">{following}</div>
              </div>
              <div style={{ textAlign: "center" }}>
                <div className="text-wrapper-3">Followers</div>
                <div className="text-wrapper-4">{user?.follower.length}</div>
              </div>
            </div>
            <div className="about-me">
              <p className="p">
                <span className="span">{user?.description}</span>
              </p>
              <div className="headline">About Me</div>
            </div>
            <div className="interests">
              <div className="interests-2">{""}</div>
            </div>
          </>
        ) : (
          <>
            <img
              className="image"
              alt="Image"
              src={`https://event-pilot.pockethost.io/api/files/${user?.collectionId}/${user?.id}/${user?.profilImage}`}
            />
            <div style={{ display: "flex", flexDirection: "column" }}>
              <input placeholder={user.firstname} />
              <input placeholder={user.lastname} />
            </div>

            <div className="about-me">
              <div className="headline">About Me</div>
              <p className="p">
                <span className="span">{user?.description}</span>
              </p>
            </div>
            <div className="interests">
              <div className="interests-2">{""}</div>
            </div>
            <div
              style={{ display: "flex", alignItems: "center" }}
              onClick={() => setEdit(false)}
            >
              <p>Save changes</p>
              <img src={submitEdit} alt="" />
            </div>
          </>
        )}
      </div>
      {children}
    </div>
  );
};
