import { useState } from 'react';

const useLocalStorage = (key, defaultValue) => {
  const [value] = useState(() => {
    let currentValue;

    try {
      currentValue = JSON.parse(localStorage.getItem(key) || String(defaultValue));
    } catch (error) {
      currentValue = defaultValue;
    }

    return currentValue;
  });

  return [value];
};

export default useLocalStorage;
