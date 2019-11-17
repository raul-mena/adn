const express = require('express');
const adnRoutes = require('./routes/adn');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

require('dotenv').config();
const mongoUrl = process.env.MONGODB_URI || 'mongodb://localhost:27017/adn';
mongoose.connect(mongoUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

//declare express app
const app = express();
// ================= Configuracion de permisos de acceso  =================
app.use(cors());
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }))
    // parse application/json
app.use(bodyParser.json({ limit: '10mb', extended: true }))
    //adding declared routes
app.use('/api', adnRoutes);

//set default port
const PORT = process.env.PORT || 3000;
//start app
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`)
});

module.exports = app;