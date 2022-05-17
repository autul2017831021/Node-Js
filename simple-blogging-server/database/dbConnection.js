// const mysql = require('mysql')
// const db = mysql.createConnection({
//     host: "localhost",
//     user: "root",
//     password: "",
//     database: "test"
// })    
// db.connect(function(err) {
//     if (err) throw err
//     console.log("Database Connected");
// });

const {MongoClient} = require('mongodb')
const url = "mongodb://localhost:27017"
const db = new MongoClient(url);
db.connect(function(err) {
    if (err){
        throw err
    }
    else{
        console.log("Database Connected")
    }
    
});

module.exports = {
    db
}