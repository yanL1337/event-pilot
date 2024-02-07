import { Link } from "react-router-dom";
import pb from "../lib/pocketbase";
import { useEffect, useState } from "react";
import OutputItem from "../components/general/OutputItem";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import LocationHeader from "../components/header/LocationHeader";
import {
  getCurrentPosition,
  getCityFromCoordinates,
} from "../utils/geoLocation";

export function Home({ children }) {
  const [events, setEvents] = useState([]);
  const [userLoc, setUserLoc] = useState([]);
  const [nearby, setNearby] = useState([]);

  const [randomEvent, setRandomEvent] = useState();

  useEffect(() => {
    const getEvents = async () => {
      const events = await pb
        .collection("events")
        .getFullList({ sort: "date" });
      setEvents(events);
      //console.log(events);
    };
    getEvents();

    //setRandomEvent(events[Math.floor(Math.random() * 10)]);
  }, []);

  useEffect(() => {
    const getLoc = async () => {
      getCurrentPosition().then((data) =>
        getCityFromCoordinates(
          data.coords.latitude,
          data.coords.longitude
        ).then((data) => setUserLoc(data.split(",")[0]))
      );
    };

    getLoc();
    //hier eigentlich userLoc
    setNearby(events?.filter((ev) => ev?.location.includes("Düsseldorf")));
  }, [userLoc]);

  const settings = {
    dots: false,
    infinite: true,
    speed: 600,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    variableWidth: true,
    //centerMode: true,
    cssEase: "linear",
  };

  return (
    <>
      <LocationHeader logo={"/images/Logo.png"} bgColor={"#5D3EDE"} />

      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <p>Upcoming Events</p>
        <Link to="/event/search">See all</Link>
      </div>
      <Slider {...settings}>
        {events?.map((event) => (
          <div key={event.id} style={{ width: 300, padding: "0 15px" }}>
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
        <Link to="/event/search">See all</Link>
      </div>
      <Slider {...settings}>
        {nearby?.map((event) => (
          <div key={event.id} style={{ width: 300, padding: "0 15px" }}>
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

      {/* <div style={{ width: 300, padding: "0 15px" }}>
        <OutputItem
          data={events[2]}
          allFavorites={[]}
          registeredEvents={[]}
          favMessageTimer={{}}
          isOnFavSite={false}
        />
      </div> */}

      {children}
    </>
  );
}
