import axios from 'axios';
import React, { useEffect, useState } from 'react';
import '../Styles/WeatherInformationTable.css';

const WeatherInformationTable = ({ userId }) => {
  const [weatherData, setWeatherData] = useState([]);

  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/weatherData/${userId}`);
        if (response.data.success) {
          setWeatherData(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching weather data:', error);
      }
    };

    fetchWeatherData();
  }, [userId]);

  return (
    <div className="table-container">
      <h1 className="table-header">Weather Data Table</h1>
      <table className="weather-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Time</th>
            <th>Weather Situation</th>
            <th>Value</th>
            <th>TimeStamp</th>
          </tr>
        </thead>
        <tbody>
          {weatherData.map((row, index) => (
            <tr key={index}>
              <td>{new Date(row.Date).toLocaleDateString()}</td>
              <td>{row.Time}</td>
              <td>{row.Weather_Situation}</td>
              <td>{row.Value}</td>
              <td>{new Date(row.createdAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default WeatherInformationTable;
