// Import module
const path = require("path");

const nameFile = path.basename(__filename).split('.')[0];

// Import model
const Model = global.data.allModels.get(nameFile.toLowerCase());

exports.getAll = async function getAll(rqQuery){
    return new Promise((resolve, reject) => {
        Model.findAll(rqQuery)
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

exports.upsert = async function upsert(query, values){
    return new Promise((resolve, reject) => {
        Model.findOne(query)
        .then(async result => {
            if(result) {
                console.log('here', result)
                return resolve(result);
            }
            //  return resolve(await result.update(values).then(finalRes => {return finalRes}));

            return resolve(await Model.create(values).then(finalRes => {return finalRes}));
        }).catch(err => {
            console.log('error', err);
            return reject(err);
        });
    });

    
    return Model
        .findOne({ where: condition })
        .then(function(obj) {
            // update
            if(obj)
                return obj.update(values);
            // insert
            return Model.create(values);
        })
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

exports.createOne = async function createOne(newUniverse){
    return new Promise((resolve, reject) => {
        Model.create(newUniverse)
        .then(result => {
            return resolve(result.dataValues || {});
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