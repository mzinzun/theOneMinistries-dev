// Events model for the API server
const mongoose = require('mongoose');
const eventsSchema = new mongoose.Schema(
    {
        name: String,
        city: String,
        description: String,
        createdBy: String, // User ID or username of the creator
        createdAt: { type: Date, default: Date.now }
    }
);
const Events = mongoose.model('Events', eventsSchema);
module.exports = Events;
// This model defines the structure of an event in the database.
