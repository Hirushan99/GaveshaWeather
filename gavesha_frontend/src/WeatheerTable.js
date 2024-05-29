import React from 'react';
import { useLocation } from 'react-router-dom';
import WeatherInformationTable from './Components/WeatherInformationTable';

function WeatheerTable() {
  const location = useLocation();
  const { userId } = location.state || {};

  return (
    <div>
      <h1>Weather Information Table</h1>
      <WeatherInformationTable userId={userId} />
    </div>
  );
}

export default WeatheerTable;
