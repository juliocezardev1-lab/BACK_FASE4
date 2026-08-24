const sqlite3 = require("sqlite3");
const path = require("path");
const { serialize } = require("v8");

const dbPath = path.join(__dirname, "../DATA/database.db");

const db = new sqlite3.Database(dbPath, (erro)=>{
    if(erro){
        console.error("Erro ao abrir banco", erro)
    }else{
        console.log("Banco de datdos aberto com sucesso.")
    }
});

db.serialize(() =>{
    db.run(`
        CREATE TABLE IF NOT EXISTS dados(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT,
        valor TEXT,
        criado_em DATETIME DEFAULT CURRETN_TIMESTAMP
        )
        `)
});

module.exports = db;