const mongoose = require('mongoose');

const db = mongoose.connect('mongodb://127.0.0.1:27017/the-one-ministries-db', {})
  .then(() => console.log('Connected!'));

module.exports = mongoose.connection.on('open', () => {
    console.log(`Connected to the-one-ministries-db collection`);
})
