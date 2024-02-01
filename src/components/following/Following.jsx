import pb from "../../lib/pocketbase";
import { useState, useEffect } from "react";

const Following = ({ user }) => {
  const [following, setFollowing] = useState();
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

  return <div>{following}</div>;
};

export default Following;
