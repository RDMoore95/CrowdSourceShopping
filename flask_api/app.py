from flask import Flask
from flask_restful import Resource, Api
from flask_cors import CORS, cross_origin
from flask import jsonify
from flask import request

import sys
from sqlalchemy import create_engine
import pymysql
import pandas as pd
import geopy.distance
import textdistance
import numpy as np

app = Flask(__name__)

# Get MySQL credentials
# exec(open("/Users/walkerag/Documents/osu/cs467/project_paths.py").read())
# exec(open("./project_paths.py").read())
db_connection_str = 'mysql+pymysql://admin:RomanescoS2020@crowd-source-shopping.cyd6yg4g4qtf.us-east-2.rds.amazonaws.com/project'
# DB connection
db_connection = create_engine(db_connection_str)

# Distance from user to store
def storeUserDistance(userLat, userLong, storeLat, storeLong):
    
    coords_1 = (userLat, userLong)
    coords_2 = (storeLat, storeLong)
    
    return round(geopy.distance.geodesic(coords_1, coords_2).miles, 1)

# List of stores user can give feedback on
# Combination of favorite and populat
def pullFeedbackStores(user_id, userLat, userLong):

	distance_limit = 25

	print("Running Pull Feedback Stores")
	print(user_id)

	# Get recent price feedback the user has not already responded to
	query = '''
		SELECT DISTINCT 
	    store_id
	    , store_name
	    , store_street
	    , store_city
	    , store_zip
	    , store_lat
	    , store_long
	    , user_feedback
	    FROM
	    (
	    (SELECT DISTINCT 
	    s.store_id
	    , s.store_name
	    , s.store_street
	    , s.store_city
	    , s.store_zip
	    , s.store_lat
	    , s.store_long
	    , COUNT(*) as user_feedback
	    FROM Store_Feedback sf
	    INNER JOIN Store s
	    ON sf.store_id = s.store_id
	    WHERE sf.user_id = {user}
	    GROUP BY 1, 2, 3, 4, 5, 6, 7
	    ORDER BY sf.time_added DESC
	    LIMIT 10)
	    UNION ALL
	    (SELECT
	    s.store_id
	    , s.store_name
	    , s.store_street
	    , s.store_city
	    , s.store_zip
	    , s.store_lat
	    , s.store_long	    	    
	    , 0 as user_feedback
	    FROM Store s
	    LEFT JOIN Store_Feedback sf
	    ON sf.store_id = s.store_id
	    AND DATEDIFF(CURDATE(), sf.time_added) <= 90	    
	    GROUP BY 1, 2, 3, 4, 5, 6, 7
	    ORDER BY user_feedback DESC
	    )
	    ) x
	    '''
	query_fmt = query.format(user = user_id)
	print(query_fmt)
	result = pd.read_sql(query_fmt, con=db_connection)
	print(result)

	# Add an ID
	result['id'] = result.index.astype(str)

	# Format store names
	result['store_name_fmt'] = result['store_name'].str.replace('[^a-zA-Z]', '').str.lower()
	result['store_name_fmt'] = np.where(result['store_name_fmt'].isin(['traderjoes','safeway','wholefoodsmarket','costco'])
		, result['store_name_fmt'], 'romanescostoredefault')		

	# Calculate distance from user
	result['distance'] = result.apply(lambda store : storeUserDistance(
	    userLat
	    , userLong
	    , store['store_lat']
	    , store['store_long']), axis = 1)

	# Limit to stores within threshold
	result_filter = result[result['distance'] <= distance_limit]

	# If no stores found, use original list
	if result_filter.shape[0] == 0:    
	    print("No stores")
	    result_filter = result

	# Sort by number of user reviews, distance
	result_filter = result_filter.sort_values(['user_feedback', 'distance'], ascending=[False, True])
	result_filter = result_filter.head(30)

	result_json = result_filter.to_json(orient = 'records')
	print(result_json)
	return result_json


