const oracledb = require('oracledb');
require("dotenv").config();
oracledb.autoCommit = true;

class oracleDBService{
    constructor(connectionConfig){
        this.connectionConfig = connectionConfig;
    }

    //connection a la base de donnees
    async connect(){
        this.connection = await oracledb.getConnection(this.connectionConfig);
        console.log("Connection au database reussie.")
    }

    //methode pour tout les requetes envoyes vers la base de donnees
    async query(sql, bindParams = []){
        if(!this.connection){
            throw new Error("La connection n'est pas encore etablie, veuillez d'abord appelez connect().");
        }
        const options = {
            outFormat : oracledb.OUT_FORMAT_OBJECT,
        };
        const result = await this.connection.execute(sql, bindParams, options);

        return result.rows;
    }

    //deconnection de la base de donnees
    async disconnect(){
        if(this.connection){
            await this.connection.close();
            console.log("Deconnection de la base de donnees reussie.")
        }
        return
    }

    //pour appliquer les changement fait au db
    async commit(){
        if(this.connection){
            await this.connection.commit();
            console.log("Changement appliquer au db.")
        }
    }
}

module.exports = oracleDBService;