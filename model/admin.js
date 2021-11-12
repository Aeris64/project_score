// Import module
const { Sequelize, DataTypes } = require('sequelize');
const jsonfile = require('jsonfile');

const sequelizeConnection = global.data.sequelizeConnection;

exports.updateSchema = async function updateSchema() {
    return new Promise(async (resolve, reject) => {
        const dbSchemaFile = {};
        dbSchemaFile.tables = [];
        const pathFile = 'dbSchema.json';

        await sequelizeConnection.query('SHOW TABLES', {
            type: sequelizeConnection.QueryTypes.SELECT
        })
            .then(async result => {
                for (let i = 0; i < result.length; i++) {
                    const tempTable = {};
                    tempTable.name = result[i]['Tables_in_' + global.data.dbName];

                    const promise = sequelizeConnection.query(`SHOW COLUMNS FROM ${tempTable.name}`, {
                        type: sequelizeConnection.QueryTypes.SELECT
                    });

                    tempTable.fields = await promise.then(res => {

                        let allFields = [];
                        for (let i = 0; i < res.length; i++) {
                            const fieldName = res[i].Field;
                            let fieldType = res[i].Type;
                            const fieldNull = res[i].Null;
                            const fieldKey = res[i].Key;
                            const fieldExtra = res[i].Extra;
                            let fieldRange = (fieldType.indexOf('(') !== -1 ? fieldType.split('(')[1].replace(')', '') : (fieldType.indexOf('text') !== -1 ? 255 : undefined));
                            fieldRange = (isNaN(fieldRange) ? 30 : parseInt(fieldRange));

                            if (fieldType.includes('int')) fieldType = 'INTEGER';
                            else fieldType = 'STRING';

                            allFields.push({
                                name: fieldName,
                                type: fieldType,
                                range: fieldRange,
                                null: (fieldNull == 'YES' ? true : false),
                                primary: (fieldKey == 'PRI' ? true : false),
                                autoInc: (fieldExtra.includes('auto_increment') ? true : false)
                            });
                        }
                        return allFields;

                    }).catch(err => {
                        console.log(err);
                        return [];
                    })

                    dbSchemaFile.tables.push(tempTable);
                }
            })
        jsonfile.writeFileSync(pathFile, dbSchemaFile);

        const allDbSchemaFile = (global.data.dbSchemaFile !== undefined ? global.data.dbSchemaFile : new Map());

        const dbSchemaFileTable = dbSchemaFile.tables;

        for (let i = 0; i < dbSchemaFileTable.length; i++) {
            const tableName = dbSchemaFileTable[i].name;
            const fields = dbSchemaFileTable[i].fields;

            const allFields = {};
            for (let k = 0; k < fields.length; k++) {
                const fieldName = fields[k].name;
                const fieldType = fields[k].type;
                const fieldNull = fields[k].null;
                const fieldPrimary = fields[k].primary;
                const fieldAutoInc = fields[k].autoInc;
                const fieldRange = fields[k].range;

                allFields[fieldName] = {
                    type: DataTypes[fieldType](fieldRange),
                    allowNull: fieldNull,
                    primaryKey: fieldPrimary,
                    autoIncrement: fieldAutoInc
                }
            }

            const tempModel = {
                tableName: tableName,
                allFields: allFields,
                option: {
                    timestamps: false,
                    freezeTableName: true
                }
            }

            allDbSchemaFile.set(tableName, tempModel);
        }

        const allPromise = [];
        allDbSchemaFile.forEach((values, keys) => {
            if (!global.data.allModels.has(keys)) {
                const Model = sequelizeConnection.define(values.tableName, values.allFields, values.option);
                if(!values.allFieldsid) Model.removeAttribute('id');

                allPromise.push(Model.sync()
                    .then(function (arg) {
                        console.log(`Sync ${values.tableName} ok...`);
                        global.data.allModels.set(values.tableName, Model);
                    }).catch(err => {
                        console.log('error', err);
                        Promise.reject(`Err in ${values.tableName}`, err);
                    })
                )
            }
        })

        Promise.all(allPromise)
            .then(result => {
                resolve('Good');
            })
            .catch(err => {
                reject(err);
            })
    })
}