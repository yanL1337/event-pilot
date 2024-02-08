import { Link, useNavigate } from "react-router-dom";
import pb from "../lib/pocketbase";
import { useContext, useEffect, useRef, useState } from "react";
import OutputItem from "../components/general/OutputItem";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import LocationHeader from "../components/header/LocationHeader";
import {
  getCurrentPosition,
  getCityFromCoordinates,
  getCityFromLocation,
} from "../utils/geoLocation";
import style from "./css/Home.module.css";
import OutputHome from "../components/general/OutputHome";
import FallbackLoadingScreen from "../components/loading/FallbackLoadingScreen";

export function Home({ children }) {
  const [events, setEvents] = useState([]);
  const [userLoc, setUserLoc] = useState([]);
  const [nearby, setNearby] = useState([]);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const favContext = useRef(null);
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
      getCityFromLocation().then((city) =>
        setNearby(events?.filter((ev) => ev?.location == city))
      );
    };

    getLoc();
    //hier eigentlich userLoc

    setRandomEvent(events[Math.floor(Math.random() * 10)]);
  }, [events]);

  const navigateToNearbyEvent = () => {
    getCityFromLocation().then((city) =>
      navigate("/event/search", {
        state: city,
      })
    );
  };

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

  if (events && user && nearby && randomEvent) {
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
                    favMessageTimer={favContext}
                    isOnFavSite={false}
                  />
                </div>
              ))}
          </Slider>

          <div className={style.flex}>
            <h3>Nearby you</h3>
            <a onClick={navigateToNearbyEvent}>See all</a>
          </div>
          {nearby?.length > 0 ? (
            <Slider {...settings}>
              {user &&
                nearby?.map((event) => (
                  <div key={event.id}>
                    <OutputHome
                      data={event}
                      allFavorites={user?.favoriteEvents || []}
                      registeredEvents={[]}
                      favMessageTimer={favContext}
                      isOnFavSite={false}
                    />
                  </div>
                ))}
            </Slider>
          ) : (
            <p className={style.nearby}>
              Oh no, unfortunately there are no events near you...
            </p>
          )}

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
