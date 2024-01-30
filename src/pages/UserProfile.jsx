import React, { useEffect, useState } from "react";
import pb from "../lib/pocketbase.js";

export const UserProfile = () => {
  const [user, setUser] = useState();

  useEffect(() => {
    const getUser = async () => {
      const record = await pb.collection("users").getOne(pb.authStore.model.id);
      setUser(record);
    };
    getUser();
  }, []);

  return (
    <div className="my-profile">
      <div className="div-2">
        <div className="text">
          <div className="d">Edit Profile</div>
          <img className="icon" alt="Icon" src="icon.svg" />
        </div>
        <div className="about-me">
          <p className="p">
            <span className="span">{user?.description}</span>
          </p>
          <div className="headline">About Me</div>
        </div>
        <div className="stats">
          <div className="overlap-3">
            <div className="text-wrapper-3">Following</div>
            <div className="text-wrapper-4">{"Following"}</div>
          </div>
          <div className="overlap-4">
            <div className="text-wrapper-3">Followers</div>
            <div className="text-wrapper-4">{user?.follower.length}</div>
          </div>
          <img className="split" alt="Split" src="split.svg" />
        </div>
        <img
          className="image"
          alt="Image"
          src={`https://event-pilot.pockethost.io/api/files/${user?.collectionId}/${user?.id}/${user?.profileImage}`}
        />
        <div className="top-bar">
          <div className="name"> {`${user?.firstname} ${user?.username}`}</div>
        </div>

        <div className="interests">
          <div className="interests-2">{""}</div>
        </div>
      </div>
    </div>
  );
};
