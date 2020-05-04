var express = require('express');
var app = express();
var mysql = require('mysql');
var bodyParser = require('body-parser');
var passport = require("passport");
var localStrat = require("passport-local").Strategy;
const bcrypt = require('bcryptjs');

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

passport.use(new localStrat(
    function(username, password, done) {
        User.f
    }
))

app.post('/signup', function(req, res) {

    var q = `INSERT INTO User 
                (first_name, last_name, email, password, signup_date, user_country)
            VALUES (?, ?, ?, NOW(), ?, 
                (SELECT country_id FROM Country
                 WHERE country_name = ?))`

    bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(req.body.password, salt, function(err, hash) {
            con.query(q,[
                req.body.first_name,
                req.body.last_name,
                req.body.email,
                hash,
                date,
                req.body.country_name
            ], function(error, results) {
                if (error) {
                    throw (error);
                }
        
                else {
                    res.send(results);
                }
            })
        })
    })
    
    
})

app.get('/login', function(req, res) {

    var q = `SELECT password 
             FROM User
             WHERE email = ?`

    con.query(q,
        [req.body.email
        ], function(error, results) {
            if (error) {
                throw (error);
            }

            else {
                bcrypt.compare(req.password, results.password, function(err, result) {
                    if (err) {
                        throw (err);
                    }

                    else {
                        res.send(result);
                    }
                })
            }
        })
})

app.get('/feedEntries', function(req, res) {
    var q = `SELECT first_name, last_name, store_name, store_feedback_category, time_added, store_feedback_text FROM 
    Store_Feedback 
    INNER JOIN Store ON Store_Feedback.store_id = Store.store_id 
    INNER JOIN Store_Feedback_Category 
        ON Store_Feedback.store_feedback_category_id = Store_Feedback_Category.store_feedback_category_id 
    INNER JOIN User 
        ON User.user_id = Store_Feedback.user_id
        ORDER BY time_added DESC;`

    con.query(q, function(error, results) {
        if (error) {
            throw (error);
        }

        else {
            res.send(results);
        }
    });
});

app.get('/profile', function(req, res) {

    var q = `SELECT * FROM (SELECT user_received_net, first_name, last_name from User 
             INNER JOIN User_Reputation ON User.user_id = User_Reputation.user_id) as NAME_REP 
             WHERE NAME_REP.first_name = "Ivory";`

             
    con.query(q, function(error, results) {
        if (error) {
            throw error;
        }

        else {
            res.send(results);
        }
    });
});
