const express = require('express')
const bodyParser = require(body-parser)
const cors = require('cors')
const sequelize = require('./models/database')

const app = express();
app.use(cors())
app.use(bodyParser.json());

//connect to SqLite
sequelize.sync();

//Routes
app.use('/api', require('./routes/api'));

//start the server
const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})

