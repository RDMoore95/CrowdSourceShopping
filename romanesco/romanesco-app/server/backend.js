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

if(typeof(String.prototype.trim) === "undefined")
{
    String.prototype.trim = function() 
    {
        return String(this).replace(/^\s+|\s+$/g, '');
    };
}

const interval = function () {
    console.log("timer");
}

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

const addLocalStores = async (function (lat, long) {

    var q2 = `INSERT IGNORE INTO Store
                (store_name, store_lat, store_long, store_active_flag, store_street, store_city, store_state, store_zip)
            VALUES (?, ?, ?, ?, ?, ?,
                 (SELECT state_id FROM State
                     WHERE state_name = ?), ?);`

    var first_request = "https://maps.googleapis.com/maps/api/place/textsearch/json?query=grocery+stores&radius=8000&location="
    var zip_request = "https://maps.googleapis.com/maps/api/geocode/json?latlng="
    var subsequent_request = "https://maps.googleapis.com/maps/api/place/textsearch/json?pagetoken="
    var end_request = "&key=AIzaSyDQCwj-QWjaCb0oicA6xml3rnkw8o_O_X4"

    var full_request = first_request + lat + "," + long + end_request;

    console.log(full_request);

    const first_response = await (fetch(full_request));
    const first_json = await (first_response.json());

    response_jsons = [first_json];

    // if (first_json.hasOwnProperty("next_page_token")) {
    //     var second_response = await (fetch(subsequent_request+first_json.next_page_token+end_request));
    //     var second_json = await (second_response.json());
    //     console.log(second_json);
    //     response_jsons.push(second_json);
    // }

    // if (second_json.hasOwnProperty("next_page_token")) {
    //     var third_response = await (fetch(subsequent_request + second_json.next_page_token + end_request));
    //     var third_json = await (third_response.json());
    //     console.log(third_json);
    //     response_jsons.push(third_json);
    // }
    
    var name;
    var lat;
    var long;
    var active;
    var street;
    var city;
    var state;
    var zip;

    try {

        //console.log(response_jsons.length);
        for (var i = 0; i < response_jsons.length; i++) {

            //console.log(response_jsons[i]);

            for (var j = 0; j < response_jsons[i].results.length; j++) {
    
                name = response_jsons[i].results[j].name
    
                lat = response_jsons[i].results[j].geometry.location.lat;
    
                long = response_jsons[i].results[j].geometry.location.lng;
    
                if (response_jsons[i].results[j].business_status == 'OPERATIONAL') {
                    active = 1;
                } else {
                    active = 0;
                }
    
                street = response_jsons[i].results[j].formatted_address.split(",")[0]
        
                city = response_jsons[i].results[j].formatted_address.split(",")[1].trim()
        
                state = response_jsons[i].results[j].formatted_address.split(",")[2].split(" ")[1]
        
                zip = response_jsons[i].results[j].formatted_address.split(",")[2].split(" ")[2]
    
                if ([name,lat,long,active,street,city,state,zip].some(function(i) {
                    return i === null;
                })) {
                    continue;
                }

                    con.query(q2, [
                        name,
                        lat,
                        long,
                        active,
                        street,
                        city,
                        state,
                        zip
                    ], function(error, results) {
                        if (error) {
                            console.log(error);
                        }
                        else {
                            console.log(results);
                                }
                        });

            }    
        }
    
    } catch (e) {
        console.log(e);
    }       
});

app.post('/signUp', function(req, res) {

    var q = `SELECT user_id FROM User
                WHERE email = ?;`

    var q2 = `INSERT INTO User 
                (first_name, last_name, email, password, signup_date, zip_code)
            VALUES (?, ?, ?, ?, ?, ?);`
    
    var q3 = `SELECT user_id FROM User
                WHERE email = ?;`

    var q4 = `INSERT INTO User_Reputation
                (user_id, user_reputation, user_reputation_category_id, user_received_upvotes, user_received_downvotes, user_received_net, user_given_upvotes, user_given_downvotes, user_given_net)
            VALUES (?, 0, 1, 0, 0, 0, 0, 0, 0);`

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

                    console.log(hash.toString());
                    console.log(hash.toString().length);

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
                            con.query(q3, [
                                req.body.email
                            ], function(error, userResult) {

                                if (error) { 
                                    throw (error)
                                }

                                else {

                                    con.query(q4, [
                                        userResult[0].user_id
                                    ], function(error, finalResult) {

                                        if (error) {
                                            throw (error)
                                        }

                                        else {
                                            console.log(finalResult)
                                            addLocalStores(req.body.lat, req.body.long);
                                        }
                                    })

                                }

                            })
                        }
                    })
                })
            })
        } else {
            res.send([
                {error: "User Already Exists"}
            ]);
        }

    })


    
    
})

app.post('/signIn', function(req, res) {

    var q = `SELECT user_id, password 
             FROM User
             WHERE email = ?`

    var q2 = `UPDATE
    `
    con.query(q,
        [req.body.email
        ], function(error, results) {
            if (results == false) {
                console.log("incorrect login");
                results = [{

                    error: "Email or Password Incorrect"
                }]
                res.send(results);
            }

            else {

                console.log(results[0].password.toString());

                bcrypt.compare(req.body.password, results[0].password.toString(), function(err, result) {
                    if (err) {
                        console.log("compare error");
                        throw (err);
                    }

                    if (result == false) {
                        console.log("password incorrect");
                        res.send([{
                            error: "Email or Password Incorrect"
                        }])
                    }

                    else if (result == true) {
                        console.log(results);
                        res.send(results);
                        addLocalStores(req.body.lat, req.body.long);
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
