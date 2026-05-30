import React, { useEffect, useState } from "react";
import { fetchWeather } from "./api/fetchWeather";

const App = () => {
  const LS_RECENT_SEARCH = "recent_search";

  const [cityName, setCityName] = useState("");
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState(null);
  const [recentSearch, setRecentSearch] = useState(
    JSON.parse(localStorage.getItem(LS_RECENT_SEARCH)),
  );

  const updateRecentSearch = (cityName) => {
    // NOTE: Note sure if we need to formalize it.
    cityName =
      cityName.charAt(0).toUpperCase() + cityName.slice(1).toLowerCase();

    const filtered = recentSearch.filter((e) => e !== cityName);
    const res = [cityName, ...filtered];
    setRecentSearch(res);
    localStorage.setItem(LS_RECENT_SEARCH, JSON.stringify(res));
    return res;
  };
  const fetchData = async (e) => {
    if (e.key === "Enter" && cityName) {
      try {
        const { data } = await fetchWeather(cityName);
        console.log(data);
        setWeatherData(data);
        updateRecentSearch(cityName);
        setCityName("");
        setError(null);
      } catch (error) {
        setError(error.message);
      }
    }
  };
  return (
    <div>
      <input
        type="text"
        placeholder="Enter city name..."
        value={cityName}
        onChange={(e) => setCityName(e.target.value)}
        onKeyDown={fetchData}
      />
      {error && <div style={{ color: "red" }}>{error}</div>}
      {weatherData?.location && (
        <div>
          <h2>
            {weatherData.location.name}, {weatherData.location.region},{" "}
            {weatherData.location.country}
          </h2>
          <p>
            Lat: {weatherData.location.lat}, Lon: {weatherData.location.lon}
          </p>
          <p>
            Temperature: {weatherData.current?.temp_c} °C Temperature:{" "}
            {weatherData.current?.temp_f} °F
          </p>
          <p>Condition: {weatherData.current?.condition?.text}</p>
          <img
            src={weatherData.current?.condition?.icon}
            alt={weatherData.current?.condition?.icon}
          />
          <p>Humidity: {weatherData.current?.humidity}</p>
          <p>Pressure: {weatherData.current?.pressure_mb}</p>
        </div>
      )}
    </div>
  );
};

export default App;
