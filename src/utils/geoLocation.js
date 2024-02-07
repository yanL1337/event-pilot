// import Geocoder from 'node-geocoder';

export const getCurrentPosition = () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation wird nicht unterstützt"));
    } else {
      // Wir returnen die aktuellen Koordinaten des Browsers
      navigator.geolocation.getCurrentPosition(resolve, reject);
    }
  });
};

export const getCityFromCoordinates = async (latitude, longitude) => {
  // Wir nutzen die kostenlose openstretmap api
  const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`;

  // Wir holen uns die Stadtdaten über die Koordinaten
  try {
    const response = await fetch(url);
    const data = await response.json();
    if (!data.address) {
      throw new Error();
    }

    let returnString = "";
    if (data.address.city) {
      returnString = `${data.address.city}, ${data.address.country}`;
    } else if (data.address.town) {
      returnString = `${data.address.town}, ${data.address.country}`;
    } else if (data.address.village) {
      returnString = `${data.address.village}, ${data.address.country}`;
    }
    // die daten kommen über data.adress und dann entweder city town usw.
    return returnString;
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
