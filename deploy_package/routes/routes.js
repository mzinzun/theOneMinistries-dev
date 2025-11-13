const express = require('express');
const router = express.Router();

const user_Controller = require('../controllers/user_controller')
const scrip_Controller = require('../controllers/scrip_controller.js')
const encourage_Controller = require('../controllers/encourage_controller')
const charity_Controller = require('../controllers/charity_controller')
const contirbution_Controller = require('../controllers/contribution_controller')
const study_Controller = require('../controllers/study_controller');
const events_Controller = require('../controllers/events_controller');
const prayers_controller = require('../controllers/prayers_controller');
const questions_controller = require('../controllers/questions_controller');
const news_controllers = require('../controllers/news_controllers');


module.exports = (app, authenticateToken) => {

// ********* User routes *********//
app.post('/create_user', user_Controller.createUser);
app.get('/get_users', user_Controller.getUsers);
app.put('/update_user', authenticateToken, user_Controller.updateUser); // For self-updates
app.put('/update_user/:username', authenticateToken, user_Controller.updateUser); // For admin updates


// ******** Study routes *********//
app.get('/get_studies', study_Controller.getStudies)
app.get('/study_content', study_Controller.getStudyContent)
app.post('/create_study', study_Controller.createStudy)
app.put('/update_study/:id', study_Controller.updateStudy)
app.put('/add_study_info', study_Controller.addStudyInfo)

// app.delete('/delete_study/:id', study_Controller.deleteStudy)

// app.post('/contribution', authenticateToken,contirbution_Controller.createContribution);

// ******** charity routes *********//
app.post('/create_charity', charity_Controller.createCharity);
app.put('/update_charity/:id', charity_Controller.updateCharity)
app.get('/get-charities', charity_Controller.getCharities)

// ******** scripture routes *********//
app.get('/get_scriptures', scrip_Controller.getScriptures)

// ******** encourage routes *********//
app.get('/get_encourage', encourage_Controller.getEncourage)

// ******** Events routes *********//
app.post('/create_event',events_Controller.createEvent);
app.get('/get_events', events_Controller.getEvents);
// app.put('/update_event/:id', events_Controller.updateEvent);
// app.delete('/delete_event/:id', events_Controller.deleteEvent);

// ******** Prayer routes *********//
app.post('/create_prayer', prayers_controller.createPrayer);
app.get('/get_prayers', prayers_controller.getPrayers);

// ******** Questions routes *********//
app.post('/create_question', questions_controller.createQuestion);
app.get('/get_questions', questions_controller.getQuestions);
app.get('/get_question/:id', questions_controller.getQuestionById);
app.put('/update_question/:id', questions_controller.updateQuestion);
app.delete('/delete_question/:id', questions_controller.deleteQuestion);

// ******** News Story routes *********//
app.get('/get_news', news_controllers.getNews)
app.get('/get_news_file', news_controllers.getNewsFile)
// app.get('/get_contribution/:id', contirbution_Controller.getContribution)

// app.put('/add_moral/:id', user_Controller.addMoral)

// app.delete('/delete_Moral/:id/:index', user_Controller.deleteMoral)
// app.delete('/delete_user/:id', user_Controller.deleteUser)

}