# Get a user's favorite stores
def pullFavoriteStores(user_id):

	print("Running Pull Favorite Stores")
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
	result['store_name_fmt'] = np.where(result['store_name_fmt'].isin(['traderjoes','safeway','wholefoodsmarket','costco'])
		, result['store_name_fmt'], 'romanescostoredefault')		

	result_json = result.to_json(orient = 'records')
	print(result_json)
	return result_json


# Pull top stores
def pullTopStores(userid, userLat, userLong):

	distance_limit = 25

	print("Running Pull Top Stores")

	# Get recent price feedback the user has not already responded to
	query = '''
	    SELECT
	    s.store_id
	    , s.store_name
	    , s.store_street
	    , s.store_city
	    , s.store_zip
	    , s.store_long
	    , s.store_lat
	    , COALESCE(SUM(1), 0) - 1 as total_feedback
	    , COALESCE(COUNT(DISTINCT sf.user_id),0) as shoppers
	    FROM Store s
	    LEFT JOIN Store_Feedback sf
	    ON sf.store_id = s.store_id
	    AND DATEDIFF(CURDATE(), sf.time_added) <= 90
	    GROUP BY 1, 2, 3, 4, 5, 6, 7
	    ORDER BY total_feedback DESC
	    LIMIT 100
	    '''

	result = pd.read_sql(query, con=db_connection)
	print(result)

	# Add an ID
	result['id'] = result.index.astype(str)

	# Format store names
	result['store_name_fmt'] = result['store_name'].str.replace('[^a-zA-Z]', '').str.lower()
	result['store_name_fmt'] = np.where(result['store_name_fmt'].isin(['traderjoes','safeway','wholefoodsmarket','costco'])
		, result['store_name_fmt'], 'romanescostoredefault')

	# Calculate distance from user
	result['distance'] = result.apply(lambda store : storeUserDistance(
	    userLat
	    , userLong
	    , store['store_lat']
	    , store['store_long']), axis = 1)

	# Limit to stores within threshold
	result_filter = result[result['distance'] <= distance_limit]

	# If no stores found, use original list
	if result_filter.shape[0] == 0:    
	    print("No stores")
	    result_filter = result

	# Sort by number of reviews, distance
	result_filter = result_filter.sort_values(['total_feedback', 'distance'], ascending=[False, True])    
	result_filter = result_filter.head(30)

	result_json = result_filter.to_json(orient = 'records')
	print(result_json)
	return result_json


# Pull a user's current shopping list
# Check item has not been removed
def getRecoShoppingList(user_id):
    
    query = """
    SELECT DISTINCT tag_name
    FROM Shopping_List_History
    WHERE tag_name != 'None'
    AND user_id = {user_id}
    AND time_removed IS NULL
    ORDER BY time_added DESC
    LIMIT 100
    """
    
    query = query.format(user_id = user_id)
    
    shopping_list = pd.read_sql(query, con=db_connection)
    return shopping_list


