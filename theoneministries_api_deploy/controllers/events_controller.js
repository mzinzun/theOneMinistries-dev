// controller for Events Model
const Event= require('../models/Event')

module.exports = {
    // Get all events
    getEvents(req, res) {
        Event.find()
            .sort({ date: -1 }) // Sort by date in descending order
            .then(events => {
                res.json(events);
            })
            .catch(err => {
                console.error("Error fetching events:", err);
                res.status(500).json({ error: "Internal server error" });
            });
    },

    // Create a new event
    createEvent(req, res) {
        const { name, city, description, createdBy } = req.body;
        const newEvent = new Event({ name, city, description, createdBy });

        newEvent.save()
            .then(event => {
                res.status(201).json(event);
            })
            .catch(err => {
                console.error("Error creating event:", err);
                res.status(400).json({ error: "Bad request" });
            });
    },
    updateEvent (req, res) {
        const { id } = req.params;
        const { name, city, description, createdBy } = req.body;
        Event.findByIdAndUpdate(id, { name, city, description, createdBy }, { new: true })
            .then(event => {
                if (!event) {
                    return res.status(404).json({ error: "Event not found" });
                }
                res.json(event);
            })
            .catch(err => {
                console.error("Error updating event:", err);
                res.status(400).json({ error: "Bad request" });
            });
    }
};
//
