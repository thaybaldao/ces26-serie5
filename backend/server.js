const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 5000;

// enable CORS
app.use(cors());


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/api/hello', (req, res) => {
  res.send('Hello From Express');
});

var fs = require('fs');
var file = "data.json";

app.post("/submit", async (req, res) => {
  try {
    var obj = req.body;
    fs.readFile(file, (err, data) => {
      if (err && err.code === "ENOENT") {
          // the file might not yet exist.  If so, just write the object and bail
          return fs.writeFile(file, JSON.stringify([obj]), error => console.error);
      } else if (err) { // handle error
          console.error(err);
      } else { // otherwise, get the file's JSON content
          try {
              const fileData = JSON.parse(data);
              fileData.push(obj); // append the object you want

              // write the file back out
              return fs.writeFile(file, JSON.stringify(fileData), error => console.error)
          } catch(exception) {
              console.error(exception);
          }
      }
  });
    res.status(200).json(req.body);
  } catch (err) {
    console.error(err.message);
  }
});

app.get("/submissions", async (req, res) => {
  try {
    fs.readFile(file, (err, data) => {
      if (err) { // handle error
        res.status(400).json({
          error: true,
          message: "There are no form submissions."
        });
      }
      res.status(200).json(JSON.parse(data));
    });
  } catch (err) {
    console.error(err.message);
  }
});

app.listen(port, () => console.log(`Listening on port ${port}`));