# Pull top stores
def pullRecoStores(user_id, userLat, userLong):

	# userLat = 37.788565246142305
	# userLong = -122.4142765721646
	# user_id = 331
	distance_limit = 25
	string_match_threshold = 0.45

	print("Running Recommended Stores")

	# Get stores list
	pull_stores = """
	    SELECT DISTINCT 
	    store_id
	    , store_name
	    , store_street
	    , store_lat
	    , store_long
	    , store_zip
	    FROM Store
	    """
	stores = pd.read_sql(pull_stores, con=db_connection)

	# Calculate distance from user
	stores['distance'] = stores.apply(lambda store : storeUserDistance(
	    userLat
	    , userLong
	    , store['store_lat']
	    , store['store_long']), axis = 1)

	# Limit to stores within threshold
	stores = stores[stores['distance'] <= distance_limit]
	print(stores.head(3))

	# Return if no stores found
	if stores.shape[0] == 0:    
	    print("No stores")
	    return 0
    
	# Get min price for store-item combination
	price_query = """
	    SELECT 
	    i.item_name
	    , i.item_id
	    , pf.store_id
	    , MIN(pf.price) as store_avg
	    FROM Item i
	    INNER JOIN Price_Feedback pf
	    ON i.item_id = pf.item_id
	    WHERE pf.price > 1 AND pf.price < 100
	    GROUP BY
	    1, 2, 3
	    """

	prices = pd.read_sql(price_query, con=db_connection)
	print(prices.head(3))

	# Limit to stores close by
	prices = prices[prices['store_id'].isin(stores['store_id'])]
	print(prices.shape)

	# Return if no prices found
	if prices.shape[0] == 0:    
	    print("No prices")
	    return 0

    # Get user's shopping list
	shopping_list = getRecoShoppingList(user_id)
	print(shopping_list.head(3))

	# Return if no prices found
	if shopping_list.shape[0] == 0:    
	    print("No shopping list")
	    return 0

	# Match tags against items list
	item_names = prices['item_name'].unique()
	found_items_all = []
	for t in shopping_list['tag_name']:
	    print(t)
	    results = [textdistance.ratcliff_obershelp.distance(t.lower(), item.lower()) for item in item_names]
	    
	    # Get matched items match
	    # Get closest item
	    if min(results) <= string_match_threshold:
	        print(item_names[min(np.array(results)) == np.array(results)])
	        found_item = item_names[min(np.array(results)) == np.array(results)]
	        found_items_all.append(str(found_item[0]))

	# Limit to found items
	prices['matched_item'] = prices['item_name'].map(lambda x: 1 if x in found_items_all else 0) 
	prices = prices[prices["matched_item"] == 1]

	# Return if no prices found
	if prices.shape[0] == 0:    
	    print("No matched items")
	    return 0

	# Format item message
	prices['formatted_desc'] = "Get"
	item_name = prices['item_name'].copy()
	prices['formatted_desc'] = prices["formatted_desc"].str.cat(item_name, sep =" ") 
	prices['formatted_desc'] = prices["formatted_desc"] + " for as low as $"
	item_price = prices[['store_avg']].applymap(lambda x: '{0:.2f}'.format(x)).copy()
	prices['formatted_desc'] = prices["formatted_desc"].str.cat(item_price, sep ="") 

	# Number of results per store
	prices['store_matched_items'] = prices.groupby('store_id')['store_id'].transform('count')

	# Sort by number of items, lowest price
	prices = prices.sort_values(['store_matched_items', 'store_avg'], ascending=[False, False])

	# Take first row by store
	prices = prices.groupby('store_id').first().reset_index()

	# Join on store information
	result = pd.merge(prices, stores, on='store_id')

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
	        , CASE 
			WHEN COALESCE(r.reputation, 0) < 25 THEN 1
			WHEN COALESCE(r.reputation, 0) < 100 THEN 2
			WHEN COALESCE(r.reputation, 0) < 250 THEN 3
			WHEN COALESCE(r.reputation, 0) < 500 THEN 4
			WHEN COALESCE(r.reputation, 0) < 1000 THEN 5
			ELSE 6 END as user_reputation_category_id
	        , Store_Feedback.store_feedback_id
	    	FROM Store_Feedback 
	    	INNER JOIN Store ON Store_Feedback.store_id = Store.store_id 
	    	INNER JOIN Store_Feedback_Category 
	        ON Store_Feedback.store_feedback_category_id = Store_Feedback_Category.store_feedback_category_id 
	    	INNER JOIN User u
	        ON u.user_id = Store_Feedback.user_id
	        INNER JOIN
			(
	        SELECT
	        user_id
	        , CAST(GREATEST(0, SUM(response_vote)) as UNSIGNED) as reputation
	        FROM
	        (
	        SELECT sf.user_id, sr.store_response_vote as response_vote
	        FROM Store_Response sr INNER JOIN Store_Feedback sf
	        ON sr.store_feedback_id = sf.store_feedback_id
	        UNION ALL
	        SELECT pf.user_id, pr.price_response_vote as response_vote
	        FROM Price_Response pr INNER JOIN Price_Feedback pf
	        ON pr.price_feedback_id = pf.price_feedback_id
	        ) x
	        GROUP BY user_id
	        ) r on u.user_id = r.user_id
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
	        , CASE 
			WHEN COALESCE(r.reputation, 0) < 25 THEN 1
			WHEN COALESCE(r.reputation, 0) < 100 THEN 2
			WHEN COALESCE(r.reputation, 0) < 250 THEN 3
			WHEN COALESCE(r.reputation, 0) < 500 THEN 4
			WHEN COALESCE(r.reputation, 0) < 1000 THEN 5
			ELSE 6 END as user_reputation_category_id
	        , Store_Feedback.store_feedback_id
	    	FROM Store_Feedback 
	    	INNER JOIN Store ON Store_Feedback.store_id = Store.store_id 
	    	INNER JOIN Store_Feedback_Category 
	        ON Store_Feedback.store_feedback_category_id = Store_Feedback_Category.store_feedback_category_id 
	    	INNER JOIN User u
	        ON u.user_id = Store_Feedback.user_id
	        INNER JOIN
			(
	        SELECT
	        user_id
	        , CAST(GREATEST(0, SUM(response_vote)) as UNSIGNED) as reputation
	        FROM
	        (
	        SELECT sf.user_id, sr.store_response_vote as response_vote
	        FROM Store_Response sr INNER JOIN Store_Feedback sf
	        ON sr.store_feedback_id = sf.store_feedback_id
	        UNION ALL
	        SELECT pf.user_id, pr.price_response_vote as response_vote
	        FROM Price_Response pr INNER JOIN Price_Feedback pf
	        ON pr.price_feedback_id = pf.price_feedback_id
	        ) x
	        GROUP BY user_id
	        ) r on u.user_id = r.user_id
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
	        , CASE 
			WHEN COALESCE(r.reputation, 0) < 25 THEN 1
			WHEN COALESCE(r.reputation, 0) < 100 THEN 2
			WHEN COALESCE(r.reputation, 0) < 250 THEN 3
			WHEN COALESCE(r.reputation, 0) < 500 THEN 4
			WHEN COALESCE(r.reputation, 0) < 1000 THEN 5
			ELSE 6 END as user_reputation_category_id
	        , Store_Feedback.store_feedback_id
	    	FROM Store_Feedback 
	    	INNER JOIN Store ON Store_Feedback.store_id = Store.store_id 
	    	INNER JOIN Store_Feedback_Category 
	        ON Store_Feedback.store_feedback_category_id = Store_Feedback_Category.store_feedback_category_id 
	    	INNER JOIN User u
	        ON u.user_id = Store_Feedback.user_id
	        INNER JOIN
			(
	        SELECT
	        user_id
	        , CAST(GREATEST(0, SUM(response_vote)) as UNSIGNED) as reputation
	        FROM
	        (
	        SELECT sf.user_id, sr.store_response_vote as response_vote
	        FROM Store_Response sr INNER JOIN Store_Feedback sf
	        ON sr.store_feedback_id = sf.store_feedback_id
	        UNION ALL
	        SELECT pf.user_id, pr.price_response_vote as response_vote
	        FROM Price_Response pr INNER JOIN Price_Feedback pf
	        ON pr.price_feedback_id = pf.price_feedback_id
	        ) x
	        GROUP BY user_id
	        ) r on u.user_id = r.user_id
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
			r.reputation	
			, u.first_name
			, u.last_name
			, CASE 
			WHEN COALESCE(r.reputation, 0) < 25 THEN 1
			WHEN COALESCE(r.reputation, 0) < 100 THEN 2
			WHEN COALESCE(r.reputation, 0) < 250 THEN 3
			WHEN COALESCE(r.reputation, 0) < 500 THEN 4
			WHEN COALESCE(r.reputation, 0) < 1000 THEN 5
			ELSE 6 END as user_reputation_category_id
			, CASE 
			WHEN COALESCE(r.reputation, 0) < 25 THEN 'Apprentice'
			WHEN COALESCE(r.reputation, 0) < 100 THEN 'Professional'
			WHEN COALESCE(r.reputation, 0) < 250 THEN 'Master'
			WHEN COALESCE(r.reputation, 0) < 500 THEN 'Elite'
			WHEN COALESCE(r.reputation, 0) < 1000 THEN 'Superstar'
			ELSE 'Deity' END as user_reputation_category_name
			, (SELECT COUNT(*) FROM Price_Feedback WHERE user_id = {user}) as price_feedback
			, (SELECT COUNT(*) FROM Store_Feedback WHERE user_id = {user}) as store_feedback
			FROM User u
			INNER JOIN
			(
	        SELECT
	        {user} as user_id
	        , CAST(GREATEST(0, SUM(response_vote)) as UNSIGNED) as reputation
	        FROM
	        (
	        SELECT sf.user_id, sr.store_response_vote as response_vote
	        FROM Store_Response sr INNER JOIN Store_Feedback sf
	        ON sr.store_feedback_id = sf.store_feedback_id
	        WHERE sf.user_id = {user}
	        UNION ALL
	        SELECT pf.user_id, pr.price_response_vote as response_vote
	        FROM Price_Response pr INNER JOIN Price_Feedback pf
	        ON pr.price_feedback_id = pf.price_feedback_id
	        WHERE pf.user_id = {user}
	        ) x
	        ) r on u.user_id = r.user_id
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


