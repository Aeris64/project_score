// Set globale variable
global.data = {};
global.data.allModels = (global.data.allModels !== undefined ? global.data.allModels : new Map);

// Import module
const express = require('express');
const jsonfile = require('jsonfile');
const bodyParser = require('body-parser');
const error = require('./errors/notFound');

// Import config
const config = jsonfile.readFileSync('config.json');

// Set sequelize connection
global.data.sequelizeConnection = require('./login/loginBDD').login;

const dbSchema = require('./model/admin');
async function syncConnexion() {
    await dbSchema.updateSchema();
    const router = require('./router');
    app.use('/', router);
}
syncConnexion();

const port = config.port;

const app = express();
app.use(bodyParser.json({ type: 'application/*+json' }));
app.use(express.json());

app.get('/', function(req, res) {
    res.send('Hello World!, API is ready for u !')
})

app.use((err, req, res, next) => {
    console.log(err)
    res.status(500)
    res.send('server error')
})

app.listen(port, '0.0.0.0', function () {
    console.log(`Example app started on : ${port} port.`);
})