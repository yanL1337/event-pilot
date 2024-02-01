import { NavLink } from "react-router-dom";
import HomeIcon from "./icons/HomeIcon.jsx";
import ProfileIcon from "./icons/ProfileIcon.jsx";
import SearchIcon from "./icons/SearchIcon.jsx";
import EventsIcon from "./icons/EventsIcon.jsx";
import style from "./Navbar.module.css";

import PropTypes from "prop-types";

const Navbar = ({ activeName }) => {
  return (
    <nav className={style.navbar}>
      <NavLink to="/home">
        <div className={style.navdiv}>
          <HomeIcon activeName={activeName} active={style.active} />
          <p>EXPLORE</p>
        </div>
      </NavLink>
      <NavLink to="/favorites">
        <div className={style.navdiv}>
          <EventsIcon activeName={activeName} active={style.active_event} />
          <p>EVENTS</p>
        </div>
      </NavLink>
      <NavLink to="/event/add" className={style.button}>
        <div className={style.buttondiv}>+</div>
      </NavLink>
      <NavLink to="/event/search">
        <div className={style.navdiv}>
          <SearchIcon activeName={activeName} active={style.active} />
          <p>SEARCH</p>
        </div>
      </NavLink>
      <NavLink to="/user">
        <div className={style.navdiv}>
          <ProfileIcon activeName={activeName} active={style.active_user} />
          <p>PROFILE</p>
        </div>
      </NavLink>
    </nav>
  );
};

Navbar.propTypes = {
  activeName: PropTypes.string,
};

export default Navbar;
