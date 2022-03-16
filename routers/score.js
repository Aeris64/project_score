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
const { time } = require('console');

router.get('/', (req, res, next) => {
    Function.getAll()
        .then((result) => {
            return res.status(200).send({
                code: 200,
                data: result
            });
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
            let playerName = await FunctionPlayer.getAll({where: {id: id}});
            playerName = (playerName[0] ? playerName[0].name : '');

            for(const row of result) {
                let levelName = await FunctionLevel.getAll({id: row.idLevel});
                levelName = (levelName[0] ? levelName[0].name : '');

                row.playerName = playerName;
                row.levelName = levelName;
            }

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

            let i = 1;
            for(const row of result) {
                let playerName = await FunctionPlayer.getAll({where: {id: row.idPlayer}});
                playerName = (playerName[0] ? playerName[0].name : '');

                row.levelName = levelName;
                row.playerName = playerName;
                
                const minutes = Math.trunc(row.time / 6000);
                const secondes = Math.trunc((row.time - (minutes * 6000)) / 100);
                const centi = Math.trunc(row.time - (minutes * 6000) - (secondes * 100));
                const finalTime = (minutes < 10 ? '0' : '') + minutes + ':' + (secondes < 10 ? '0' : '') + secondes + ':' + (centi < 10 ? '0' : '') + centi;

                row.digitTime = finalTime;

                row.position = i + '/' + result.length;
                i++;
            }

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

router.get('/level/:id/stats', (req, res, next) => {
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
            const finalRes = {
                level: {
                    id: null,
                    name: null
                },
                time: {
                    average: null,
                    total: 0,
                    less: {
                        playerId: 0,
                        playerName: null,
                        playerTime: Infinity
                    },
                    big: {
                        playerId: 0,
                        playerName: null,
                        playerTime: -Infinity
                    }
                },
                death: {
                    average: null,
                    total: 0,
                    less: {
                        playerId: 0,
                        playerName: null,
                        count: Infinity
                    },
                    big: {
                        playerId: 0,
                        playerName: null,
                        count: -Infinity
                    }
                }
            }
            finalRes.level.name = await FunctionLevel.getAll({id: id});
            finalRes.level.name = (finalRes.level.name[0] ? finalRes.level.name[0].name : '');
            finalRes.level.id = id;

            for(const row of result) {
                let playerName = await FunctionPlayer.getAll({where: {id: row.idPlayer}});
                playerName = (playerName[0] ? playerName[0].name : '');

                if(row.time > finalRes.time.big.playerTime) {
                    finalRes.time.big.playerTime = row.time;
                    finalRes.time.big.playerName = playerName;
                    finalRes.time.big.playerId = row.idPlayer;
                }
                if(row.time < finalRes.time.less.playerTime) {
                    finalRes.time.less.playerTime = row.time;
                    finalRes.time.less.playerName = playerName;
                    finalRes.time.less.playerId = row.idPlayer;
                }

                finalRes.time.total += row.time;

                if(row.death > finalRes.death.big.count) {
                    finalRes.death.big.count = row.death;
                    finalRes.death.big.playerName = playerName;
                    finalRes.death.big.playerId = row.idPlayer;
                }
                if(row.death < finalRes.death.less.count) {
                    finalRes.death.less.count = row.death;
                    finalRes.death.less.playerName = playerName;
                    finalRes.death.less.playerId = row.idPlayer;
                }

                finalRes.death.total += row.death;                
            }

            finalRes.time.average = TimeToDigit((finalRes.time.total / result.length));
            finalRes.time.big.playerTime = TimeToDigit(finalRes.time.big.playerTime);
            finalRes.time.less.playerTime = TimeToDigit(finalRes.time.less.playerTime);
            finalRes.time.total = TimeToDigit(finalRes.time.total);
            
            finalRes.death.average = Math.round((finalRes.death.total / result.length) * 100) / 100;

            return res.status(200).send({
                code: 200,
                data: finalRes
            });
        })
        .catch((err) => {
            const htmlError = new error.NotFoundError(err);
            return res.status(htmlError.status).send(htmlError);
        });
});

router.post('/', (req, res, next) => {
    const body = req.body;

    if(!(body && body.idLevel && body.idPlayer && body.time && body.time > 0)) return res.status(400).send('Bad body request');

    const query = {
        where: {
            idPlayer: body.idPlayer,
            idLevel: body.idLevel
        }
    }

    const score = {
        idPlayer: body.idPlayer,
        idLevel: body.idLevel,
        time: body.time,
        death: body.death
    }

    Function.upsert(query, score)
        .then((result) => {
            return res.status(200).send({
                code: 200,
                data: result
            });
        })
        .catch((err) => {
            let htmlError = new error.NotFoundError(err);
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

function TimeToDigit(time) {
    const minutes = Math.trunc(time / 6000);
    const secondes = Math.trunc((time - (minutes * 6000)) / 100);
    const centi = Math.trunc(time - (minutes * 6000) - (secondes * 100));

    return (minutes < 10 ? '0' : '') + minutes + ':' + (secondes < 10 ? '0' : '') + secondes + ':' + (centi < 10 ? '0' : '') + centi;
}

module.exports = router;