import React, { useEffect, useState } from "react";
import { fetchWeather } from "./api/fetchWeather";
import WeatherData from "./components/WeatherData";

const App = () => {
  const LS_RECENT_SEARCH = "recent_search";

  const [cityName, setCityName] = useState("");
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState(null);
  const [recentSearch, setRecentSearch] = useState(
    JSON.parse(localStorage.getItem(LS_RECENT_SEARCH)),
  );

  const updateRecentSearch = (cityName) => {
    const filtered = recentSearch.filter((e) => e !== cityName);
    const res = [cityName, ...filtered];
    setRecentSearch(res);
    localStorage.setItem(LS_RECENT_SEARCH, JSON.stringify(res));
    return res;
  };

  async function displayWeatherData(city) {
    try {
      const { data } = await fetchWeather(city);
      setWeatherData(data);
      setCityName("");
      setError(null);
      updateRecentSearch(data.location.name);
    } catch (error) {
      setError(error.message);
    }
  }
  const SearchKeyDownEvent = async (e) => {
    if (e.key === "Enter" && cityName) {
      displayWeatherData(cityName);
    }
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Enter city name..."
        value={cityName}
        onChange={(e) => setCityName(e.target.value)}
        onKeyDown={SearchKeyDownEvent}
      />
      {error && <div style={{ color: "red" }}>{error}</div>}
      {weatherData?.location && <WeatherData data={weatherData} />}
      <RecentSearch
        recentSearch={recentSearch}
        searchHistory={displayWeatherData}
      />
    </div>
  );
};

function RecentSearch({ recentSearch, searchHistory: displayHistory }) {
  return (
    <>
      <h2>Recent Search</h2>
      <ul className="recent-search-list">
        {recentSearch.map((item) => (
          <li
            className="recent-search-list-item"
            key={item}
            onClick={() => displayHistory(item)}
          >
            {item}
          </li>
        ))}
      </ul>
    </>
  );
}

export default App;