def pullStoreCategory():

	# List of store feedback categories
	query = '''
    SELECT DISTINCT
    store_feedback_category
    , store_feedback_category_id
    FROM Store_Feedback_Category
    '''

	result = pd.read_sql(query, con=db_connection)

	# Add an ID
	result['id'] = result.index.astype(str)

	result_json = result.to_json(orient = 'records')
	# print(result_json)
	return result_json


def insertFeedResponse(store_feedback_id, vote_value, user, response_user):

	if str(user) != str(response_user):
		print("Adding feed response")

		add_store_response_query = '''
		INSERT INTO Store_Response (store_feedback_id, response_user_id, time_added, store_response_text, store_response_vote)
		SELECT 
		{store_feedback_id} as store_feedback_id
		, {response_user} as response_user_id
		, NOW() as time_added
		, 'None' as store_response_text
		, {vote_value} as store_response_vote
		;
		'''

		add_store_response_query_fmt = add_store_response_query.format(
			store_feedback_id = store_feedback_id
			, response_user = response_user
			, vote_value = vote_value)

		print(add_store_response_query_fmt)

		with db_connection.connect() as connection:
			result = connection.execute(add_store_response_query_fmt)

	else:
		print("Responding to own post: ignore")


def insertStoreFeedback(user_id, store_id, store_feedback_text, store_feedback_category_id, store_feedback_positive):

	print("Adding store feedback")

	# ADD STORE FEEDBACK
	if store_feedback_text != '':

		add_store_feedback_query = '''
		INSERT INTO Store_Feedback (store_id, user_id, time_added, store_feedback_text, store_feedback_category_id)
		SELECT 
		{store_id} as store_id
		, {user_id} as user_id
		, NOW() as time_added
		, '{store_feedback_text}' as store_feedback_text
		, {store_feedback_category_id} as store_feedback_category_id
		;
		'''

		add_store_feedback_query_fmt = add_store_feedback_query.format(
			store_id = store_id
			, user_id = user_id
			, store_feedback_text = store_feedback_text
			, store_feedback_category_id = store_feedback_category_id)

		print(add_store_feedback_query_fmt)

		with db_connection.connect() as connection:
			result = connection.execute(add_store_feedback_query_fmt)

		# Give the user 10 points of received upvotes
		print("Adding user reputation")		
		add_store_response_query = '''
		INSERT INTO Store_Response (store_feedback_id, response_user_id, time_added, store_response_text, store_response_vote)
		SELECT 
		(SELECT MAX(store_feedback_id) FROM Store_Feedback WHERE user_id = {user_id}) as store_feedback_id
		, {user_id} as response_user_id
		, NOW() as time_added
		, 'Store Reward' as store_response_text
		, 5 as store_response_vote
		;
		'''

		add_store_response_query_fmt = add_store_response_query.format(
			user_id = user_id)

		print(add_store_response_query_fmt)

		with db_connection.connect() as connection:
			result = connection.execute(add_store_response_query_fmt)



