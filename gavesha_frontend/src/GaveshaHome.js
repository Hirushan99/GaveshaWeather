import axios from 'axios';
import React, { useEffect } from 'react';
import UserProfile from './Components/UserProfile';
import WeatherDataEntry from './Components/WeatherDataEntry';
import WeatherMarks from './Components/WeatherMarks';
import './Styles/GaveshaHome.css';

function GaveshaHome({ userId, username, marks, setMarks }) {
  useEffect(() => {
    const fetchMarks = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/userMarks/${userId}`);
        if (response.data.success) {
          setMarks(response.data.marks);
        }
      } catch (error) {
        console.error('Error fetching marks:', error);
      }
    };

    fetchMarks();
  }, [userId, setMarks]);

  return (
    <div className='gaveshaHomeContainer'>
      <div className='weatherDataEntry_div'>
        <WeatherDataEntry userId={userId} updateMarks={setMarks} />  
      </div>
      <div className='userProfile_div'>
        <UserProfile userId={userId} username={username} />
      </div>
      <div className='weatherMarks_div'>
        <WeatherMarks marks={marks}/>
      </div>
    </div>
  );
}

export default GaveshaHome;
