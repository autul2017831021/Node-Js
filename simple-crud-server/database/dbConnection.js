const mysql = require('mysql')
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "webtech"
})    
db.connect(function(err) {
    if (err) throw err
    console.log("Database Connected");
});
module.exports = {
    db
}