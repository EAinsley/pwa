import React, { useEffect, useState } from "react";
import { fetchWeather } from "./api/fetchWeather";
import WeatherContainer from "./components/WeatherContainer";

const App = () => {
  const LS_RECENT_SEARCH = "recent_search";

  const [cityName, setCityName] = useState("");
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState(null);
  const [recentSearch, setRecentSearch] = useState(
    JSON.parse(localStorage.getItem(LS_RECENT_SEARCH)) ?? [],
  );
  const [isOnline, setIsOnline] = useState(true);
  const [queuedName, setQueuedName] = useState("");

  const updateRecentSearch = (cityName) => {
    const filtered = recentSearch.filter((e) => e !== cityName);
    const res = [cityName, ...filtered];
    setRecentSearch(res);
    localStorage.setItem(LS_RECENT_SEARCH, JSON.stringify(res));
    return res;
  };

  function updateWeatherData(data) {
    setWeatherData(data);
    setCityName("");
    setError(null);
    setIsOnline(true);
    updateRecentSearch(data.location.name);
  }

  async function fetchWeatherDataByCityName(city) {
    if (!isOnline) {
      setQueuedName(city);
    }
    try {
      const { data } = await fetchWeather(city);
      updateWeatherData(data);
    } catch (error) {
      setError(error.message);
    }
  }

  async function fetchWeatherDataByLocation(coords) {
    if (!isOnline) return;
    const { latitude, longitude } = coords;
    try {
      const { data } = await fetchWeather(`${latitude},${longitude}`);
      updateWeatherData(data);
    } catch (error) {
      setError(error.message);
    }
  }

  const fetchWeatherDataByCurrentLocation = () => {
    if (!navigator.geolocation) {
      console.error("Geolocation is not supported");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        console.log("position:", position);
        fetchWeatherDataByLocation(position.coords);
      },
      (error) => {
        console.error("Location permission denied or unavailable", error);
      },
    );
  };

  const sendQueuedRequest = () => {
    setIsOnline(true);
    if (!queuedName) {
      fetchWeatherDataByCurrentLocation();
    } else {
      fetchWeatherDataByCityName(queuedName);
      setQueuedName("");
    }
  };

  const SearchKeyDownEvent = async (e) => {
    if (e.key === "Enter" && cityName) {
      fetchWeatherDataByCityName(cityName);
    }
  };

  useEffect(
    () => fetchWeatherDataByCurrentLocation(),
    [fetchWeatherDataByCurrentLocation],
  );
  useEffect(() => {
    const offlineHanlder = (e) => setIsOnline(false);
    const onlineHandler = (e) => sendQueuedRequest();
    window.addEventListener("online", onlineHandler);
    window.addEventListener("offline", offlineHanlder);

    return () => {
      window.removeEventListener("online", onlineHandler);
      window.removeEventListener("offline", offlineHanlder);
    };
  }, [sendQueuedRequest]);

  return (
    <div>
      <input
        type="text"
        placeholder="Enter city name..."
        value={cityName}
        onChange={(e) => setCityName(e.target.value)}
        onKeyDown={SearchKeyDownEvent}
      />
      <WeatherContainer data={weatherData} error={error} />
      <RecentSearch
        recentSearch={recentSearch}
        searchHistory={fetchWeatherDataByCityName}
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
