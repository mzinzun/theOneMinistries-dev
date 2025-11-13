const Encourage = require("../models/Encourage")

module.exports = {
    // For encourage page //
    getEncourage (req, res) {
        Encourage.find()
        .sort({text: 1})
        .then(resp => {
            res.json(resp)
        })
    },
}