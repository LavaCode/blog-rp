import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Ticker.css';

function Ticker({ onClick }) {
  const [news, setNews] = useState([]);
  const [weather, setWeather] = useState(null);

  const apiKey = process.env.REACT_APP_WEATHER_API_KEY;

  useEffect(() => {
    axios.get('https://api.rss2json.com/v1/api.json?rss_url=https://feeds.nos.nl/nosnieuwsalgemeen')
      .then(response => {
        setNews(response.data.items);
      })
      .catch(error => console.error(error));

    axios.get(`https://api.openweathermap.org/data/2.5/weather?q=Alkmaar&appid=${apiKey}`)
      .then(response => setWeather(response.data))
      .catch(error => console.error(error));
  }, [apiKey]);

  return (
    <div className="ticker" onClick={onClick}>
      {weather && (
        <div className="weather">
          {`${weather.name}: ${Math.round(weather.main.temp - 273.15)}°C`}
        </div>
      )}
      <div className="ticker-content-wrapper">
        <div className="ticker-content">
          {news.concat(news).map((article, index) => (
            <span key={index}>{article.title}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Ticker;