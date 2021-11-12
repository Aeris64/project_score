// Import module
const router = require('express').Router();
const error = require('../errors/notFound');
// const uuid = require('uuid/v4');
const path = require("path");

const nameFile = path.basename(__filename).split('.')[0];

// Import function
const Function = require(`../function/${nameFile}`);

router.get('/', (req, res, next) => {
    Function.getAll()
        .then((result) => {
            return res.status(200).send(result);
        })
        .catch((err) => {
            const htmlError = new error.NotFoundError(err);
            return res.status(htmlError.status).send(htmlError);
        });
});

router.get('/:id', (req, res, next) => {
    const id = (isNaN(req.params.id) ? 0 : parseInt(req.params.id));

    const query = {
        id: id
    };

    Function.getAll(query)
        .then((result) => {
            return res.status(200).send(result);
        })
        .catch((err) => {
            const htmlError = new error.NotFoundError(err);
            return res.status(htmlError.status).send(htmlError);
        });
});

/*

router.post('/', (req, res, next) => {  
    let myAuth = new error.KeyAuthentification(req.query.key);
    if(!myAuth.authentification()) return res.status(401).send(new error.BadRequestError('Bad API Key'));

    try{
        req.body = JSON.parse(Object.keys(req.body)[0]);
    } catch(err) {
        req.body = req.body;
    }
    let id = req.body.id;
    let date = new Date().toJSON().slice(0, 10);

    let universe = {
        idUniverse: uuid(),
        name: req.body.name,
        createdAt: date,
        deleted: null
    };

    Function.createOne(universe)
        .then((result) => {
            let belongs = {
                idRights : 1,
                id: id,
                idUniverse: result.idUniverse
            };
        
            belongsFunction.createOne(belongs)
                .then((result) => {
                    return res.status(200).send(result);
                })
                .catch((err) => {
                    let htmlError = new error.NotFoundError(err);
            return res.status(htmlError.status).send(htmlError);
                });
        })
        .catch((err) => {
            let htmlError = new error.NotFoundError(err);
            return res.status(htmlError.status).send(htmlError);
        });
});

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