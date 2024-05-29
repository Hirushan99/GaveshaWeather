import axios from 'axios';
import React, { useState } from 'react';
import '../Styles/WeatherDataEntry.css';

function WeatherDataEntry({ userId, updateMarks }) {
  const [weatherSituation, setWeatherSituation] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [value, setValue] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleClear = () => {
    setWeatherSituation('');
    setDate('');
    setTime('');
    setValue('');
    setError(null);
    setSuccess(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = { userId, Weather_Situation: weatherSituation, Date: date, Time: time, Value: value };

    try {
      const response = await axios.post('http://localhost:3001/weatherData', data);
      if (response.data.success) {
        window.alert('Data Entered Successfully'); 
        setError(null);
        setSuccess('Data entered successfully');
        handleClear(); 

        // Fetch updated marks
        const userResponse = await axios.get(`http://localhost:3001/userMarks/${userId}`);
        if (userResponse.data.success) {
          updateMarks(userResponse.data.marks);
        }
      } else {
        setError('Error submitting data');
        setSuccess(null);
      }
    } catch (error) {
      console.error('Error submitting the data:', error);
      setError(`Internal server error: ${error.message}`);
      setSuccess(null);
    }
  };

  return (
    <div className='weatherDataEntryContainer'>
      <h1 className='weatherDataEntryHeader'>WEATHER</h1>
      <form onSubmit={handleSubmit} className='weatherDataDiv'>
        <div>
          <h3>Weather Situation</h3>
          <div>
            <select
              id="weatherSituation"
              value={weatherSituation}
              onChange={(e) => setWeatherSituation(e.target.value)}
              required
            >
              <option value="">Select</option>
              <option value="temperature">Temperature</option>
              <option value="humidity">Humidity</option>
              <option value="rainfall">Rainfall</option>
              <option value="atmospheric_Pressure">Atmospheric pressure</option>
              <option value="visibility">Visibility</option>
              <option value="air_Quality">Air Quality</option>
              <option value="soil_Moisture">Soil Moisture</option>
            </select>
          </div>
        </div>
        <div>
          <h3>Date</h3>
          <input
            type="date"
            id="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>
        <div>
          <h3>Time</h3>
          <input
            type="time"
            id="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            required
          />
        </div>
        <div>
          <h3>Value</h3>
          <input
            type="text"
            id="value"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            required
          />
        </div>
        <div>
          <button type="submit">Submit</button>
          
          <button type="button" onClick={handleClear}>Clear</button>
        </div>
      </form>
      {error && <p className="error">{error}</p>}
      {success && <p className="success">{success}</p>}
    </div>
  );
}

export default WeatherDataEntry;
