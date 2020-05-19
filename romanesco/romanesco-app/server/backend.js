var express = require('express');
var app = express();
var mysql = require('mysql');
var bodyParser = require('body-parser');
var cors = require('cors');
var jwt = require("jsonwebtoken");
const bcrypt = require('bcryptjs');
const fetch = require("node-fetch");
const async = require('asyncawait/async');
const await = require('asyncawait/await');
const authToken = require('crypto');


app.use(bodyParser.json({type:'application/json'}));
app.use(cors());
app.use(bodyParser.urlencoded({extended:true}));

// var Users = require("./routes/User");

// app.use("/users", Users);

process.env.SECRET_KEY = "top_sekret";

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

app.get('/storeDetails', function(req, res) {


    var q = `SELECT first_name, last_name, store_name, store_feedback_category, time_added, store_feedback_text FROM 
                Store_Feedback 
                INNER JOIN Store ON Store_Feedback.store_id = Store.store_id 
                INNER JOIN Store_Feedback_Category 
                    ON Store_Feedback.store_feedback_category_id = Store_Feedback_Category.store_feedback_category_id 
                INNER JOIN User 
                    ON User.user_id = Store_Feedback.user_id
                    WHERE Store.store_id = ?
                        AND User.user_id != ?
                    ORDER BY time_added DESC;`

    con.query(q, function(error, results) {

        if (error) {
            throw(error);
        }

        else {
            res.send(results);
        }
    })

})

app.get('/map', function(req, res) {

    var q = `SELECT store_id, store_name, store_street, store_city, state_name, store_zip, store_lat, store_long
             FROM Store
                INNER JOIN State
                ON Store.store_state = State.state_id;`

    con.query(q, function(error, results) {

        if (error) {
            throw (error);
        }

        else {
            res.send(results);
        }
    })

})

app.get('/mapLatLongUpdate', function(req, res) {

    var q = `SELECT store_name, store_street, store_city, state_name, store_zip 
             FROM Store
                INNER JOIN State
                ON Store.store_state = State.state_id;`

    var q2 = `UPDATE Store
                SET store_lat = ?, store_long = ?
                WHERE store_street = ?;`

    var request1 = "https://maps.googleapis.com/maps/api/geocode/json?address="
    var request2 = "&key=AIzaSyDQCwj-QWjaCb0oicA6xml3rnkw8o_O_X4"
    var responses = [];
    completed_requests = 0;

    con.query(q, (async (function(error, results) {

        for (element in results) {
            try {
                const response = await (fetch(request1+results[element].store_street.replace(/ /g, "+")+","+results[element].store_city.replace(" ", "+")+","+(results[element].state_name+request2)))
                const json = await (response.json());
                obj = {
                    "store_name": results[element].store_name,
                    "store_street": results[element].store_street,
                    "store_city": results[element].store_city,
                    "state_name": results[element].state_name,
                    "store_zip": results[element].store_zip,
                    "store_lat": json.results[0].geometry.location.lat,
                    "store_long": json.results[0].geometry.location.lng
                    };
                responses.push(obj);
                completed_requests++;
                // con.query(q2,
                //     [json.results[0].geometry.location.lat,
                //      json.results[0].geometry.location.lng,
                //      results[element].store_street], 
                //         function(er, results) {
                //          if (er) {
                //              throw(er);
                //          }
                //      })
            }
            catch (e) {
                console.log(e);
                console.log(results[element]);
            }
            if ((completed_requests+1) == results.length) {
                res.send(responses);
            }
        }

        if (error) {
            throw (error);
        }
    })
))});

app.post('/signUp', function(req, res) {

    var q = `SELECT user_id FROM User
                WHERE email = ?;`

    var q2 = `INSERT INTO User 
                (first_name, last_name, email, password, signup_date, zip_code)
            VALUES (?, ?, ?, ?, ?, ?);`

    var date  = new Date().toJSON().slice(0, 10);

    con.query(q, [
            req.body.email        
            ], function(error, results) {

        if (error) {
            throw(error);
        }

        else if (results == false) {
            bcrypt.genSalt(10, function(err, salt) {
                bcrypt.hash(req.body.password, salt, function(err, hash) {
                    con.query(q2,[
                        req.body.first_name,
                        req.body.last_name,
                        req.body.email,
                        hash.toString(),
                        date,
                        req.body.zip_code
                    ], function(error, results) {
                        if (error) {
                            throw (error);
                        }
                
                        else {
                            console.log(results);
                        }
                    })
                })
            })
        } else {
            res.json({ error: "User already exists" });
        }

    })


    
    
})

app.get('/signIn', function(req, res) {

    var q = `SELECT password 
             FROM User
             WHERE email = ?`

    var q2 = `UPDATE
    `

    con.query(q,
        [req.body.email
        ], function(error, results) {
            if (error) {
                throw (error);
            }

            else {
                bcrypt.compare(req.body.password, results.password, function(err, result) {
                    if (err) {
                        res.send("USER DOES NOT EXIST");
                        throw (err);
                    }

                    else {
                        res.send(result);
                        // if (result) {
                        //     con.query()
                        // }
                    }
                })
            }
        })
})

app.get('/userAuth', function(req, res) {

    var q = `SELECT * FROM User
                WHERE auth_token = ?;`

    con.query(q, [
        req.body.authToken
    ], function(error, results) {
        if (error) {
            throw (error);
        }
        else {
            res.send(results);
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
        ORDER BY time_added DESC
        LIMIT 30;`

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
