import PropTypes from "prop-types";

const SearchIcon = ({ activeName, active }) => {
  return (
    <svg
      className={activeName === "search" ? active : ""}
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M9.16667 15.8333C12.8486 15.8333 15.8333 12.8486 15.8333 9.16667C15.8333 5.48477 12.8486 2.5 9.16667 2.5C5.48477 2.5 2.5 5.48477 2.5 9.16667C2.5 12.8486 5.48477 15.8333 9.16667 15.8333Z"
        stroke="#848484"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        opacity="0.4"
        d="M17.5 17.5L13.875 13.875"
        stroke="#848484"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

SearchIcon.propTypes = {
  activeName: PropTypes.string,
  active: PropTypes.string,
};

export default SearchIcon;
