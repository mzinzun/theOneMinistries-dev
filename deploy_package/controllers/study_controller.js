const Study = require("../models/Study");
const path = require('path');

module.exports = {
    // For walkWord //

    createStudy(req, res) {
        console.log('req.body', req.body)
        const newStudy = new Study({
            title: req.body.title,
            content: req.body.content,
            category: req.body.category,
        })
        // create a new study
        console.log('newStudy', newStudy)
        // newStudy.content = req.body.content
        // newStudy.category = req.body.category
        // newStudy.title = req.body.title
        Study.create(newStudy)
            .then(resp => {
                console.log('resp', resp)
                res.json(resp)
            })
            .catch(e => {
                console.log(e)
                res.json(e)
            })

        // newStudy.save()
        //     .then(resp => {
        //         res.json(resp)
        //     })
        //     .catch(e => {
        //         console.log(e)
        //         res.json(e)
        //     })
    },
    updateStudy(req, res) {
        Study.findByIdAndUpdate
            (req.params.id, req.body, { new: true })
            .then(resp => {
                res.json(resp)
            })
            .catch(e => {
                console.log(e)
                res.json(e)
            })
    },
    addStudyInfo(req, res) {
    const newInfoObj = req.body.newSudy;

    console.log('Object to add in newInfoObj', newInfoObj);
    Study.findOneAndUpdate({ title: newInfoObj.title}, { $push: { 'content.info': newInfoObj.newInfo } }, { new: true })
        .then(resp => {
            res.json(resp)
        })
        .catch(e => {
            console.log(e)
            res.json(e)
        })

    },
    getStudies(req, res) {
        Study.find()
            .then(resp => {
                res.json(resp)
            })
            .catch(e => {
                console.log(e)
                res.json(e)
            })
    },
    getStudyContent(req, res) {
        const filePath = path.join(__dirname, '../assets/pdfs/youMatter.pdf');
        console.log('filePath', filePath)
        res.sendFile(filePath);
    }
}
