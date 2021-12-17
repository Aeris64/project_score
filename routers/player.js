// Import module
const router = require('express').Router();
const error = require('../errors/notFound');
// const uuid = require('uuid/v4');
const path = require("path");
const { isSet } = require('util/types');

const nameFile = path.basename(__filename).split('.')[0];

// Import function
const Function = require(`../function/${nameFile}`);

router.get('/', (req, res, next) => {
    Function.getAll()
        .then((result) => {
            return res.status(200).send({
                code: 200,
                data: result
            });
        })
        .catch((err) => {
            const htmlError = new error.NotFoundError(err);
            return res.status(htmlError.status).send(htmlError);
        });
});

router.get('/:id', (req, res, next) => {
    const id = (isNaN(req.params.id) ? 0 : parseInt(req.params.id));

    const query = {
        where: {
            id: id
        }
    };

    Function.getAll(query)
        .then((result) => {
            return res.status(200).send({
                code: 200,
                data: result
            });
        })
        .catch((err) => {
            const htmlError = new error.NotFoundError(err);
            return res.status(htmlError.status).send(htmlError);
        });
});

router.get('/name/:name', (req, res, next) => {
    const name = req.params.name;

    if(!(name)) return res.status(400).send('Bad param request');

    const query = {
        attributes: ['id'],
        where: {
            name: name
        }
    };

    Function.getAll(query)
        .then((result) => {
            return res.status(200).send({
                code: 200,
                data: result
            });
        })
        .catch((err) => {
            const htmlError = new error.NotFoundError(err);
            return res.status(htmlError.status).send(htmlError);
        });
});

router.post('/', (req, res, next) => {
    const body = req.body;

    if(!(body && body.name)) return res.status(400).send('Bad body request');

    const player = {
        name: body.name
    }

    Function.createOne(player)
        .then((result) => {
            return res.status(200).send(result);
        })
        .catch((err) => {
            let htmlError = new error.NotFoundError(err);
            return res.status(htmlError.status).send(htmlError);
        });
});

/*
router.put('/:id', async (req, res, next) => {
    let myAuth = new error.KeyAuthentification(req.query.key);
    if(!myAuth.authentification()) return res.status(401).send(new error.BadRequestError('Bad API Key'));

    let id = req.params.id;

    try{
        req.body = JSON.parse(Object.keys(req.body)[0])
    } catch(err) {
        req.body = req.body
    }
    let date = null;
    if(req.body.deleted){
        date = new Date().toJSON().slice(0, 10);
    }
    let universe = {
        name: req.body.name,
        deleted: date || null
    };

    await Function.getOneById(id)
        .then((result) => {
            if(!universe.name) universe.name = result.name;
            if(!universe.deleted) universe.deleted = result.deleted;
        })
        .catch((err) => {
            let htmlError = new error.NotFoundError(err);
            return res.status(htmlError.status).send(htmlError);
        });

    Function.updateOne(id, universe)
        .then((result) => {
            return res.status(200).send(result);
        })
        .catch((err) => {
            let htmlError = new error.NotFoundError(err);
            return res.status(htmlError.status).send(htmlError);
        });
});

router.delete('/:id', (req, res, next) => {
    let myAuth = new error.KeyAuthentification(req.query.key);
    if(!myAuth.authentification()) return res.status(401).send(new error.BadRequestError('Bad API Key'));
    
    let id = req.params.id;

    Function.deleteOneById(id)
        .then((result) => {
            return res.status(200).send(result);
        })
        .catch((err) => {
            let htmlError = new error.NotFoundError(err);
            return res.status(htmlError.status).send(htmlError);
        });
});
*/

module.exports = router;