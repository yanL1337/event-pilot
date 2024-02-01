// import Geocoder from 'node-geocoder';

const getCurrentPosition = () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation wird nicht unterstützt"));
    } else {
      // Wir returnen die aktuellen Koordinaten des Browsers
      navigator.geolocation.getCurrentPosition(resolve, reject);
    }
  });
};

const getCityFromCoordinates = async (latitude, longitude) => {
  // Wir nutzen die kostenlose openstretmap api
  const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`;

  // Wir holen uns die Stadtdaten über die Koordinaten
  try {
    const response = await fetch(url);
    const data = await response.json();
    if (!data.address) {
      throw new Error();
    }

    // die daten kommen über data.adress und dann entweder city town usw.
    return (
      `${data.address.city}, ${data.address.country}` ||
      `${data.address.town}, ${data.address.country}` ||
      `${data.address.village}, ${data.address.country}` ||
      "Stadt nicht gefunden"
    );
  } catch (error) {
    return null;
  }
};

export const getCityFromLocation = async () => {
  try {
    const position = await getCurrentPosition();
    const city = await getCityFromCoordinates(
      position.coords.latitude,
      position.coords.longitude
    );

    if (!city) {
      throw new Error();
    }

    return city;
  } catch (error) {
    return null;
  }
};
