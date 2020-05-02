var express = require('express');
var app = express();
var mysql = require('mysql');
var bodyParser = require('body-parser');

app.use(bodyParser.json({type:'application/json'}));
app.use(bodyParser.urlencoded({extended:true}));

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

var server = app.listen(4545, function() {
    var host = server.address().address;
    var port = server.address().port;
});

app.get('/profile', function(req, res) {

    var q = `SELECT * FROM (SELECT user_received_net, first_name, last_name from User 
             INNER JOIN User_Reputation ON User.user_id = User_Reputation.user_id) as NAME_REP 
             WHERE NAME_REP.first_name = "Adam";`

             
    con.query(q, function(error, results) {
        if (error) {
            throw error;
        }

        else {
            res.send(results);
        }
    });
});
