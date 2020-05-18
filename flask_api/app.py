from flask import Flask
from flask_restful import Resource, Api
from flask_cors import CORS, cross_origin
from flask import jsonify
from flask import request

import sys
from sqlalchemy import create_engine
import pymysql
import pandas as pd

app = Flask(__name__)

# Get MySQL credentials
# exec(open("/Users/walkerag/Documents/osu/cs467/project_paths.py").read())
exec(open("./project_paths.py").read())

# DB connection
db_connection = create_engine(db_connection_str)

# Get a user's favorite stores
def pullFavoriteStores(user_id):

	print("Running Pull Top Stores")
	print(user_id)

	# Get recent price feedback the user has not already responded to
	query = '''
	    SELECT DISTINCT 
	    s.store_id
	    , s.store_name
	    , s.store_street
	    , s.store_city
	    , s.store_zip
	    , DATEDIFF(CURDATE(), sf.time_added) as days_since_last_feedback
	    FROM Store_Feedback sf
	    INNER JOIN Store s
	    ON sf.store_id = s.store_id
	    WHERE sf.user_id = {user}
	    GROUP BY 1, 2, 3, 4, 5
	    ORDER BY sf.time_added DESC
	    LIMIT 10
	    '''
	query_fmt = query.format(user = user_id)
	print(query_fmt)
	result = pd.read_sql(query_fmt, con=db_connection)
	print(result)

	# Add an ID
	result['id'] = result.index.astype(str)

	# Format store names
	result['store_name_fmt'] = result['store_name'].str.replace('[^a-zA-Z]', '').str.lower()	

	result_json = result.to_json(orient = 'records')
	print(result_json)
	return result_json


# Pull top stores
def pullTopStores(userid):

	print("Running Pull Top Stores")

	# Get recent price feedback the user has not already responded to
	query = '''
	    SELECT
	    s.store_id
	    , s.store_name
	    , s.store_street
	    , s.store_city
	    , s.store_zip
	    , SUM(1) as total_feedback
	    , COUNT(DISTINCT sf.user_id) as shoppers
	    FROM Store_Feedback sf
	    INNER JOIN Store s
	    ON sf.store_id = s.store_id
	    WHERE DATEDIFF(CURDATE(), sf.time_added) <= 30
	    GROUP BY 1, 2, 3, 4, 5
	    ORDER BY total_feedback DESC
	    LIMIT 100
	    '''

	result = pd.read_sql(query, con=db_connection)
	print(result)

	# Add an ID
	result['id'] = result.index.astype(str)

	# Format store names
	result['store_name_fmt'] = result['store_name'].str.replace('[^a-zA-Z]', '').str.lower()

	result_json = result.to_json(orient = 'records')
	print(result_json)
	return result_json


def pullFeedEntries(id_type, id):

	print(id_type)

	if id_type == 'all':

		query = '''
	        SELECT 
	        u.first_name
	        , u.last_name
	        , Store.store_name
	        , Store_Feedback_Category.store_feedback_category
	        , CAST(Store_Feedback.time_added as char) as time_added
	        , Store_Feedback.store_feedback_text
	        , u.user_id
	        , ur.user_reputation_category_id
	    	FROM Store_Feedback 
	    	INNER JOIN Store ON Store_Feedback.store_id = Store.store_id 
	    	INNER JOIN Store_Feedback_Category 
	        ON Store_Feedback.store_feedback_category_id = Store_Feedback_Category.store_feedback_category_id 
	    	INNER JOIN User u
	        ON u.user_id = Store_Feedback.user_id
	        INNER JOIN User_Reputation ur
	        ON ur.user_id = u.user_id
	        ORDER BY Store_Feedback.time_added DESC
	        LIMIT 30;
		    '''

	elif id_type == 'store':
	
		query = '''
	        SELECT 
	        u.first_name
	        , u.last_name
	        , Store.store_name
	        , Store_Feedback_Category.store_feedback_category
	        , CAST(Store_Feedback.time_added as char) as time_added
	        , Store_Feedback.store_feedback_text
	        , u.user_id
	        , ur.user_reputation_category_id
	    	FROM Store_Feedback 
	    	INNER JOIN Store ON Store_Feedback.store_id = Store.store_id 
	    	INNER JOIN Store_Feedback_Category 
	        ON Store_Feedback.store_feedback_category_id = Store_Feedback_Category.store_feedback_category_id 
	    	INNER JOIN User u
	        ON u.user_id = Store_Feedback.user_id
	        INNER JOIN User_Reputation ur
	        ON ur.user_id = u.user_id
	        WHERE Store.store_id = {store}
	        ORDER BY Store_Feedback.time_added DESC
	        LIMIT 30;
		    '''
		query = query.format(store = id)  

	elif id_type == 'user':
	
		query = '''
	        SELECT 
	        u.first_name
	        , u.last_name
	        , Store.store_name
	        , Store_Feedback_Category.store_feedback_category
	        , CAST(Store_Feedback.time_added as char) as time_added
	        , Store_Feedback.store_feedback_text
	        , u.user_id
	        , ur.user_reputation_category_id
	    	FROM Store_Feedback 
	    	INNER JOIN Store ON Store_Feedback.store_id = Store.store_id 
	    	INNER JOIN Store_Feedback_Category 
	        ON Store_Feedback.store_feedback_category_id = Store_Feedback_Category.store_feedback_category_id 
	    	INNER JOIN User u
	        ON u.user_id = Store_Feedback.user_id
	        INNER JOIN User_Reputation ur
	        ON ur.user_id = u.user_id
	        WHERE u.user_id = {user}
	        ORDER BY Store_Feedback.time_added DESC
	        LIMIT 30;
		    '''
		query = query.format(user = id)


	result = pd.read_sql(query, con=db_connection)
	print(result)

	# Add an ID
	result['id'] = result.index.astype(str)

	result_json = result.to_json(orient = 'records')
	print(result_json)
	return result_json


def pullUserProfile(user_id):

	print("Pulling user profile")

	# Get recent price feedback the user has not already responded to
	query = '''
			SELECT
			ur.user_received_net
			, u.first_name
			, u.last_name
			, ur.user_reputation_category_id
			, urc.user_reputation_category_name
			FROM User u
            INNER JOIN User_Reputation ur ON u.user_id = ur.user_id
            INNER JOIN User_Reputation_Category urc on ur.user_reputation_category_id = urc.user_reputation_category_id
            WHERE u.user_id = {user}
	    	'''

	query = query.format(user = user_id)
	result = pd.read_sql(query, con=db_connection)
	print(result)

	# Add an ID
	result['id'] = result.index.astype(str)

	result_json = result.to_json(orient = 'records')
	print(result_json)
	return result_json


@app.route('/getFavoriteStores/', methods=['POST', 'GET'])
def getFavoriteStores():

    print(request.json)
    result_json = pullFavoriteStores(request.json['user_id'])
    return result_json, 201


@app.route('/getTopStores/', methods=['POST', 'GET'])
def getTopStores():

    print(request.json)
    result_json = pullTopStores(request.json['user_id'])
    return result_json, 201

@app.route('/getFeedEntries/', methods=['POST', 'GET'])
def getFeedEntries():

	print(request.json)
	result_json = pullFeedEntries(request.json['id_type'], request.json['id_value'])
	return result_json, 201


@app.route('/getUserProfile/', methods=['POST', 'GET'])
def getUserProfile():

	print("GET USER DATA")
	print(request.json)
	result_json = pullUserProfile(request.json['user_id'])
	return result_json, 201    


if __name__ == '__main__':
    app.run(debug=True)
