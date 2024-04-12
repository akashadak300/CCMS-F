// const express = require("express");
// const path = require("path");
// const app = express();
// const port = 3000;

// // Serve static files from the 'public' directory
// app.use(express.static(path.join(__dirname, "public")));

// // Define route for the homepage
// app.get("/", (req, res) => {
//     res.sendFile(path.join(__dirname, "/index.html"));
// });

// app.listen(port, () => {
//   console.log(`Example app listening on port ${port}`);
// });
//////////////////////////////////////////////

// const express = require('express');
// const app = express();
// const PORT = process.env.PORT || 3000;

// // Middleware
// app.use(express.static('public')); // Serve static files like CSS and images

// // Routes
// app.get('/', (req, res) => {
//   res.sendFile(__dirname + '/public/index.html');
// });

// app.get('/tools', (req, res) => {
//   res.sendFile(__dirname + '/public/tools.html');
// });

// // Start the server
// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });

///////////////////////////



// const express = require('express');
// const app = express();
// const PORT = process.env.PORT || 3000;

// // Middleware
// app.use(express.static('public')); // Serve static files like CSS and images
// app.use(express.urlencoded({ extended: true })); // Parse URL-encoded request bodies

// // Routes
// app.get('/', (req, res) => {
//   res.sendFile(__dirname + '/public/index.html');
// });

// app.get('/tools', (req, res) => {
//   res.sendFile(__dirname + '/public/tools.html');
// });

// app.get('/rank-predictor', (req, res) => {
//   res.sendFile(__dirname + '/public/rank-predictor.html');
// });

// // Add route handler for GET request to college-predictor page
// app.get('/college-predictor', (req, res) => {
//   res.sendFile(__dirname + '/public/college-predictor.html');
// });

// // Add route handler for POST request to college-predictor form submission
// app.post('/college-predictor', (req, res) => {
//   // Retrieve form data from request body
//   const { gender, category, marks, generalRank, categoryRank, state } = req.body;

//   // Perform necessary operations with the form data
//   // For example, you can calculate college predictions based on the input data

//   // Send response back to the client (this can be HTML or JSON)
//   res.send(`<h2>College Predictor Results</h2>
//             <p>Gender: ${gender}</p>
//             <p>Category: ${category}</p>
//             <p>Marks: ${marks}</p>
//             <p>General Rank: ${generalRank}</p>
//             <p>Category Rank: ${categoryRank}</p>
//             <p>State: ${state}</p>`);
// });

// // Start the server
// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });

/////////////////////////////

// const express = require('express');
// const app = express();
// const PORT = process.env.PORT || 3000;

// // Middleware
// app.use(express.static('public')); // Serve static files like CSS and images
// app.use(express.urlencoded({ extended: true })); // Parse URL-encoded request bodies

// // Routes
// app.get('/', (req, res) => {
//   res.sendFile(__dirname + '/public/index.html');
// });

// app.get('/tools', (req, res) => {
//   res.sendFile(__dirname + '/public/tools.html');
// });

// app.get('/rank-predictor', (req, res) => {
//   res.sendFile(__dirname + '/public/rank-predictor.html');
// });

// // Add route handler for GET request to college-predictor page
// app.get('/college-predictor', (req, res) => {
//   res.sendFile(__dirname + '/public/college-predictor.html');
// });

// // Add route handler for POST request to college-predictor form submission
// app.post('/college-predictor', (req, res) => {
//   // Retrieve form data from request body
//   const { gender, category, marks, generalRank, categoryRank, state } = req.body;

//   // Perform necessary operations with the form data
//   // For example, you can calculate college predictions based on the input data

//   // Send response back to the client (this can be HTML or JSON)
//   res.send(`<h2>College Predictor Results</h2>
//             <p>Gender: ${gender}</p>
//             <p>Category: ${category}</p>
//             <p>Marks: ${marks}</p>
//             <p>General Rank: ${generalRank}</p>
//             <p>Category Rank: ${categoryRank}</p>
//             <p>State: ${state}</p>`);
// });

// // Add route handler for previous page
// app.get('/prev', (req, res) => {
//   // Redirect to the previous page based on the referer header
//   const referer = req.get('referer');
//   res.redirect(referer);
// });

// // Add route handler for next page
// app.get('/next', (req, res) => {
//   // Redirect to the next page based on the referer header
//   const referer = req.get('referer');
//   // Logic to determine the next page URL based on the current URL
//   // For example:
//   // const nextUrl = '/nextPage'; // Replace '/nextPage' with the actual URL of the next page
//   res.redirect(nextUrl);
// });

// // Start the server
// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });



//////////////////////


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
