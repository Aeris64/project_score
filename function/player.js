// Import module
const path = require("path");

const nameFile = path.basename(__filename).split('.')[0];

// Import model
const Model = global.data.allModels.get(nameFile.toLowerCase());

exports.getAll = async function getAll(rqQuery){
    return new Promise((resolve, reject) => {
        const query = {};

        if(rqQuery) query.where = rqQuery;

        Model.findAll(query)
        .then(allResult => {
            const finalRes = [];
            for(const res of allResult){
                finalRes.push(res.dataValues);
            }

            return resolve(finalRes);
        }).catch(err => {
            console.log('error', err);
            return reject(err);
        });
    });
};

exports.createOne = async function createOne(newName){
    return new Promise((resolve, reject) => {
        Model.create(newName)
        .then(result => {
            return resolve(result.dataValues || {});
        }).catch(err => {
            console.log('error', err);
            return reject(err);
        });
    });
};

/*
exports.updateOne = async function updateOne(id, newUniverse){
    return new Promise((resolve, reject) => {
        Model.update(
            { name: newUniverse.name,
              deleted: newUniverse.deleted },
            { where: {idUniverse:id} })
        .then(result => {
            return resolve(result.dataValues || {});
        }).catch(err => {
            console.log('error', err);
            return reject(err);
        });
    });
};

/*
exports.getOneById = async function getOneById(id){
    return new Promise((resolve, reject) => {
        Model.findOne({
            where: {
                idUniverse:id,
                deleted: null
            }
        })
        .then(result => {
            return resolve(result);
        }).catch(err => {
            console.log('error', err);
            return reject(err);
        });
    });
};

exports.updateOne = async function updateOne(id, newUniverse){
    return new Promise((resolve, reject) => {
        Model.update(
            { name: newUniverse.name,
              deleted: newUniverse.deleted },
            { where: {idUniverse:id} })
        .then(result => {
            return resolve(result.dataValues || {});
        }).catch(err => {
            console.log('error', err);
            return reject(err);
        });
    });
};

exports.deleteOneById = async function deleteOneById(id){
    return new Promise((resolve, reject) => {
        Model.destroy({
            where: {
                idUniverse:id
            }
        })
        .then(result => {
            if(result) return resolve(`You have destroy sucessfully some ${nameFile}.. Good.. job?`);
            else return resolve(`${nameFile} not found...`);
        }).catch(err => {
            console.log('error', err);
            return reject(err);
        });
    });
};
*/