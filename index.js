const express = require('express');
const app = express();

const path = require("path");
const  {fileURLToPath}=require('url');
// const __dirname = path.dirname(fileURLToPath(import.meta.url));
const port = 3000;
const db = require("./database.js");
const bodyParser = require("body-parser");
app.use(express.static(path.join(__dirname, "/public")));
// import { fileURLToPath } from 'url';
// import path from 'path';

app.set('view engine', 'ejs');
app.set("views", path.join(__dirname, "/views"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));




app.get('/', (req, res) => {
  // res.render(path.join(__dirname, '/public/home.html'));
  res.render("index");
});

app.get('/rank-predictor', (req, res) => {

  res.render("rank-predictor");

});
app.get('/tools', (req, res) => {
  res.render("tools");
});


app.post('/rank-predictor', async (req, res) => {
  const { marks, category } = req.body;
  const str = `SELECT ROUND(AVG(EQ_CRL), 0) AS avg_EQ_CRL, ROUND(AVG(CAT_CRL), 0) AS avg_CAT_CRL
  FROM (
    SELECT EQ_CRL, CAT_CRL
    FROM (
      SELECT EQ_CRL, CAT_CRL, MARKS
      FROM \`ccms_finalised_tables - marks_vs_rank_2023\`
      WHERE MARKS < ${marks} AND CAT='${category}'
      ORDER BY MARKS ASC
      LIMIT 1
    ) AS tbl1
  
    UNION ALL
  
    SELECT EQ_CRL, CAT_CRL
    FROM (
      SELECT EQ_CRL, CAT_CRL, MARKS
      FROM \`ccms_finalised_tables - marks_vs_rank_2022\`
      WHERE MARKS < ${marks} AND CAT='${category}'
      ORDER BY MARKS DESC
      LIMIT 1
    ) AS tbl2
  
    UNION ALL
  
    SELECT EQ_CRL, CAT_CRL
    FROM (
      SELECT EQ_CRL, CAT_CRL, MARKS
      FROM \`ccms_finalised_tables - marks_vs_rank_2021\`
      WHERE MARKS < ${marks} AND CAT='${category}'
      ORDER BY MARKS DESC
      LIMIT 1
    ) AS tbl3
  
    UNION ALL
  
    SELECT EQ_CRL, CAT_CRL
    FROM (
      SELECT EQ_CRL, CAT_CRL, MARKS
      FROM \`ccms_finalised_tables - marks_vs_rank_2020\`
      WHERE MARKS < ${marks} AND CAT='${category}'
      ORDER BY MARKS DESC
      LIMIT 1
    ) AS tbl4
  
    UNION ALL
  
    SELECT EQ_CRL, CAT_CRL
    FROM (
      SELECT EQ_CRL, CAT_CRL, MARKS
      FROM \`ccms_finalised_tables - marks_vs_rank_2019\`
      WHERE MARKS < ${marks} AND CAT='${category}'
      ORDER BY MARKS DESC
      LIMIT 1
    ) AS tbl5
  ) AS subquery1;
  `;

  const results = await db.promise().query(str);
  console.log(results[0]);
  res.send(results[0]);
  


});

app.get('/college-predictor', (req, res) => {
  res.render("college-predictor");
});

app.post('/college-predictor', (req, res) => {
  const { gender, category, adv_gen_rank, adv_cat_rank, year, margin } = req.body;
  const openingRank = Math.floor(adv_cat_rank - (adv_cat_rank * margin));
  const closingRank = Math.ceil(parseInt(adv_cat_rank) + (parseInt(adv_cat_rank) * parseFloat(margin)));


  res.redirect(`/college-predictor-results?gender=${gender}&category='${category}'&adv_gen_rank=${adv_gen_rank}&adv_cat_rank=${adv_cat_rank}&year=${year}&margin=${margin}`);
});

app.get('/college-comparison', (req, res) => {
  res.render("college-comparison");
});

app.post('/comparison', (req, res) => {
  const { gender, category, adv_gen_rank, adv_cat_rank, year, margin } = req.body;
  const openingRank = Math.floor(adv_cat_rank - (adv_cat_rank * margin));
  const closingRank = Math.ceil(parseInt(adv_cat_rank) + (parseInt(adv_cat_rank) * parseFloat(margin)));


  // res.redirect(`/college-predictor-results?gender=${gender}&category='${category}'&adv_gen_rank=${adv_gen_rank}&adv_cat_rank=${adv_cat_rank}&year=${year}&margin=${margin}`);
});


app.get('/college', (req, res) => {
  res.render("college"); 
});

