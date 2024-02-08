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
import style from "./css/Home.module.css";
import OutputHome from "../components/general/OutputHome";
import FallbackLoadingScreen from "../components/loading/FallbackLoadingScreen";

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
    autoplaySpeed: 6000,
    variableWidth: true,
    centerMode: true,
    cssEase: "linear",
  };

  if (events && user && randomEvent) {
    return (
      <>
        <LocationHeader
          logo={"/images/Logo.png"}
          bgColor={"transparent"}
          fontcolor={"#876AFD"}
        />
        <section className={style.wrapper}>
          <div className={style.flex}>
            <h3>Upcoming Events</h3>
            <Link to="/event/search">See all</Link>
          </div>
          <Slider {...settings}>
            {user &&
              events?.map((event) => (
                <div key={event.id}>
                  <OutputHome
                    data={event}
                    allFavorites={user?.favoriteEvents || []}
                    registeredEvents={[]}
                    favMessageTimer={{}}
                    isOnFavSite={false}
                  />
                </div>
              ))}
          </Slider>

          <div className={style.flex}>
            <h3>Nearby you</h3>
            <Link to="/event/search">See all</Link>
          </div>
          <Slider {...settings}>
            {user &&
              nearby?.map((event) => (
                <div key={event.id}>
                  <OutputHome
                    data={event}
                    allFavorites={user?.favoriteEvents || []}
                    registeredEvents={[]}
                    favMessageTimer={{}}
                    isOnFavSite={false}
                  />
                </div>
              ))}
          </Slider>

          <div className={style.random}>
            <OutputItem
              data={randomEvent || {}}
              allFavorites={user?.favoriteEvents || []}
              registeredEvents={[]}
              favMessageTimer={{}}
              isOnFavSite={false}
            />
          </div>
        </section>
        {children}
      </>
    );
  } else {
    return <FallbackLoadingScreen />;
  }
}
