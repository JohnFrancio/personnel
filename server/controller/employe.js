const oracleDBService = require('../connection/oracledb');
const { v4 } = require('uuid');
const bcrypt = require('bcrypt');

require("dotenv").config();

const connectionConfig = {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    connectString: `localhost:1521/free`,
};

const oracleDb = new oracleDBService(connectionConfig);

const getEmploye = async (req, res) => {
    try {
        await oracleDb.connect();

        const select = `SELECT * FROM employe INNER JOIN departement ON employe.idDep = departement.idDep`;
        const selectResult = await oracleDb.query(select);
        return res.send(selectResult);
    } catch (error) {
        return res.send(error);
    } finally {
        await oracleDb.disconnect();
    }
}

const authEmploye = async (req, res) => {
    try{
        //connection a la base
        await oracleDb.connect();

        //requete select a la base
        const select =  `SELECT * FROM employe WHERE nom LIKE '%${req.body.nom}%'`;
        const selectResult = await oracleDb.query(select);

        //gerer l'authentification
        if(selectResult.length == 1){
            const verify = await bcrypt.compare(req.body.password, selectResult[0].PWD)
            if(verify){
                return res.json({
                    state: "Succes",
                    data: selectResult
                });
            }else{
                return res.send("Nom d'utilisateur ou mot de passe invalide.")
            }
        }else{
            return res.send("L'utilisateur n'existe pas.")
        }
    }catch(err){
        return res.send(err);
    } finally{
        await oracleDb.disconnect();
    }
};

const insertEmploye = async (req, res) => {
    try {
        await oracleDb.connect();
        
        //generer salt pour l'ajouter sur le mot de passe crypte
        const salt = await bcrypt.genSalt();
        const mdp_Employe = await bcrypt.hash(req.body.password, salt);

        //prepare the insert query for the db
        const insert = `INSERT INTO employe(idEmploye, nom, pwd, typeEmploye, idDep) VALUES(:id, :nom, :pwd,
            :typeemploye, :idDep)`;
        const insertParams = {
            id: v4(),
            nom: req.body.nom,
            pwd: mdp_Employe,
            typeemploye: req.body.type,
            idDep: req.body.dep
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

const udpateEmploye = async (req, res) => {
    try {
        await oracleDb.connect();

        //prepare the update query 
        const update = `UPDATE employe SET nom = :nom WHERE idEmploye = '${req.params.id}'`;
        const updateParams = {
            content: req.body.content,
            status: req.body.status
        }
        await oracleDb.query(update, updateParams);

        return res.json({
            message: "Modification reussie",
            data: "succes"
        });;
    } catch (err) {
        return res.send(err);
    } finally{
        await oracleDb.disconnect();
    }
}

const deleteEmploye = async (req, res) => {
    try {
        await oracleDb.connect();

        //delete query 
        const idToDel = req.params.id;
        const del = 'DELETE FROM employe WHERE idEmploye = :id';
        delParams = {
            id: idToDel
        }
        await oracleDb.query(del, delParams);
        
        return  res.json({
            message: "Suppression reussie",
            data: "succes"
        });
    } catch (err) {
        return res.send(err);
    } finally{
        await oracleDb.disconnect();
    }
}

module.exports = {
    getEmploye,
    authEmploye,
    insertEmploye,
    udpateEmploye,
    deleteEmploye
};