const sqlite = require('sqlite3').verbose();

const db = new sqlite.Database('./quote.db', sqlite.OPEN_READWRITE, (err) => {
    if (err) return console.error(err)
})

const sql = `CREATE TABLE quote(ID INTEGER PRIMARY KEY,name,price)`

db.run(sql)