const Question = require('../models/Question');

module.exports = {
    createQuestion(req, res) {
        const { question, createdBy } = req.body;
        const newQuestion = new Question({
            question,
            createdBy,
        });
        newQuestion.save()
            .then((savedQuestion) => {
                res.status(201).json(savedQuestion);
            })
            .catch((error) => {
                console.error('Error creating question:', error);
                res.status(500).json({ error: 'Failed to create question' });
            });
    },
    getQuestions(req, res) {
        Question.find()
            .then((questions) => {
                res.status(200).json(questions);
            })
            .catch((error) => {
                console.error('Error fetching questions:', error);
                res.status(500).json({ error: 'Failed to fetch questions' });
            });
    },
    getQuestionById(req, res) {
        const { id } = req.params;
        Question.findById(id)
            .then((question) => {
                if (!question) {
                    return res.status(404).json({ error: 'Question not found' });
                }
                res.status(200).json(question);
            })
            .catch((error) => {
                console.error('Error fetching question:', error);
                res.status(500).json({ error: 'Failed to fetch question' });
            });
    },
    updateQuestion(req, res) {
        const { id } = req.params;
        // req.body only includes fields that need updating (e.g., { question: "New question text" })
        const updateData = req.body;

        Question.findByIdAndUpdate(id, updateData, { new: true, runValidators: true })
            .then((updatedQuestion) => {
                if (!updatedQuestion) {
                    return res.status(404).json({ error: 'Question not found' });
                }
                res.status(200).json(updatedQuestion);
            })
            .catch((error) => {
                console.error('Error updating question:', error);
                res.status(500).json({ error: 'Failed to update question' });
            });
    },
    deleteQuestion(req, res) {
        const { id } = req.params;
        Question.findByIdAndDelete(id)
            .then((deletedQuestion) => {
                if (!deletedQuestion) {
                    return res.status(404).json({ error: 'Question not found' });
                }
                res.status(200).json({ message: 'Question deleted successfully' });
            })
            .catch((error) => {
                console.error('Error deleting question:', error);
                res.status(500).json({ error: 'Failed to delete question' });
            });
    }
}
