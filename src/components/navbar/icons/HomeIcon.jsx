import PropTypes from "prop-types";

const HomeIcon = ({ activeName, active }) => {
  return (
    <svg
      className={activeName === "home" ? active : ""}
      width="23"
      height="23"
      viewBox="0 0 23 23"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="11.5" cy="11.5" r="9.5" fill="#848484" />
      <path
        d="M8.73739 10.6565L8 12.5L7 15L6.56325 16.3103C6.53719 16.3884 6.61156 16.4628 6.68974 16.4368L8 16L10.5 15L12.3435 14.2626C12.7766 14.0893 13.1701 13.8299 13.5 13.5C13.8299 13.1701 14.0893 12.7766 14.2626 12.3435L15 10.5L16 8L16.4368 6.68974C16.4628 6.61156 16.3884 6.53719 16.3103 6.56325L15 7L12.5 8L10.6565 8.73739C10.2234 8.91066 9.82989 9.17011 9.5 9.5C9.17011 9.82989 8.91066 10.2234 8.73739 10.6565Z"
        fill="white"
        stroke="white"
      />
      <path
        opacity="0.3"
        d="M11.5 12.5781C12.0954 12.5781 12.5781 12.0954 12.5781 11.5C12.5781 10.9046 12.0954 10.4219 11.5 10.4219C10.9046 10.4219 10.4219 10.9046 10.4219 11.5C10.4219 12.0954 10.9046 12.5781 11.5 12.5781Z"
        fill="#848484"
      />
    </svg>
  );
};

HomeIcon.propTypes = {
  activeName: PropTypes.string,
  active: PropTypes.string,
};

export default HomeIcon;
