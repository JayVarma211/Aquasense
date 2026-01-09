import React, { useEffect, useState, useCallback } from "react";
import "./Weather.css";
import { FaMapMarkerAlt, FaCloud, FaCloudRain, FaSun, FaWind, FaTint, FaLocationArrow } from "react-icons/fa";

const WEATHER_API_KEY = process.env.REACT_APP_OPENWEATHER_API_KEY;
const DEFAULT_CITY = process.env.REACT_APP_WEATHER_CITY || "Mumbai";

export default function Weather({ onWeatherUpdate }) {
  const [weather, setWeather] = useState(null);
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [requestingLocation, setRequestingLocation] = useState(false);
  const [useDefaultCity, setUseDefaultCity] = useState(false);

  const fetchWeatherForLocation = useCallback((lat, lon) => {
    if (!WEATHER_API_KEY) {
      setError("API Key not configured");
      setLoading(false);
      return;
    }

    fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${WEATHER_API_KEY}`
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.cod !== 200) throw new Error(data.message || "Weather API error");
        
        setWeather(data);
        setLocation({ lat, lon });
        setLoading(false);
        setError(null);
        setUseDefaultCity(false);
        
        // Send data to parent
        if (onWeatherUpdate) {
          onWeatherUpdate({
            temp: Math.round(data.main?.temp || 0),
            humidity: Math.round(data.main?.humidity || 0),
            rain: data.weather?.[0]?.main?.toLowerCase().includes("rain") || false,
            timestamp: Date.now()
          });
        }
      })
      .catch((err) => {
        console.error("Weather API error:", err);
        // Fallback to city-based weather
        fetchWeatherByCity();
      });
  }, [onWeatherUpdate]);

  const fetchWeatherByCity = useCallback(() => {
    if (!WEATHER_API_KEY) {
      setError("API Key not configured");
      setLoading(false);
      return;
    }

    fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${DEFAULT_CITY}&units=metric&appid=${WEATHER_API_KEY}`
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.cod !== 200) throw new Error(data.message || "Weather API error");
        
        setWeather(data);
        setLocation(null);
        setLoading(false);
        setError(null);
        setUseDefaultCity(true);
        
        // Send data to parent
        if (onWeatherUpdate) {
          onWeatherUpdate({
            temp: Math.round(data.main?.temp || 0),
            humidity: Math.round(data.main?.humidity || 0),
            rain: data.weather?.[0]?.main?.toLowerCase().includes("rain") || false,
            timestamp: Date.now()
          });
        }
      })
      .catch((err) => {
        console.error("Weather fetch error:", err);
        setError("Failed to fetch weather");
        setLoading(false);
      });
  }, [onWeatherUpdate]);

  const requestLocation = useCallback(() => {
    setRequestingLocation(true);
    if (!navigator.geolocation) {
      console.log("Geolocation not available, using default city");
      fetchWeatherByCity();
      setRequestingLocation(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        fetchWeatherForLocation(latitude, longitude);
        setRequestingLocation(false);
      },
      (err) => {
        console.error("Geolocation error:", err);
        // Fallback to city-based weather
        fetchWeatherByCity();
        setRequestingLocation(false);
      },
      { timeout: 5000, enableHighAccuracy: false }
    );
  }, [fetchWeatherByCity]);

  /* Request location on mount */
  useEffect(() => {
    requestLocation();
  }, [requestLocation]);

  /* Refresh weather every 3 minutes */
  useEffect(() => {
    const intervalId = setInterval(() => {
      if (location) {
        fetchWeatherForLocation(location.lat, location.lon);
      } else if (useDefaultCity) {
        fetchWeatherByCity();
      }
    }, 180000); // 3 minutes

    return () => clearInterval(intervalId);
  }, [location, useDefaultCity, fetchWeatherForLocation, fetchWeatherByCity]);

  if (loading && !error) {
    return (
      <div className="weather-card loading">
        <div className="loading-content">
          <div className="spinner"></div>
          <p>Getting your location & weather...</p>
          <small>Please allow location access when prompted</small>
        </div>
      </div>
    );
  }

  if (error && !weather) {
    return (
      <div className="weather-card error">
        <div className="error-content">
          <FaLocationArrow className="error-icon" />
          <p>{error}</p>
          <button onClick={requestLocation} disabled={requestingLocation}>
            {requestingLocation ? "Requesting..." : "Retry"}
          </button>
        </div>
      </div>
    );
  }

  if (!weather || !weather.main || !weather.weather) return null;

  const temp = Math.round(weather.main?.temp || 0);
  const condition = weather.weather?.[0]?.main || "Unknown";
  const humidity = weather.main?.humidity || 0;
  const windSpeed = weather.wind?.speed || 0;
  const feelsLike = Math.round(weather.main?.feels_like || 0);
  const city = weather.name || "Unknown";
  const country = weather.sys?.country || "";

  const getWeatherIcon = () => {
    if (condition.toLowerCase().includes("rain")) return <FaCloudRain />;
    if (condition.toLowerCase().includes("cloud")) return <FaCloud />;
    if (condition.toLowerCase().includes("clear") || condition.toLowerCase().includes("sunny"))
      return <FaSun />;
    return <FaCloud />;
  };

  return (
    <div className="weather-card">
      <div className="weather-header">
        <div className="location-info">
          <FaMapMarkerAlt className="location-icon" />
          <div>
            <h3>{city}, {country}</h3>
            <p className="condition">{condition}</p>
          </div>
        </div>
        <div className="weather-main">
          <div className="temp-display">
            <span className="temp-value">{temp}°</span>
            <div className="weather-icon">{getWeatherIcon()}</div>
          </div>
          <p className="feels-like">Feels like {feelsLike}°</p>
        </div>
      </div>

      <div className="weather-details">
        <div className="detail-item">
          <FaTint className="detail-icon humidity" />
          <div>
            <p className="detail-label">Humidity</p>
            <p className="detail-value">{humidity}%</p>
          </div>
        </div>
        <div className="detail-item">
          <FaWind className="detail-icon wind" />
          <div>
            <p className="detail-label">Wind</p>
            <p className="detail-value">{windSpeed.toFixed(1)} m/s</p>
          </div>
        </div>
      </div>

      <p className="last-update">🔴 Live weather • Updates every 3 min</p>
    </div>
  );
}
