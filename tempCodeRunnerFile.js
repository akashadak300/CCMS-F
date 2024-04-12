const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.redirect('/college-predictor'); // Redirect to college-predictor page
});

app.get('/tools', (req, res) => {
  res.sendFile(__dirname + '/public/tools.html');
});

app.get('/rank-predictor', (req, res) => {
  res.sendFile(__dirname + '/public/rank-predictor.html');
});

app.post('/rank-predictor', (req, res) => {
  const { gender, category, marks } = req.body;
  res.send(`<h2>Rank Predictor Results</h2>
            <p>Gender: ${gender}</p>
            <p>Category: ${category}</p>
            <p>Marks: ${marks}</p>`);
});

app.get('/college-predictor', (req, res) => {
  res.sendFile(__dirname + '/public/college-predictor.html');
});

app.get('/college', (req, res) => {
  res.sendFile(__dirname + '/public/college.html'); // Serve college.html for /college route
});

app.get('/prev', (req, res) => {
  const referer = req.get('referer');
  res.redirect(referer);
});

app.get('/next', (req, res) => {
  const referer = req.get('referer');
  res.redirect(referer);
});

app.post('/college-predictor', (req, res) => {
  const { gender, category, marks, generalRank, categoryRank, state } = req.body;
  res.send(`<h2>College Predictor Results</h2>
            <p>Gender: ${gender}</p>
            <p>Category: ${category}</p>
            <p>Marks: ${marks}</p>
            <p>General Rank: ${generalRank}</p>
            <p>Category Rank: ${categoryRank}</p>
            <p>State: ${state}</p>`);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
