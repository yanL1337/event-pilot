import { NavLink } from "react-router-dom";

export function Navbar() {
  return (
    <nav>
      <NavLink to="/home">Explore</NavLink>
      <NavLink to="/favorites">Events</NavLink>
      <NavLink to="/event/add">+</NavLink>
      <NavLink to="/event/search">Search</NavLink>
      <NavLink to="/user">Profile</NavLink>
    </nav>
  );
}
