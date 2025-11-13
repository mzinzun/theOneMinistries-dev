const Script = require("../models/Script")

module.exports = {
    // Scripts on multiple pages //
    getScriptures (req, res) {
        Script.find()
        .then(scrips => {
            res.json(scrips)
        })
    },
}
