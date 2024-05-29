
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const UserModel = require('./models/User');
const WeatherInformation = require('./models/WeatherInformation'); 
const MarksModel = require('./models/Marks');
const cron = require('node-cron');

const app = express();
app.use(express.json());
app.use(cors());


mongoose.connect('mongodb://127.0.0.1:27017/GaveshaWeather', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Error connecting to MongoDB', err));

  let recentSubmissions = {};


// Endpoint to login
app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await UserModel.findOne({ username: username });
    if (user) {
      if (user.password === password) {
        const userMarks = await MarksModel.findOne({ userId: user.userId });
        res.json({
          success: true,
          userId: user.userId, 
          username: user.username,
          marks: userMarks ? userMarks.marks : 0
        });
      } else {
        res.json({ success: false, message: "Password is incorrect" });
      }
    } else {
      res.json({ success: false, message: "No record existed" });
    }
  } catch (err) {
    console.error('Error finding user:', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});



// Endpoint to signUp
app.post('/signUp', async (req, res) => {
  try {
    const newUser = await UserModel.create(req.body);
    await MarksModel.create({ userId: newUser.userId, marks: 0 });

    res.json(newUser);
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});



// Endpoint to save weather data
app.post('/weatherData', async (req, res) => {
  const { userId, Weather_Situation, Date: dateString, Time: timeString, Value } = req.body;

  if (!recentSubmissions[userId]) {
    recentSubmissions[userId] = [];
  }
  recentSubmissions[userId].push(new Date().getTime()); 


  try {
    console.log('Request received:', req.body);

    const date = new Date(dateString); 
    const newWeatherData = await WeatherInformation.create({
      userId,
      Weather_Situation,
      Date: date,
      Time: timeString,
      Value
    });
    console.log('Weather data saved:', newWeatherData);
    
    // Mark allocation logic
    const [hour, minute] = timeString.split(':');
    const currentHour = `${hour}:00`; 
    const key = `${userId}-${Weather_Situation}-${dateString}-${currentHour}`;

    let userMarks = await MarksModel.findOne({ userId });

    if (userMarks) {

      if (userMarks.lastUpdated.has(key)) {
        console.log('User has already submitted in this hour:', userMarks);
      } else {
        userMarks.marks += 5;
        userMarks.lastUpdated.set(key, date);
        userMarks.lastSubmissionTime = date; 
        await userMarks.save();
        console.log('Marks updated:', userMarks);
      }
    } else {
      userMarks = await MarksModel.create({
        userId,
        marks: 5,
        lastUpdated: new Map([ [key, date] ]), 
        lastSubmissionTime: date 
      });
      console.log('Marks created:', userMarks);
    }

    res.json({ success: true, data: newWeatherData });
  } catch (error) {
    console.error('Error saving weather data:', error);
    res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
  }
});



// Endpoint to get weather data
app.get('/weatherData/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    const weatherData = await WeatherInformation.find({ userId: userId });
    res.json({ success: true, data: weatherData });
  } catch (error) {
    console.error('Error fetching weather data:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});



// Endpoint to get user marks
app.get('/userMarks/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    const userMarks = await MarksModel.findOne({ userId });

    if (userMarks) {
      res.json({ success: true, marks: userMarks.marks });
    } else {
      res.json({ success: false, message: 'No marks record found for this user' });
    }
  } catch (error) {
    console.error('Error fetching user marks:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});


//Set of functions to mark deduction process
// Function to retrieve and log all userIds from the Marks collection
async function logUserIdsFromMarks() {
  try {
    const userIds = await MarksModel.distinct('userId'); 
    console.log("User IDs in the Marks collection:", { userIds });
    return userIds;
  } catch (error) {
    console.log('Error retrieving user IDs from Marks collection:', { error });
    throw error;
  }
}


// Function to display users who submitted data within last 60 minutes
function getActiveUsers() {
  const now = new Date().getTime();
  const activeUsers = Object.keys(recentSubmissions)
    .filter(userId => {
      const submissionTimes = recentSubmissions[userId];
      return submissionTimes.some(time => now - time <= 3600000); //number of milisec
    });
  return activeUsers;
}


// Function to fetch, log marks for inactive users and deduct 10 marks
async function processMarksForInactiveUsers(inactiveUsers) {
  try {
    const marks = await MarksModel.find({ userId: { $in: inactiveUsers } });
    for (const mark of marks) {
      const newMarks = Math.max(0, mark.marks - 10); 
      console.log(`User ID: ${mark.userId}, Original Marks: ${mark.marks}, New Marks: ${newMarks}`);
      await MarksModel.updateOne({ userId: mark.userId }, { $set: { marks: newMarks } }); 
    }
  } catch (error) {
    console.log('Error processing marks for inactive users:', { error });
  }
}


// Function to display users who did not submit data within last 60 minutes
async function displayInactiveUsers() {
  try {
    const allUserIds = await logUserIdsFromMarks(); 
    if (!allUserIds || !Array.isArray(allUserIds)) {
      throw new Error('Invalid userIds retrieved from Marks collection');
    }

    const activeUsers = getActiveUsers(); 
    const inactiveUsers = allUserIds.filter(userId => !activeUsers.includes(userId)); 

    console.log("Users who did not submit data within the last hour:", { inactiveUsers });

    await processMarksForInactiveUsers(inactiveUsers); 
  } catch (error) {
    console.log('Error displaying inactive users:', { error });
  }
}
// Schedule the display function to run at the beginning of each 60-minute interval
cron.schedule('0 * * * *', () => {
  const now = new Date();
  const localString = now.toLocaleString();
  console.log(`[${localString}] New 60-minute interval starting...`);
  displayInactiveUsers();
;

})


app.listen(3001, () => {
  console.log('Server is running on port 3001');
});
