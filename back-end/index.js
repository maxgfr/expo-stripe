const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const app = express();
const port = 3000

app.use(cors());
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

app.get('/', (req, res, next) => {
  res.json({success: true});
})

app.listen(port, () => console.log(`The application is listening on port ${port}!`))
