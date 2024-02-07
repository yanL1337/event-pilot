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
  const [user, setUser] = useState(null);

  const [randomEvent, setRandomEvent] = useState();

  useEffect(() => {
    const getUser = async () => {
      const user = await pb.collection("users").getOne(pb.authStore.model.id);
      setUser(user);
    };
    getUser();
  }, []);

  useEffect(() => {
    const getEvents = async () => {
      const events = await pb
        .collection("events")
        .getFullList({ sort: "date" });
      setEvents(events);
      //console.log(events);
    };
    getEvents();
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
    setRandomEvent(events[Math.floor(Math.random() * 10)]);
  }, [events]);

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

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontSize: "16px",
        }}
      >
        <p>Upcoming Events</p>
        <Link to="/event/search">See all</Link>
      </div>
      <Slider {...settings}>
        {user &&
          events?.map((event) => (
            <div key={event.id} style={{ width: 300, padding: "0 15px" }}>
              <OutputItem
                data={event}
                allFavorites={user?.favoriteEvents || []}
                registeredEvents={[]}
                favMessageTimer={{}}
                isOnFavSite={false}
              />
            </div>
          ))}
      </Slider>

      <div
        style={{
          marginTop: "20px",
          display: "flex",
          justifyContent: "space-between",
          fontSize: "16px",
        }}
      >
        <p>Nearby you</p>
        <Link to="/event/search">See all</Link>
      </div>
      <Slider {...settings}>
        {user &&
          nearby?.map((event) => (
            <div key={event.id} style={{ width: 300, padding: "0 15px" }}>
              <OutputItem
                data={event}
                allFavorites={user?.favoriteEvents || []}
                registeredEvents={[]}
                favMessageTimer={{}}
                isOnFavSite={false}
              />
            </div>
          ))}
      </Slider>

      <p style={{ fontSize: "16px" }}>Random Event</p>
      <div style={{ padding: "0 15px" }}>
        <OutputItem
          data={randomEvent || {}}
          allFavorites={user?.favoriteEvents || []}
          registeredEvents={[]}
          favMessageTimer={{}}
          isOnFavSite={false}
        />
      </div>

      {children}
    </>
  );
}
