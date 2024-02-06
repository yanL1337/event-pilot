import { Link } from "react-router-dom";
import pb from "../lib/pocketbase";
import { useEffect, useState } from "react";
import OutputItem from "../components/general/OutputItem";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export function Home({ children }) {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const getEvents = async () => {
      const events = await pb
        .collection("events")
        .getFullList({ sort: "date" });
      setEvents(events);
      console.log(events);
    };
    getEvents();
  }, []);

  const settings = {
    dots: false,
    infinite: true,
    speed: 600,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    //margin: "150px",
    // centerMode: true,
    cssEase: "linear",
  };

  return (
    <>
      <h1>Home</h1>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <p>Upcoming Events</p>
        <Link to="/event/search">See all</Link>
      </div>
      <Slider style={{ display: "flex", gap: "100px" }} {...settings}>
        {events?.map((event) => (
          <div key={event.id}>
            <OutputItem
              data={event}
              allFavorites={[]}
              registeredEvents={[]}
              favMessageTimer={{}}
              isOnFavSite={false}
            />
          </div>
        ))}
      </Slider>

      <div style={{ marginTop: "20px" }}>
        <p>Nearby you</p>
        <Link to="/">See all</Link>
      </div>

      {children}
    </>
  );
}
