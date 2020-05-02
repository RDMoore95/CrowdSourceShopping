var mysql = require('mysql')

var con = mysql.createConnection({

    host: 'crowd-source-shopping.cyd6yg4g4qtf.us-east-2.rds.amazonaws.com',
    user: 'admin',
    port: '3306',
    password: 'RomanescoS2020',
    database: 'project',
});

con.connect(function(err) {
    if (err) {
        consolve.error('DB connection failed: ' + err.stack);
        return;
    }

    console.log("Connected Successfully");
});

module.exports = con;