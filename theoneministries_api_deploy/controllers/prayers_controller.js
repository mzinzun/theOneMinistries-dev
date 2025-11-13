const Prayer = require('../models/Prayer.js');

const express = require('express');
const router = express.Router();

module.exports = {
    // create prayer request
    createPrayer(req, res) {
        const { name, subject, prayer, createdBy } = req.body;
        const newPrayer = new Prayer({
            name,
            subject,
            prayer,
            createdBy
        });
        newPrayer.save()
            .then(prayer => {
                res.status(200).json({
                    message: "Prayer created successfully",
                    prayer: prayer
                });
            })
            .catch(err => {
                console.error("Error creating prayer:", err);
                res.status(500).json({
                    message: "Error creating prayer",
                    error: err.message
                });
            }
            );
    },
    // get all prayers
    getPrayers(req, res) {
        Prayer.find()
            .then(prayers => {
                res.status(200).json({
                    message: "Prayers fetched successfully",
                    prayers: prayers
                });
            })
            .catch(err => {
                res.status(500).json({
                    message: "Error fetching prayers",
                    error: err.message
                });
            });
    }
}
