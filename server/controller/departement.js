const oracleDBService = require('../connection/oracledb');
const { v4 } = require('uuid');

require("dotenv").config();

const connectionConfig = {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    connectString: `localhost:1521/free`,
};

const oracleDb = new oracleDBService(connectionConfig);

const getDeps = async (req, res) => {
    try {
        await oracleDb.connect();

        //prepare the select query for the db
        const select = `SELECT * FROM departement`;
        const selectResult = await oracleDb.query(select);
        return res.send(selectResult);
    } catch (error) {
        return res.send(error);
    } finally{
        await oracleDb.disconnect();
    }
}

const insertDeps = async (req, res) => {
    try {
        await oracleDb.connect();

        //prepare the insert query for the db
        const insert = `INSERT INTO departement(idDep, departement) VALUES(:id, :departement)`;
        const insertParams = {
            id: v4(),
            departement: req.body.departement
        };
        await oracleDb.query(insert, insertParams);

        return  res.json({
            message: "Insertion reussie",
            data: "succes"
        });
    } catch (err) {
        return res.send(res);
    } finally{
        await oracleDb.disconnect();
    }
}

const deleteDeps = async (req, res) => {
    try {
        await oracleDb.connect();

        const deleteQuery = `DELETE FROM departement WHERE idDep = ${req.params.id}`;
        return  res.json({
            message: "Suppression reussie",
            data: "succes"
        });
    } catch (error) {
        return res.send(error);
    } finally{
        await oracleDb.disconnect();
    }
}

module.exports = {
    getDeps,
    insertDeps,
    deleteDeps
}