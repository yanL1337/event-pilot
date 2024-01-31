import { Link } from "react-router-dom";

export function CreatorEvent({ singleEvent }) {
  console.log(singleEvent);
  return (
    <Link to={`/eventdetails/${singleEvent.id}`}>
      <p>{singleEvent.name}</p>
      <p>{singleEvent.location}</p>
      <p>{singleEvent.date}</p>
    </Link>
  );
}
