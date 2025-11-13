const Charity = require("../models/Charity")

module.exports = {
    // For Support page //
    getCharities(req, res) {
        Charity.find()
            // .sort({text: 1})
            .then(resp => {
                // console.log(resp)
                res.json(resp)
            })
            .catch(e => {
                console.log(e)
                res.json(e)
            })
    },
    createCharity(req, res) {
        Charity.create(req.body)
            .then(resp => {
                // console.log(resp)
                res.json(resp)
            })
            .catch(e => {
                console.log(e)
                res.json(e)
            })
    },
    updateCharity(req, res) {
        Charity.findByIdAndUpdate(req.params.id, req.body,{new:true})
            .then(resp => {
                // console.log(resp)
                res.json(resp)
            }
            )
            .catch(e => {
                console.log(e)
                res.json(e)
            })
    }
}
