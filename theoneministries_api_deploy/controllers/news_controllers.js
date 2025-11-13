const axios = require('axios');
const fs = require('fs');
const path = require('path');

module.exports = {
  getNews(req, res) {
    // const options = {
    //   method: 'GET',
    //   url: 'https://google-news13.p.rapidapi.com/world',
    //   params: { lr: 'en-US' },
    //   headers: {
    //     'x-rapidapi-host': 'google-news13.p.rapidapi.com',
    //     // Access the API key from the server's environment variables
    //     'x-rapidapi-key': process.env.RAPIDAPI_KEY
    //   }
    // };
    // axios.request(options)
    //   .then(response => {
    //     res.json(response.data);
    //   })
    //   .catch(err => {
    //     console.error("Error fetching news:", err.response ? err.response.data : err.message);
    //     res.status(500).json({ message: "Error fetching news from external API" });
    //   });
  },

  getNewsFile(req, res) {
    console.log('getNewsFile function called');
    const filePath = path.join(__dirname, '..', 'assets', 'news-file.json');
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        console.error("Error reading news file:", err);
        return res.status(500).json({ message: "Error reading news file." });
      }
      const newsData = JSON.parse(data);
      console.log('newsData', newsData);
      res.json(newsData);
    });
    }
}
