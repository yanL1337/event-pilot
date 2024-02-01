import PropTypes from "prop-types";

const ProfileIcon = ({ activeName, active }) => {
  return (
    <svg
      className={activeName === "profile" ? active : ""}
      width="17"
      height="20"
      viewBox="0 0 17 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <ellipse
        cx="8.50096"
        cy="5.49998"
        rx="4.37986"
        ry="4.37986"
        fill="#848484"
        stroke="#848484"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8.00098 12.8799H7.37853C4.13245 12.8799 1.50098 15.5114 1.50098 18.7574C1.50098 18.8251 1.5558 18.8799 1.62343 18.8799H15.4127C15.4615 18.8799 15.501 18.8404 15.501 18.7916C15.501 15.5267 12.8542 12.8799 9.58921 12.8799H8.00098Z"
        fill="#848484"
        stroke="#848484"
        strokeWidth="1.5"
      />
    </svg>
  );
};

ProfileIcon.propTypes = {
  activeName: PropTypes.string,
  active: PropTypes.string,
};

export default ProfileIcon;