app.get('/prev', (req, res) => {
  const referer = req.get('referer');
  res.redirect(referer);
});

app.get('/next', (req, res) => {
  const referer = req.get('referer');
  res.redirect(referer);
});

app.get('/college-predictor-results', (req, res) => {
  const { gender, category, adv_gen_rank, adv_cat_rank, year, margin } = req.query;

  res.render("college-predictor-results");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
app.get('/cutoff', (req, res) => {
  res.render("cutoff");
});

// const sqlite3 = require('sqlite3').verbose();
// const express = require('express');
// const path = require('path');
// const app = express();
// const port = process.env.port || 3000;

// app.set('view engine', 'ejs');
// app.set('views', path.join(__dirname, 'views'));
// app.use(express.static('public'));
// app.use(express.urlencoded({ extended: true }));

// app.get('/', (req, res) => {
//   res.render(path.join(__dirname, '/public/home.html'));
// });

// app.get('/tools', (req, res) => {
//   res.render(path.join(__dirname, '/public/tools.html'));
// });

// app.get('/rank-predictor', (req, res) => {
//   res.render(path.join(__dirname, '/public/rank-predictor.html'));
// });

// app.post('/rank-predictor', (req, res) => {
//   const { gender, category, marks } = req.body;
//   res.send(`<h2>Rank Predictor Results</h2>
//             <p>Gender: ${gender}</p>
//             <p>Category: '${category}'</p>
//             <p>Marks: ${marks}</p>
//             <a href="/">Home</a> | <a href="/tools">Tools</a>`);
// });

// app.get('/college-predictor', (req, res) => {
//   res.render(path.join(__dirname, '/public/college-predictor.html'));
// });

// app.post('/college-predictor', (req, res) => {
//   const { gender, category, adv_gen_rank, adv_cat_rank, year, margin } = req.body;
//   const openingRank = Math.floor(adv_cat_rank - (adv_cat_rank * margin));
//   const closingRank = Math.ceil(parseInt(adv_cat_rank) + (parseInt(adv_cat_rank) * parseFloat(margin)));

//   res.redirect(`/college-predictor-results?gender=${gender}&category='${category}'&adv_gen_rank=${adv_gen_rank}&adv_cat_rank=${adv_cat_rank}&year=${year}&margin=${margin}`);
// });

// app.get('/college-comparison', (req, res) => {
//   res.render(path.join(__dirname, '/public/college-comparison.html'));
// });

// app.post('/comparison', (req, res) => {
//   const { gender, category, adv_gen_rank, adv_cat_rank, year, margin } = req.body;
//   const openingRank = Math.floor(adv_cat_rank - (adv_cat_rank * margin));
//   const closingRank = Math.ceil(parseInt(adv_cat_rank) + (parseInt(adv_cat_rank) * parseFloat(margin)));

//   // You can add logic for processing comparison data here
// });

// app.get('/college', (req, res) => {
//   res.render(path.join(__dirname, '/public/college.html')); 
// });

// app.get('/prev', (req, res) => {
//   const referer = req.get('referer');
//   res.redirect(referer);
// });

// app.get('/next', (req, res) => {
//   const referer = req.get('referer');
//   res.redirect(referer);
// });

// app.get('/college-predictor-results', (req, res) => {
//   const { gender, category, adv_gen_rank, adv_cat_rank, year, margin } = req.query;

//   res.render(path.join(__dirname, '/public/college-predictor-results.html'));
// });

// app.listen(port, () => {
//   console.log(`Server is running on port ${port}`);
// });


// app.get('/cutoff', (req, res) => {
//   res.render(path.join(__dirname, '/public/cutoff.html'));
// });

// app.post('/predict-rank', (req, res) => {
//   const { category, marks } = req.body;


//   const db = new sqlite3.Database('CCMS.db');


//   db.get('SELECT EQ_CRL, CAT_CRL FROM marks_vs_rank WHERE Category = ? AND MARKS = ?', [category, marks], (err, row) => {
//       if (err) {
//           console.error(err);
//           res.status(500).send('Internal Server Error');
//       } else {
//           if (row) {
//               res.send(`<h2>Predicted Rank</h2>
//                         <p>Category: '${category}'</p>
//                         <p>Marks: ${marks}</p>
//                         <p>Equivalent Rank: ${row.EQ_CRL}</p>
//                         <p>Category Rank: ${row.CAT_CRL}</p>
//                         <a href="/">Home</a> | <a href="/tools">Tools</a>`);
//           } else {
//               res.send('No data found for the provided input');
//           }
//       }


//       db.close();
//   });
// });

// 