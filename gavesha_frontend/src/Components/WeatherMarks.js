import React from 'react';
import '../Styles/WeatherMarks.css';

function WeatherMarks({ marks }) {
  return (
    <div className='weatherMarks'>
      <div>
        <input
          type="text"
          id="readOnlyValue"
          value={marks}
          readOnly
          className="readOnlyInput"
        />
        <h2>Your Marks</h2>
      </div>
    </div>
  );
}

export default WeatherMarks;
