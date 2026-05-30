import { useState } from "react";

const LS_PREFER_CELSIUM = "prefer_celsium";
const WeatherContainer = ({ data, error }) => {
  const [preferCelcium, setPreferCelcium] = useState(
    localStorage.getItem(LS_PREFER_CELSIUM) ?? "true",
  );

  function updatePreferCelcium(preferBool) {
    const preferString = preferBool ? "true" : "false";
    setPreferCelcium(preferString);
    localStorage.setItem(LS_PREFER_CELSIUM, preferString);
  }

  return (
    <div className="weather-container">
      <label>
        <input
          type="checkbox"
          checked={preferCelcium === "true"}
          onChange={(e) => updatePreferCelcium(e.target.checked)}
        />
        Celcium?
      </label>

      {error && <div style={{ color: "red" }}>{error}</div>}
      {data?.location ? (
        <WeatherDataDisplay data={data} isCelcium={preferCelcium} />
      ) : (
        <p> No data here...</p>
      )}
    </div>
  );
};

const WeatherDataDisplay = ({ data, isCelcium }) => {
  const { location, current } = data;

  return (
    <div className="weather-data-container">
      <h2>
        {location.name}, {location.region}, {location.country}
      </h2>
      <p>
        Lat: {location.lat}, Lon: {location.lon}
      </p>
      <p>
        {isCelcium === "true"
          ? `Temperature: ${current?.temp_c} °C`
          : `Temperature: ${current?.temp_f} °F`}
      </p>
      <p>Condition: {current?.condition?.text}</p>
      <img src={current?.condition?.icon} alt={current?.condition?.icon} />
      <p>Humidity: {current?.humidity}</p>
      <p>Pressure: {current?.pressure_mb}</p>
    </div>
  );
};
export default WeatherContainer;
