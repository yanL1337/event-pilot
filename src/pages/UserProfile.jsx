import React, { useEffect, useState } from "react";
import pb from "../lib/pocketbase.js";
import editProfile from "/images/EditIcon.svg";
import submitEdit from "/images/Arrow.svg";
import Following from "../components/following/Following.jsx";
import Interests from "../components/interests/Interests.jsx";
import { CreatorEvent } from "../components/events/CreatorEvents.jsx";
import { OwnEvent } from "../components/events/OwnEvent.jsx";

export const UserProfile = ({ children }) => {
  const [user, setUser] = useState();
  const [edit, setEdit] = useState(false);
  const [changes, setChanges] = useState({});
  const [state, setState] = useState("about");
  const [ownEvents, setOwnEvents] = useState([]);

  useEffect(() => {
    const getUser = async () => {
      const record = await pb.collection("users").getOne(pb.authStore.model.id);
      setUser(record);
      setChanges(record);
    };

    getUser();
  }, []);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setChanges((prev) => ({ ...prev, [name]: value }));
  };

  const submitChanges = async (event) => {
    event.preventDefault();
    const formData = new FormData();

    formData.append("firstname", changes.firstname);
    formData.append("lastname", changes.lastname);
    formData.append("description", changes.description);
    const fileInput = document.querySelector('input[type="file"]');

    if (fileInput && fileInput.files[0]) {
      formData.append("profilImage", fileInput.files[0]);
    }

    for (let item of changes.interests) {
      console.log(item);
      formData.append("interests", item);
    }

    //formData.append("interests", changes.interests);
    try {
      const record = await pb.collection("users").update(user.id, formData);
      setUser(record);
      setEdit(false);
    } catch (error) {
      console.error("Failed to update", error);
    }
  };

  // ##############################
  function about() {
    setState("about");
  }
  function events() {
    setState("events");
  }

  useEffect(() => {
    async function getOwnEvents() {
      const ownEvents = await pb.collection("events").getFullList({
        filter: `creator="${pb.authStore.model.id}"`,
      });
      setOwnEvents(ownEvents);
    }
    getOwnEvents();
  }, [ownEvents]);

  if (state === "about") {
    return (
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
              <div className="name">{`${user?.firstname} ${user?.lastname}`}</div>
            </div>
            <img
              style={{
                width: "200px",
                height: "200px",
                borderRadius: "50%",
                objectFit: "cover",
              }}
              src={`https://event-pilot.pockethost.io/api/files/${user?.collectionId}/${user?.id}/${user?.profilImage}`}
            />

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
              <button onClick={about}>ABOUT</button>
              <button onClick={events}>EVENTS</button>

              <div className="headline">About Me</div>
              <p>{user?.description}</p>
            </div>
            <Interests user={user} edit={edit} />
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
          </>
        ) : (
          //submitChanges, changes, handleInputChange
          <form onSubmit={submitChanges} style={{ width: "100vw" }}>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <input
                name="firstname"
                placeholder="First Name"
                value={changes.firstname || ""}
                onChange={handleInputChange}
              />
              <input
                name="lastname"
                placeholder="Last Name"
                value={changes.lastname || ""}
                onChange={handleInputChange}
              />
            </div>
            <div style={{ display: "flex", alignItems: "flex-end" }}>
              <img
                style={{
                  width: "200px",
                  height: "200px",
                  borderRadius: "50%",
                  objectFit: "cover",
                }}
                src={`https://event-pilot.pockethost.io/api/files/${user?.collectionId}/${user?.id}/${user?.profilImage}`}
              />
              <div className="image-upload">
                <label htmlFor="file-input">
                  <img
                    style={{ width: "7vw", cursor: "pointer" }}
                    src={editProfile}
                  />
                </label>
                <input
                  style={{ display: "none" }}
                  name="profilImage"
                  id="file-input"
                  type="file"
                />
              </div>
            </div>

            <textarea
              style={{ height: "10vh", width: "70vw" }}
              name="description"
              placeholder="About me"
              value={changes.description || ""}
              onChange={handleInputChange}
            />

            <Interests changes={changes} setChanges={setChanges} edit={edit} />
            <button
              type="submit"
              style={{ display: "flex", alignItems: "center" }}
            >
              <p>Save changes</p>
              <img src={submitEdit} alt="" />
            </button>
          </form>
        )}
        {children}
      </div>
    );
  } else {
    return (
      <section
        style={{
          padding: "5vh 10vw",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <div className="top-bar">
          <div className="name">{`${user?.firstname} ${user?.lastname}`}</div>
        </div>
        <img
          style={{
            width: "200px",
            height: "200px",
            borderRadius: "50%",
            objectFit: "cover",
          }}
          src={`https://event-pilot.pockethost.io/api/files/${user?.collectionId}/${user?.id}/${user?.profilImage}`}
        />

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
          <button onClick={about}>ABOUT</button>
          <button onClick={events}>EVENTS</button>{" "}
        </div>
        {ownEvents.map((singleEvent) => {
          return <OwnEvent singleEvent={singleEvent} />;
        })}
        {children}
      </section>
    );
  }
};
