import axios from "axios";

const api_key = import.meta.env.VITE_OPENWEATHER_KEY;
const urlBase = "https://api.openweathermap.org/data/3.0/weather";

const getWeather = (latitude, longitude) => {
    
console.log("api_key", api_key);
  const request = axios.get(
    `${urlBase}?lat=${latitude}&lon=${longitude}&appid=${api_key}`
  );
  return request.then((request) => request.data);
};

export { getWeather };
