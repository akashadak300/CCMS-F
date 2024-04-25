const express = require("express");
const app = express();

const path = require("path");
const { fileURLToPath } = require("url");
// const __dirname = path.dirname(fileURLToPath(import.meta.url));
const port = 3000;
const db = require("./database.js");
const bodyParser = require("body-parser");
app.use(express.static(path.join(__dirname, "/public")));
// import { fileURLToPath } from 'url';
// import path from 'path';

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));





app.get("/", (req, res) => {
  // res.render(path.join(__dirname, '/public/home.html'));
  res.render("index");
});

app.get("/tools", (req, res) => {
	res.render("tools");
});







app.get("/rank-predictor", (req, res) => {
  res.render("rank-predictor");
});
app.post("/rank-predictor", async (req, res) => {
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

  const str2 = `SELECT ROUND(AVG(EQ_CRL), 0) AS avg_EQ_CRL, ROUND(AVG(CAT_CRL), 0) AS avg_CAT_CRL
FROM (
  SELECT EQ_CRL, CAT_CRL
  FROM (
    SELECT EQ_CRL, CAT_CRL, MARKS
    FROM \`ccms_finalised_tables - marks_vs_rank_2023\`
    WHERE MARKS > ${marks} AND CAT='${category}'
    ORDER BY MARKS DESC
    LIMIT 1
  ) AS tbl1

  UNION ALL

  SELECT EQ_CRL, CAT_CRL
  FROM (
    SELECT EQ_CRL, CAT_CRL, MARKS
    FROM \`ccms_finalised_tables - marks_vs_rank_2022\`
    WHERE MARKS > ${marks} AND CAT='${category}'
    ORDER BY MARKS DESC
    LIMIT 1
  ) AS tbl2

  UNION ALL

  SELECT EQ_CRL, CAT_CRL
  FROM (
    SELECT EQ_CRL, CAT_CRL, MARKS
    FROM \`ccms_finalised_tables - marks_vs_rank_2021\`
    WHERE MARKS > ${marks} AND CAT='${category}'
    ORDER BY MARKS DESC
    LIMIT 1
  ) AS tbl3

  UNION ALL

  SELECT EQ_CRL, CAT_CRL
  FROM (
    SELECT EQ_CRL, CAT_CRL, MARKS
    FROM \`ccms_finalised_tables - marks_vs_rank_2020\`
    WHERE MARKS > ${marks} AND CAT='${category}'
    ORDER BY MARKS DESC
    LIMIT 1
  ) AS tbl4

  UNION ALL

  SELECT EQ_CRL, CAT_CRL
  FROM (
    SELECT EQ_CRL, CAT_CRL, MARKS
    FROM \`ccms_finalised_tables - marks_vs_rank_2019\`
    WHERE MARKS > ${marks} AND CAT='${category}'
    ORDER BY MARKS DESC
    LIMIT 1
  ) AS tbl5
) AS subquery2;`;

  try {
    // Execute the first query
    const [results1] = await db.promise().query(str);
    console.log(results1[0]);

    // Execute the second query
    const [results2] = await db.promise().query(str2);
    console.log(results2[0]);

    // Send both results in the response
    res.render("rank-predictor-results", {
      data: {
        "max-range-average": results1[0],
        "min-range-average": results2[0],
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error");
  }
});

app.get("/rank-predictor-result", async (req, res) => {
  res.render("rank-predictor-results");
});





app.get("/college-predictor", (req, res) => {
  res.render("college-predictor");
});

app.post("/college-predictor", async (req, res) => {
  const { gender, category, adv_gen_rank, adv_cat_rank, year, margin } =
    req.body;

  const countQuery = `SELECT COUNT(*) AS total_count
  FROM (
      SELECT \`Institute_Name\`, Academic_program_name, ${category}_${gender}_OR, ${category}_${gender}_CR
      FROM \`ccms_finalised_tables - institute\` AS insti
      INNER JOIN \`ccms_finalised_tables - or_cr_${year}\` AS mvr ON insti.Institute_code = mvr.Institute_code
      WHERE ${category}_${gender}_CR > ${adv_cat_rank}
  ) AS tab;`;


  const totalQuery = `SET @limit_percentage = ${margin};
  SET @total_count = (
      SELECT COUNT(*) AS total_count
      FROM (
          SELECT \`Institute_Name\`, Academic_program_name, ${category}_${gender}_OR, ${category}_${gender}_CR
          FROM \`ccms_finalised_tables - institute\` AS insti
          INNER JOIN \`ccms_finalised_tables - or_cr_${year}\` AS mvr ON insti.Institute_code = mvr.Institute_code
          WHERE ${category}_${gender}_CR > ${adv_cat_rank}
      ) AS tab
  );
  SET @limit_rows = CEIL(@total_count * @limit_percentage);`;

  const prepareQuery = `SET @sql = CONCAT('
      SELECT \`Institute_Name\`, Academic_program_name, ${category}_${gender}_OR, ${category}_${gender}_CR
      FROM \`ccms_finalised_tables - institute\` AS insti
      INNER JOIN \`ccms_finalised_tables - or_cr_${year}\` AS mvr ON insti.Institute_code = mvr.Institute_code
      WHERE ${category}_${gender}_CR > ${adv_cat_rank}
      ORDER BY ${category}_${gender}_OR
      LIMIT ', @limit_rows);
  PREPARE stmt FROM @sql;`;

  const executeQuery = `EXECUTE stmt;
  DEALLOCATE PREPARE stmt;`;
  try {
    // Execute the count query
    const [countResult] = await db.promise().query(countQuery);
    console.log(countResult);

    // Execute the totalQuery
    await db.promise().query(`SET @limit_percentage = ${margin}`);
    const [totalCount] = await db.promise().query(`
      SELECT COUNT(*) AS total_count
      FROM (
          SELECT \`Institute_Name\`, Academic_program_name, ${category}_${gender}_OR, ${category}_${gender}_CR
          FROM \`ccms_finalised_tables - institute\` AS insti
          INNER JOIN \`ccms_finalised_tables - or_cr_${year}\` AS mvr ON insti.Institute_code = mvr.Institute_code
          WHERE ${category}_${gender}_CR > ${adv_cat_rank}
      ) AS tab
    `);

    // Calculate the limit in JavaScript
    const limit = Math.ceil(totalCount[0].total_count * margin);

    // Construct the SQL query as a string
    const sql = `
      SELECT \`Institute_Name\`, Academic_program_name, ${category}_${gender}_OR, ${category}_${gender}_CR
      FROM \`ccms_finalised_tables - institute\` AS insti
      INNER JOIN \`ccms_finalised_tables - or_cr_${year}\` AS mvr ON insti.Institute_code = mvr.Institute_code
      WHERE ${category}_${gender}_CR > ${adv_cat_rank}
      ORDER BY ${category}_${gender}_OR
      LIMIT ${limit}
    `;

    // Execute the SQL query
    const [results] = await db.promise().query(sql);
    console.log(results);

    res.render("college-predictor-results", {
      gender,
      category,
      adv_gen_rank,
      adv_cat_rank,
      year,
      margin,
      data: results, // Pass the fetched data to the view
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error");
  }
});

app.get("/college-predictor-results", async (req, res) => {
    res.render("college-predictor-results");
});






// app.get("/college-comparison", (req, res) => {
//   res.render("college-comparison");
// });

// app.post("/comparison", (req, res) => {
//   const { gender, category, adv_gen_rank, adv_cat_rank, year, margin } =
//     req.body;
//   const openingRank = Math.floor(adv_cat_rank - adv_cat_rank * margin);
//   const closingRank = Math.ceil(
//     parseInt(adv_cat_rank) + parseInt(adv_cat_rank) * parseFloat(margin)
//   );

//   // res.redirect(`/college-predictor-results?gender=${gender}&category='${category}'&adv_gen_rank=${adv_gen_rank}&adv_cat_rank=${adv_cat_rank}&year=${year}&margin=${margin}`);
// });

app.get('/college', async (req, res) => {
  const str = `select institute_code,institute_name, state,IMG_SOURCE_LINK from \`ccms_finalised_tables - institute\` `;
  const results = await db.promise().query(str);
  // console.log(results[0][0].institute_code);
  res.render("college", { data: results[0] });
  // res.send(results[0]);
});


app.get('/college/:id', async (req, res) => {
  const ins_id = req.params.id
  console.log("Hello")
  console.log(ins_id);
  console.log(ins_id);
  const str1 = `select * from \`ccms_finalised_tables - institute\` where Institute_Code = ${ins_id}`;
  const str2 = `select * from \`ccms_finalised_tables - seat_matrix\` where Institute_Code = ${ins_id}`;
  const results1 = await db.promise().query(str1);
  // console.log(results1[0]);
  const results2 = await db.promise().query(str2);
  // console.log(results1[0]);
  // res.send("Hello");
  const jsonDatastr=JSON.stringify( { data1: results1[0], data2: results2[0] })
  const jsonData=JSON.parse(jsonDatastr)
  console.log(jsonData);
  res.render("college_info", {jsonData });
  // res.send(ins_id)
})
app.get("/prev", (req, res) => {
  const referer = req.get("referer");
  res.redirect(referer);
});

app.get("/next", (req, res) => {
  const referer = req.get("referer");
  res.redirect(referer);
});



app.get("/cutoff",async (req, res) => {
  const str = `select institute_code,institute_name from \`ccms_finalised_tables - institute\` `;
  const results = await db.promise().query(str);
  // console.log(results[0]);
  res.render("cutoff",{data:results[0]});
});
app.post("/cutoff", async(req, res) => {
  const { iit, category, year, gender } = req.body;
  res.redirect(`/college-cutoff-result?iit=${iit}&category=${category}&year=${year}&gender=${gender}&`);
});

app.get("/college-cutoff-result", async (req, res) => {
  const { iit, category, year, gender } = req.query;
  const jsonDatastr = JSON.stringify({ iit, category, year, gender });
  const jsonData=JSON.parse(jsonDatastr);
  const sqlqry = `SELECT Academic_program_name, ${category}_${gender}_OR, ${category}_${gender}_CR, Avg_branch_ctc, Seat_capacity FROM \`ccms_finalised_tables - or_cr_${year}\`
                  WHERE institute_code =${iit} `;
  const results = await db.promise().query(sqlqry);
  console.log(results[0]);
  res.render("college-cutoff-result", { jsonData, data:results[0] });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
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