def insertPriceFeedback(user_id, item_name, barcodeData, price, sale, store_id):

	print("Adding price feedback")
	print(item_name)

	# ADD ITEM TO DATABASE IF NEW
	if (item_name != 'Known') & (item_name != ''):

		print("New item found")
		print(item_name)

		add_item_query = '''
		INSERT INTO Item (item_name, item_upc, item_description, date_added, item_size, item_size_unit)
		SELECT 
		'{item_name}' as item_name
		, {barcodeData} as item_upc
		, 'Unknown' as item_description
		, NOW() as date_added
		, 0 as item_size
		, 'Unknown' as item_size_unit;
		'''

		add_item_query_fmt = add_item_query.format(item_name = item_name
			, barcodeData = barcodeData)

		print(add_item_query_fmt)

		with db_connection.connect() as connection:
			result = connection.execute(add_item_query_fmt)

		print("Adding user reputation")		
		add_price_response_query = '''
		INSERT INTO Price_Response (price_feedback_id, response_user_id, time_added, price_response_text, price_response_vote)
		SELECT 
		(SELECT COALESCE(MAX(price_feedback_id),1) FROM Price_Feedback WHERE user_id = {user_id}) as price_feedback_id
		, {user_id} as response_user_id
		, NOW() as time_added
		, 'Price Reward' as price_response_text
		, 2 as price_response_vote
		;
		'''

		add_price_response_query_fmt = add_price_response_query.format(
			user_id = user_id)

		print(add_price_response_query_fmt)

		with db_connection.connect() as connection:
			result = connection.execute(add_price_response_query_fmt)	


	# GET ITEM_ID
	get_item_id_query = '''
		SELECT item_id 
		FROM Item WHERE item_upc = {barcodeData}
		'''.format(barcodeData = barcodeData)
	print(get_item_id_query)	
	item_id_dat = pd.read_sql(get_item_id_query, con=db_connection)

	# If item exists, try to add price
	if item_id_dat.shape[0]	== 1:

		# Get item_id
		item_id = item_id_dat.iloc[0]['item_id']
		print(item_id)

		# Create sale flag
		sale_flag = 0
		if sale:
			sale_flag = 1
	
		# Check if valid price, if so add feedback
		if (float(price) > 0) & (float(price) < 100):

			print("Adding price feedback")	
			print(price)

			add_price_feedback_query = '''
			INSERT INTO Price_Feedback (store_id, user_id, item_id, price, price_currency, sale_flag, price_feedback_text, time_added)
			SELECT 
			{store_id} as store_id
			, {user_id} as user_id
			, {item_id} as item_id
			, {price} as price
			, 'usd' as price_currency
			, {sale_flag} as sale_flag
			, 'None' as price_feedback_text
			, NOW() as time_added;
			'''

			add_price_feedback_query_fmt = add_price_feedback_query.format(user_id = user_id
				, store_id = store_id
				, item_id = item_id
				, price = price
				, sale_flag = sale_flag)

			print(add_price_feedback_query_fmt)

			with db_connection.connect() as connection:
				result = connection.execute(add_price_feedback_query_fmt)

			print("Adding user reputation")		
			add_price_response_query = '''
			INSERT INTO Price_Response (price_feedback_id, response_user_id, time_added, price_response_text, price_response_vote)
			SELECT 
			(SELECT MAX(price_feedback_id) FROM Price_Feedback WHERE user_id = {user_id}) as price_feedback_id
			, {user_id} as response_user_id
			, NOW() as time_added
			, 'Price Reward' as price_response_text
			, 10 as price_response_vote
			;
			'''

			add_price_response_query_fmt = add_price_response_query.format(
				user_id = user_id)

			print(add_price_response_query_fmt)

			with db_connection.connect() as connection:
				result = connection.execute(add_price_response_query_fmt)


