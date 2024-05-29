const mongoose = require('mongoose');
const { Schema } = mongoose;

const WeatherInformationSchema = new Schema({
    userId: { type: String, required: true },
    Weather_Situation: { type: String, required: true },
    Date: { type: Date, required: true },
    Time: { type: String, required: true },
    Value: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('WeatherInformation', WeatherInformationSchema);
