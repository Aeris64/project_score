// Import module
const router = require('express').Router();
const error = require('../errors/notFound');
// const uuid = require('uuid/v4');
const path = require("path");

const nameFile = path.basename(__filename).split('.')[0];

// Import function
const Function = require(`../function/${nameFile}`);
const FunctionLevel = require(`../function/level`);
const FunctionPlayer = require(`../function/player`);

router.get('/', (req, res, next) => {
    Function.getAll()
        .then((result) => {
            return res.status(200).send(result);
        })
        .catch((err) => {
            let htmlError = new error.NotFoundError(err);
            return res.status(htmlError.status).send(htmlError);
        });
});

router.get('/player/:id', (req, res, next) => {
    const id = (isNaN(req.params.id) ? 0 : parseInt(req.params.id));
    const limit = (req.query.limit && (!isNaN(req.query.limit)) ? parseInt(req.query.limit) : 100);
    const offset = (req.query.offset && (!isNaN(req.query.offset)) ? parseInt(req.query.offset) : 0);

    const query = {
        limit,
        offset,
        where: {
            idPlayer: id
        }
    };

    Function.getAll(query)
        .then(async (result) => {
            let playerName = await FunctionPlayer.getAll({id: id});
            playerName = (playerName[0] ? playerName[0].name : '');

            for(const row of result) {
                let levelName = await FunctionLevel.getAll({id: row.idLevel});
                levelName = (levelName[0] ? levelName[0].name : '');

                row.playerName = playerName;
                row.levelName = levelName;
            }

            return res.status(200).send(result);
        })
        .catch((err) => {
            const htmlError = new error.NotFoundError(err);
            return res.status(htmlError.status).send(htmlError);
        });
});

router.get('/level/:id', (req, res, next) => {
    const id = (isNaN(req.params.id) ? 0 : parseInt(req.params.id));
    const limit = (req.query.limit && (!isNaN(req.query.limit)) ? parseInt(req.query.limit) : 100);
    const offset = (req.query.offset && (!isNaN(req.query.offset)) ? parseInt(req.query.offset) : 0);

    const query = {
        limit,
        offset,
        where: {
            idLevel: id
        },
        order: [
            ['time', 'ASC']
        ]
    };

    Function.getAll(query)
        .then(async (result) => {
            let levelName = await FunctionLevel.getAll({id: id});
            levelName = (levelName[0] ? levelName[0].name : '');

            for(const row of result) {
                let playerName = await FunctionPlayer.getAll({id: row.idPlayer});
                playerName = (playerName[0] ? playerName[0].name : '');

                row.levelName = levelName;
                row.playerName = playerName;
            }

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

router.get('/player/:id', (req, res, next) => {
    const id = req.params.id;

    const query = {
        idPlayer: id
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

router.get('/level/:id', (req, res, next) => {
    const id = req.params.id;

    const query = {
        idLevel: id
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
*/

module.exports = router;