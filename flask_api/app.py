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

# Get a user's top stores
def pullTopStores(user_id):

	print("Running Pull Top Stores")
	print(user_id)

	# Get recent price feedback the user has not already responded to
	get_top_stores_query = '''
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
	get_top_stores_query_fmt = get_top_stores_query.format(user = user_id)
	print(get_top_stores_query_fmt)
	top_stores = pd.read_sql(get_top_stores_query_fmt, con=db_connection)
	print(top_stores)

	# Add an ID
	top_stores['id'] = top_stores.index.astype(str)

	top_stores_json = top_stores.to_json(orient = 'records')
	print(top_stores_json)

	return top_stores_json


@app.route('/getStores/', methods=['POST', 'GET'])
def getUserStores():

    print(request.json)
    print(request.json['user_id'])

    top_stores_json = pullTopStores(request.json['user_id'])
    # top_stores_json = {"stores": top_stores_json}
    # print(result)
    # the result is a Python dictionary:
    # print(json_to_dict)

    # Need to parse out user_id

    # Call return stores with user_id    
    # Implements ranking logic

    # Some sort of model
    # Return results

    result = {
	"stores": [{
			"id": "1",
			"store_name": "Trader Joe",
			"location": "SF"
		},
		{
			"id": "2",
			"store_name": "Safeway",
			"location": "SF"
		}
	]
	}

    print(result)

    print(top_stores_json)
    return top_stores_json, 201
    # return result, 201

# @app.route('/time')
# def get_current_time():
#   return {'time': time.time()}

if __name__ == '__main__':
    app.run(debug=True)
