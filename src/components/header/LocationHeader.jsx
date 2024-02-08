import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSortDown } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import { getCityFromLocation } from "../../utils/geoLocation";

/* CSS */
import styles from "./LocationHeader.module.css";

const LocationHeader = ({ logo, bgColor, fontcolor }) => {
  const [location, setLocation] = useState(null);

  useEffect(() => {
    getCityFromLocation().then((city) => {
      if (city) {
        setLocation(city);
      }
    });
  }, []);

  return (
    <header>
      <section className={styles.header_section}>
        {logo && (
          <article className={styles.header_logo}>
            <img src={logo} alt="Logo" />
          </article>
        )}
        <article
          className={styles.header_article}
          style={{ backgroundColor: `${bgColor}`, color: `${fontcolor}` }}
        >
          <div style={{ display: "flex", alignItems: "baseline", gap: "6px" }}>
            <p style={{ opacity: "0.60" }}> Current Location</p>{" "}
            <FontAwesomeIcon icon={faSortDown} style={{ height: "15px" }} />
          </div>

          <div>{location ? location : "No Location"}</div>
        </article>
      </section>
    </header>
  );
};

LocationHeader.propTypes = {
  logo: PropTypes.string,
  bgColor: PropTypes.string,
};

export default LocationHeader;
