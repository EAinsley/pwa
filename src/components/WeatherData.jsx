// const LS_PREFER_CELSIUM = "prefer_celsium";
const WeatherData = ({ data }) => {
  const { location, current } = data;

  // const [preferCelcium, setPreferCelcium]

  return (
    <div className="weather-data-container">
      <h2>
        {location.name}, {location.region}, {location.country}
      </h2>
      <p>
        Lat: {location.lat}, Lon: {location.lon}
      </p>
      <p>
        Temperature: {current?.temp_c} °C Temperature: {current?.temp_f} °F
      </p>
      <p>Condition: {current?.condition?.text}</p>
      <img src={current?.condition?.icon} alt={current?.condition?.icon} />
      <p>Humidity: {current?.humidity}</p>
      <p>Pressure: {current?.pressure_mb}</p>
    </div>
  );
};

export default WeatherData;
