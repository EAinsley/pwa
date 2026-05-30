import axios from 'axios'

const URL = 'https://api.weatherapi.com/v1/current.json'
const API_KEY = '082338c482b04ac591575516263005'

export const fetchWeather = async (cityName) => {
  return axios.get(URL, {
    params: {
      q: cityName,
      key: API_KEY
    }
  })
}