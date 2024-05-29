import React from 'react';
import { useNavigate } from 'react-router-dom';

function UserProfile({ userId, username }) {

  const navigate = useNavigate();

  const handleViewButtonClick = () => {
    navigate('/weatherTable', { state: { userId } });
  };


  return (
    <div className='userProfileContainer'>
      <div className="userid_div">
        <h3>User ID</h3>
        <input
          type="text"
          id="userId"
          value={userId}
          readOnly
          style={{ width: '100px', height: '40px' }} 
        />
      </div>

      <div className="username_div">
        <h3>Username</h3>
        <input
          type="text"
          id="username"
          value={username}
          readOnly
          style={{ width: '100px', height: '40px' }} 
        />
      </div>

      <div className='viewButton'>
        <button type="button" onClick={handleViewButtonClick}>View</button>
      </div>
    </div>
  );
}

export default UserProfile;
