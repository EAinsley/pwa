import axios from "axios";

const URL = "https://api.weatherapi.com/v1/current.json";
const API_KEY = "082338c482b04ac591575516263005";

export const fetchWeather = async (query) => {
  return axios.get(URL, {
    params: {
      q: query,
      key: API_KEY,
    },
  });
};