def pullBarcode(barcodeData):

	print("Pulling barcode data")

	# Determine if item is already in database
	query = '''
    (
    SELECT 
    item_name
    , 1 as item_found
    FROM Item
    WHERE item_upc = {barcodeData}
    LIMIT 1
    )
    UNION ALL
    (
    SELECT 'Not Found' as item_name
    , 0 as item_found
    )
    LIMIT 1
    '''

	query = query.format(barcodeData = barcodeData)
	result = pd.read_sql(query, con=db_connection)
	print(result)

	# Add an ID
	result['id'] = result.index.astype(str)

	result_json = result.to_json(orient = 'records')
	print(result_json)
	return result_json

def pullStore(store_id):

	print("Pulling store info")

	# Determine if item is already in database
	query = '''
        SELECT 
        store_id
        , store_name
        , COALESCE((SELECT COUNT(*) FROM Price_Feedback WHERE store_id = {store_id}), 0) as prices_tracked
        , COALESCE((SELECT COUNT(*) FROM Store_Feedback WHERE store_id = {store_id}), 0) as reviews_tracked
        , COALESCE((SELECT COUNT(DISTINCT user_id) FROM Store_Feedback WHERE store_id = {store_id}), 0) as reviewers
        FROM Store
        WHERE store_id = {store_id}
        LIMIT 1
        '''

	query = query.format(store_id = store_id)
	result = pd.read_sql(query, con=db_connection)
	print(result)

	result['store_name_fmt'] = result['store_name'].str.replace('[^a-zA-Z]', '').str.lower()
	
        # Add an ID
	result['id'] = result.index.astype(str)

	result_json = result.to_json(orient = 'records')
	print(result_json)
	return result_json


