const Contribution = require("../models/Contribution")

module.exports = {
    // For tracking contributions //
    createContribution(req, res) {
        req.body.user_id = req.user;
        Contribution.create(req.body)
            .then(resp => {
                console.log(resp)
                res.json({ success: true, data: resp })
            })
            .catch(e => {
                console.log(e)
                res.json({ success: false, message: e })
            })
    },
    getContribution(req, res) {
        Contribution.find({user_id: req.params.id})
            .then(resp => {
                console.log(resp)
                res.json(resp)
            })
            .catch(e => {
                console.log(e)
                res.json(e)
            })
    },
}
