const express = require('express');
const cors = require('cors');
const database = require('./config/database');
const routes = require('./routes/mainRoute')
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());
const port = process.env.PORT;
routes(app)
database()


app.get('/', (req, res) => {
  return res.send('Server is running');
});

app.listen(port, () => console.log(`Server running on port ${port}`));