def pullShoppingList(user_id):

	print("Pulling shopping list")

	# All the items in the shopping list per the id
	query = '''
    SELECT tag_name, MAX(shopping_list_history_id) as shopping_list_history_id
    FROM Shopping_List_History
    WHERE tag_name != 'None'
    AND user_id = {userID}
    AND time_removed IS NULL
    GROUP BY tag_name
    ORDER BY tag_name	
	'''

	query = query.format(userID = user_id)
	result = pd.read_sql(query, con=db_connection)
	print(result)

	# Add an ID
	result['id'] = result.index.astype(str)

	result_json = result.to_json(orient = 'records')
	print(result_json)
	return result_json

def pullListList(user_id):

	print("Pulling list of shopping lists")

	# Just unique shopping list IDs to link to them
	query = '''
			SELECT DISTINCT 
			shopping_list_id
			, user_id
			FROM Shopping_List 
            WHERE user_id = {user}
	    	'''

	query = query.format(user = user_id)
	result = pd.read_sql(query, con=db_connection)
	print(result)

	# Add an ID
	result['id'] = result.index.astype(str)

	result_json = result.to_json(orient = 'records')
	return result_json


def insertShoppingList(user_id, list_id, tag_name):
	query = '''
		INSERT INTO Shopping_List (shopping_list_id, user_id, item_id, tag_name, time_added, shopping_list_history_id, item_quantity)
			 VALUES
			({list}
			, {user} 
			, NULL
			, {tag} 
			, NOW() 
			, {list} 
			, 0 );


			'''

	shopping_insert = query.format(user = user_id, list = list_id, tag = tag_name)
	
	print(shopping_insert)

	with db_connection.connect() as connection:
		result = connection.execute(shopping_insert)

def insertShoppingListHist(user_id, tag_name):
	query = '''
		INSERT INTO Shopping_List_History (user_id, item_id, tag_name, time_added, time_removed)
			VALUES 
			({user} 
			, NULL
			, '{tag}' 
			, NOW() 
			, NULL);

			
			'''

	shopping_insert = query.format(user = user_id, tag = tag_name)
	
	print(shopping_insert)

	with db_connection.connect() as connection:
		result = connection.execute(shopping_insert)

def removeList(list_id):

	query = '''
		DELETE FROM Shopping_List WHERE {list} = shopping_list_id
			'''

	shopping_insert = query.format(list = list_id)
	
	print(shopping_insert)

	with db_connection.connect() as connection:
		result = connection.execute(shopping_insert)

def removeTag(list_id):

	query = '''
			UPDATE Shopping_List_History	
			SET time_removed = NOW()
			WHERE {list} = shopping_list_history_id; 
			'''

	shopping_insert = query.format(list = list_id, )
	
	print(shopping_insert)

	with db_connection.connect() as connection:
		result = connection.execute(shopping_insert)

@app.route('/getFeedbackStores/', methods=['POST', 'GET'])
def getFeedbackStores():

    print(request.json)
    result_json = pullFeedbackStores(request.json['user_id']
    	, request.json['lat']
    	, request.json['long'])
    return result_json, 201

@app.route('/getFavoriteStores/', methods=['POST', 'GET'])
def getFavoriteStores():

    print(request.json)
    result_json = pullFavoriteStores(request.json['user_id'])
    return result_json, 201

@app.route('/getTopStores/', methods=['POST', 'GET'])
def getTopStores():

    print(request.json)
    result_json = pullTopStores(request.json['user_id']
    	, request.json['lat']
		, request.json['long']
    	)
    return result_json, 201

@app.route('/getRecoStores/', methods=['POST', 'GET'])
def getRecoStores():

    print(request.json)
    result_json = pullRecoStores(request.json['user_id']
    	, request.json['lat']
		, request.json['long'])
    print(result_json)
    if result_json == 0:
    	print("Here")
    	return "No results", 401
    return result_json, 201

@app.route('/getStore/', methods=['POST', 'GET'])
def getStore():

    print(request.json)
    result_json = pullStore(request.json['store_id'])
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

@app.route('/getBarcode/', methods=['POST', 'GET'])
def getBarcode():

	print("GET BARCODE")
	print(request.json)
	result_json = pullBarcode(request.json['barcodeData'])
	return result_json, 201 

@app.route('/getStoreCategory/', methods=['POST', 'GET'])
def getStoreCategory():

	print("GET STORE CATEGORY")
	result_json = pullStoreCategory()
	return result_json, 201 

@app.route('/addFeedResponse/', methods=['POST'])
def addFeedResponse():

	print("Adding feed response")
	print(request.json)
	insertFeedResponse(
		request.json['store_feedback_id']
		, request.json['vote_value']		
		, request.json['user']
		, request.json['response_user']
	)

	return "good", 201


@app.route('/addStoreFeedback/', methods=['POST'])
def addStoreFeedback():

	print("Adding store feedback")
	insertStoreFeedback(
		request.json['user_id']
		, request.json['store_id']		
		, request.json['store_feedback_text']
		, request.json['store_feedback_category_id']
		, request.json['store_feedback_positive']
	)

	return "good", 201

@app.route('/addPriceFeedback/', methods=['POST'])
def addPriceFeedback():

	print("Adding price feedback")
	insertPriceFeedback(
		request.json['user_id']
		, request.json['item_name']
		, request.json['barcodeData']
		, request.json['price']
		, request.json['sale']
		, request.json['store_id']
	)

	return "good", 201

#start shopping list 

@app.route('/getLists/', methods=['POST', 'GET'])
def getLists():

    print(request.json)
    result_json = pullListList(request.json['user_id'])
    return result_json, 201

@app.route('/getShoppingList/', methods=['POST', 'GET'])
def getShoppingList():

    print(request.json)
    result_json = pullShoppingList(request.json['user_id'])
    return result_json, 201

@app.route('/addList/', methods=['POST'])
def addList():

	print("Adding tag to list")
	insertShoppingListHist(
		request.json['user_id']
		, request.json['tag_name']	)
	result_json = pullShoppingList(request.json['user_id'])
	return result_json, 201

@app.route('/removeItem/', methods=['POST', 'GET'])
def removeItem():

    print(request.json)
    removeTag(request.json['list_id'])
    result_json = pullShoppingList(request.json['user_id'])
    return result_json, 201	

@app.route('/removeList/', methods=['POST', 'GET'])
def removeList():

    print(request.json)
    result_json = removeList(request.json['list_id'])
    return "good", 201	

if __name__ == '__main__':
    app.run(debug=True)
