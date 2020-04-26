#############################################
# DATA SIMULATION
# Author: Adam Walker
# Date: April 2020
# Purpose: Simulate grocery trips to use as dummy data in models
#############################################

# Imports
import sys
from sqlalchemy import create_engine
import pymysql
import pandas as pd

import random
random.seed(1030)

import numpy as np
import datetime
from datetime import timedelta, date


#####################
# SIM PARAMETERS
#####################

start_date = datetime.datetime(2020, 1, 1)
day_count = 60 # Length of simulation period
poisson_mean = 6 # Approximately how often users will grocery shop
price_perc_items = 0.1 # Percentage of items to give price feedback on
min_shopping_list_items = 1
max_shopping_list_items = 50


#####################
# CONNECTION DETAILS
#####################

# Source DB details
exec(open("/Users/walkerag/Documents/osu/cs467/project_paths.py").read())

# Create connection
db_connection = create_engine(db_connection_str)


#####################
# SIM FUNCTIONS
#####################

# Cleanup prior to simulation
def delete_table_rows(db_connection):
    
    print("Deleting table rows")

    # CLEAN OUT TABLES..
    with db_connection.connect() as connection:
        result = connection.execute('''DELETE FROM Price_Response''')

    with db_connection.connect() as connection:
        result = connection.execute('''DELETE FROM Price_Feedback''')

    with db_connection.connect() as connection:
        result = connection.execute('''DELETE FROM Store_Response''')    

    with db_connection.connect() as connection:
        result = connection.execute('''DELETE FROM Store_Feedback''')

    with db_connection.connect() as connection:
        result = connection.execute('''DELETE FROM Shopping_List''')

    with db_connection.connect() as connection:
        result = connection.execute('''DELETE FROM Shopping_List_History''')

    with db_connection.connect() as connection:
        result = connection.execute('''DELETE FROM User_Reputation''')


# Function to create and upload a shopping list for a given user_id
# min_items and max_items limit number of items in list
def fill_shopping_list(user_id, min_shopping_list_items, max_shopping_list_items, items, add_date):
    
    # Determine total items in list
    tot_items = np.random.uniform(min_shopping_list_items, max_shopping_list_items, 1).round().astype(int)

    # Get item IDs
    list_items = np.random.choice(items['item_id'], tot_items, replace=False)

    # Convert to pandas dataframe
    dataset = pd.DataFrame({'item_id': list_items})

    # Format dataframe
    dataset['user_id'] = user_id
    dataset['time_added'] = add_date
    dataset['time_removed'] = None
    dataset = dataset[['user_id', 'item_id','time_added','time_removed']]

    # Load to mySQL
    # print("Loading")
    dataset.to_sql('Shopping_List_History', con = db_connection, if_exists = "append", index = False)

# Generate shopping list by sampling from items table
def generate_shopping_list_history(db_connection, min_shopping_list_items, max_shopping_list_items, add_date):
    
    # Get items
    items = pd.read_sql('SELECT DISTINCT item_id FROM Item', con=db_connection)
    
    # Users
    users = pd.read_sql('SELECT DISTINCT user_id FROM User', con=db_connection)
    
    # Loop over users
    result = [fill_shopping_list(user_id, min_shopping_list_items, max_shopping_list_items, items, add_date) for user_id in users['user_id']]


# ASSIGN STORE QUALITY
def assign_store_quality(chains, stores):
    
    print("Assigning store quality")

    # Assign overall chain quality
    # Higher is better
    chains['chain_quality'] = 0.5
    chains.loc[chains['store_name'] == "Trader Joe's", 'chain_quality'] = 0.7
    chains.loc[chains['store_name'] == "Safeway", 'chain_quality'] = 0.25
    chains.loc[chains['store_name'] == "Whole Foods Market", 'chain_quality'] = 0.8
    chains.loc[chains['store_name'] == "Costco", 'chain_quality'] = 0.55

    # Assign chain price level
    # Higher means more expensive
    chains['chain_price_level'] = 0.5
    chains.loc[chains['store_name'] == "Trader Joe's", 'chain_price_level'] = 0.6
    chains.loc[chains['store_name'] == "Safeway", 'chain_price_level'] = 0.3
    chains.loc[chains['store_name'] == "Whole Foods Market", 'chain_price_level'] = 0.8
    chains.loc[chains['store_name'] == "Costco", 'chain_price_level'] = 0.3

    # Assign out of stock level
    # Higher means more likely to have in-stock
    chains['chain_stock_level'] = 0.5
    chains.loc[chains['store_name'] == "Trader Joe's", 'chain_stock_level'] = 0.4
    chains.loc[chains['store_name'] == "Safeway", 'chain_stock_level'] = 0.6
    chains.loc[chains['store_name'] == "Whole Foods Market", 'chain_stock_level'] = 0.4
    chains.loc[chains['store_name'] == "Costco", 'chain_stock_level'] = 0.8
    
    print(chains.head())

    # Join on
    stores = stores.join(chains.set_index('store_name'), on='store_name')
    
    # Randomly move individual store attributes around overalll chain ones
    stores['store_quality'] = stores['chain_quality'] + np.random.normal(0, 0.05, stores.shape[0])
    stores['store_price_level'] = stores['chain_price_level'] + np.random.normal(0, 0.05, stores.shape[0])
    stores['store_stock_level'] = stores['chain_stock_level'] + np.random.normal(0, 0.05, stores.shape[0])
    
    print(stores.head())
    
    return(stores)


# ASSIGN ITEM PRICES
def assign_item_prices(items):
    
    print("Assigning item prices")
    items['item_price'] = np.random.poisson(5, items.shape[0]) + 1
    
    print(items.head())
    
    return(items)



# GENERATE PRICE FEEDBACK DATA
def generate_price_feedback(sim_date, sample_perc, user_shopping_list, stores, items, users, db_connection):

    # Join on preferred store
    user_shopping_list = user_shopping_list.join(users.set_index('user_id'), on='user_id')

    # Join on store attributes
    user_shopping_list = user_shopping_list.join(stores.set_index('store_id'), on='store_id')

    # Join on item price
    user_shopping_list = user_shopping_list.join(items.set_index('item_id'), on='item_id')

    # Limit to needed columns
    user_shopping_list = user_shopping_list[['user_id'
                                             , 'item_id'
                                             , 'store_id'
                                             , 'item_price'
                                             , 'store_price_level']]

    # Generate an item price based on default item price, store price level
    # Items can be +/- 20% of baseline
    user_shopping_list['item_price_level_perc'] = np.random.uniform(-0.2, 0.2, user_shopping_list.shape[0])

    # Assign sale flag
    user_shopping_list['sale_flag'] = 0
    user_shopping_list.loc[user_shopping_list['item_price_level_perc'] < -0.05, 'sale_flag'] = 1

    # Scale price by store price level (0.5 is average)
    # Forces a given store to be systematically higher or lower price...
    user_shopping_list['item_price_level_perc_adj'] = user_shopping_list['item_price_level_perc'] + ((user_shopping_list['store_price_level'] - 0.5) * 0.3)

    # Multiply default item price by price level to get final observed price
    # Round to 2 decimal places
    user_shopping_list['price'] = user_shopping_list['item_price'] * (1 + user_shopping_list['item_price_level_perc_adj'])
    user_shopping_list = user_shopping_list.round({'price': 2})
    
    # Sample a portion of the list
    feedback_sample = user_shopping_list.sample(frac=sample_perc, replace=False, random_state=1)

    # Arrange and format columns for table
    feedback_sample['price_currency'] = 'usd'
    feedback_sample['price_feedback_text'] = 'Dummy Price Data'
    feedback_sample['time_added'] = sim_date
    feedback_sample = feedback_sample[['store_id'
                                       , 'user_id'
                                       , 'item_id'
                                       , 'price'
                                       , 'price_currency'
                                       , 'sale_flag'
                                       , 'price_feedback_text'
                                       , 'time_added']]

    # Load feedback to MySQL
    feedback_sample.to_sql('Price_Feedback', con = db_connection, if_exists = "append", index = False)


# Helper function to generate_store_feedback
def upload_store_feedback(user_store, store_feedback_category_id, db_connection):
    
    store_feedback = user_store[['store_id', 'user_id', 'time_added']].copy()

    # Feedback type
    store_feedback['store_feedback_category_id'] = store_feedback_category_id    
    
    # Determine if positive or negative
    if np.random.uniform(0, 1, 1) < float(user_store['quality_prob']):    
        print("Positive feedback!")
        store_feedback['store_feedback_text'] = 'Positive'
    else:
        print("Negative feedback!")
        store_feedback['store_feedback_text'] = 'Negative'    
            
    # Format for MySQL
    store_feedback = store_feedback[['store_id'
                                       , 'user_id'
                                       , 'time_added'
                                       , 'store_feedback_text'
                                       , 'store_feedback_category_id']]

    # Load feedback to MySQL
    store_feedback.to_sql('Store_Feedback', con = db_connection, if_exists = "append", index = False)  


# GENERATE STORE FEEDBACK DATA
def generate_store_feedback(sim_date, user_row, stores, db_connection):

    # Join on store attributes
    user_store = user_row.join(stores.set_index('store_id'), on='store_id')

    # Calculate probability of positive store feedback
    # Function of store quality and user preference
    user_store['quality_prob'] = user_store['store_quality'] * (user_store['user_preference'] / 0.5)

    # Time of feedback
    user_store['time_added'] = sim_date

    # Give general feedback
    if np.random.uniform(0, 1, 1) < float(user_store['user_activity']):

        print("Give general feedback")
        upload_store_feedback(user_store, 14, db_connection)

    # Rate trip
    if np.random.uniform(0, 1, 1) < float(user_store['user_activity']):

        print("Rating trip")
        upload_store_feedback(user_store, 3, db_connection)


# Responde to store feedback
def generate_store_response(sim_date, user_row, db_connection):
    
    # Get recent store feedback the user has not already responded to
    get_store_feedback_query = '''
        SELECT store_feedback_id
        FROM Store_Feedback 
        WHERE user_id != {user}
        AND store_id = {store}
        AND store_feedback_id
        NOT IN (SELECT store_feedback_id FROM Store_Response WHERE response_user_id = {user})
        AND time_added >= DATE_SUB(CAST('{date}' as DATE), INTERVAL 7 DAY)
        ORDER BY time_added DESC
        LIMIT 100
        '''
    
    get_store_feedback_query_fmt = get_store_feedback_query.format(
    user = user_row.iloc[0]['user_id']
    , store = user_row.iloc[0]['store_id']
    , date = sim_date)
    latest_store_feedback = pd.read_sql(get_store_feedback_query_fmt, con=db_connection)
    
    if latest_store_feedback.shape[0] > 0:

        print("Store feedback found")

        # Assign activity value
        latest_store_feedback['activity'] = np.random.uniform(0, 1, latest_store_feedback.shape[0])
        latest_store_feedback['preference'] = np.random.uniform(0, 1, latest_store_feedback.shape[0])

        # Assign upvote/downvote
        # More positive users more likely to assign an upvote
        latest_store_feedback['store_response_vote'] = 0
        latest_store_feedback.loc[latest_store_feedback['preference'] < float(user_row['user_preference']), 'store_response_vote'] = 1
        latest_store_feedback['store_response_text'] = 'Negative'
        latest_store_feedback.loc[latest_store_feedback['preference'] < float(user_row['user_preference']), 'store_response_text'] = 'Positive'

        # Filter based on how likely user is to respond
        latest_store_feedback_filtered = latest_store_feedback[latest_store_feedback["activity"] > float(user_row['user_activity'])].copy()

        # If response rows available, upload to MySQL
        if latest_store_feedback_filtered.shape[0] > 0:

            print("Giving store response!")
            latest_store_feedback_filtered['response_user_id'] = user_row.iloc[0]['user_id']
            latest_store_feedback_filtered['time_added'] = sim_date
            latest_store_feedback_filtered = latest_store_feedback_filtered[['store_feedback_id'
                                               , 'response_user_id'
                                               , 'time_added'
                                               , 'store_response_text'
                                               , 'store_response_vote']]

            # Load feedback to MySQL
            latest_store_feedback_filtered.to_sql('Store_Response', con = db_connection, if_exists = "append", index = False)


# Respond to price feedback
def generate_price_response(sim_date, user_row, db_connection):
    
    # Get recent price feedback the user has not already responded to
    get_price_feedback_query = '''
        SELECT price_feedback_id
        FROM Price_Feedback 
        WHERE user_id != {user}
        AND store_id = {store}
        AND price_feedback_id
        NOT IN (SELECT price_feedback_id FROM Price_Response WHERE response_user_id = {user})
        AND time_added >= DATE_SUB(CAST('{date}' as DATE), INTERVAL 7 DAY)
        ORDER BY time_added DESC
        LIMIT 100
        '''
    
    get_price_feedback_query_fmt = get_price_feedback_query.format(
    user = user_row.iloc[0]['user_id']
    , store = user_row.iloc[0]['store_id']
    , date = sim_date)
    latest_price_feedback = pd.read_sql(get_price_feedback_query_fmt, con=db_connection)
    
    if latest_price_feedback.shape[0] > 0:

        print("Price feedback found")

        # Assign activity value
        latest_price_feedback['activity'] = np.random.uniform(0, 1, latest_price_feedback.shape[0])
        latest_price_feedback['preference'] = np.random.uniform(0, 1, latest_price_feedback.shape[0])

        # Assign upvote/downvote
        # More positive users more likely to assign an upvote
        latest_price_feedback['price_response_vote'] = 0
        latest_price_feedback.loc[latest_price_feedback['preference'] < float(user_row['user_preference']), 'price_response_vote'] = 1
        latest_price_feedback['price_response_text'] = 'Negative'
        latest_price_feedback.loc[latest_price_feedback['preference'] < float(user_row['user_preference']), 'price_response_text'] = 'Positive'

        # Filter based on how likely user is to respond
        latest_price_feedback_filtered = latest_price_feedback[latest_price_feedback["activity"] > float(user_row['user_activity'])].copy()

        # If response rows available, upload to MySQL
        if latest_price_feedback_filtered.shape[0] > 0:

            print("Giving price response!")
            latest_price_feedback_filtered['response_user_id'] = user_row.iloc[0]['user_id']
            latest_price_feedback_filtered['time_added'] = sim_date
            latest_price_feedback_filtered = latest_price_feedback_filtered[['price_feedback_id'
                                               , 'response_user_id'
                                               , 'time_added'
                                               , 'price_response_text'
                                               , 'price_response_vote']]

            # Load feedback to MySQL
            latest_price_feedback_filtered.to_sql('Price_Response', con = db_connection, if_exists = "append", index = False)


# Assign a preferred store to users
def assign_preferred_store(users, stores):

    print("Assigning a preferred store to users")
    users['store_id'] = np.random.choice(stores['store_id'], users.shape[0], replace=True)
    
    return(users)


# Determine how likely a user is to assign positive or negative feedback
# Essentially assigning user biases
def assign_user_preferences(users):
    
    print("Assigning user preferences")    
    
    # How positive or negative a user is: closer to 1 means more likely to give positive feedback
    users['user_preference'] = np.random.uniform(0.1, 0.9, users.shape[0])
    
    # How active a user is: probability of adding or responding to feedback each trip
    users['user_activity'] = np.random.uniform(0.05, 0.6, users.shape[0])
    
    print(users.head())
    
    return(users)


# Update Shopping List table using Shopping List History
def update_shopping_list(db_connection):

    with db_connection.connect() as connection:
        result = connection.execute('''DELETE FROM Shopping_List''')
        
    with db_connection.connect() as connection:
        result = connection.execute('''
            INSERT INTO Shopping_List (user_id, item_id, time_added, shopping_list_history_id, item_quantity)
            SELECT
            user_id
            , item_id
            , time_added
            , shopping_list_history_id
            , 1 as item_quantity
            FROM Shopping_List_History
            WHERE time_removed IS NULL''')


# Seed shopper start date
def shopper_start_date(start_date, poisson_mean):
    
    return start_date + timedelta(int(np.random.poisson(poisson_mean, 1)))


# Determine a user's reputation category (rookie, elite, deity etc)
def assign_reputation_category(user_reputation):
    
    print("Assigning reputation category")
    
    user_reputation['user_reputation'] = user_reputation['user_received_upvotes'] + user_reputation['user_given_upvotes']

    user_reputation['user_reputation_category_id'] = 1
    user_reputation.loc[user_reputation['user_reputation'] > 5, 'user_reputation_category_id'] = 2
    user_reputation.loc[user_reputation['user_reputation'] > 10, 'user_reputation_category_id'] = 3
    user_reputation.loc[user_reputation['user_reputation'] > 20, 'user_reputation_category_id'] = 4
    user_reputation.loc[user_reputation['user_reputation'] > 50, 'user_reputation_category_id'] = 5
    user_reputation.loc[user_reputation['user_reputation'] > 100, 'user_reputation_category_id'] = 6
    
    return(user_reputation)

def generate_user_reputation(db_connection):
    
    print("Generating user reputation")
    
    # Responses given
    response_given = pd.read_sql('''
        SELECT
        response_user_id as user_id
        , SUM(CASE WHEN response_vote = 1 THEN 1 ELSE 0 END) as user_given_upvotes
        , SUM(CASE WHEN response_vote = 0 THEN 1 ELSE 0 END) as user_given_downvotes
        FROM 
        (
        SELECT response_user_id, store_response_vote as response_vote
        FROM Store_Response
        UNION ALL
        SELECT response_user_id, price_response_vote as response_vote    
        FROM Price_Response
        ) x
        GROUP BY response_user_id
      ''', con=db_connection)  

    # Responses received
    response_received = pd.read_sql('''
        SELECT
        user_id
        , SUM(CASE WHEN response_vote = 1 THEN 1 ELSE 0 END) as user_received_upvotes
        , SUM(CASE WHEN response_vote = 0 THEN 1 ELSE 0 END) as user_received_downvotes
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
      ''', con=db_connection)  

    # All users
    users = pd.read_sql('''
        SELECT user_id
        FROM User
        ''', con=db_connection)    
    
    # Join on
    user_reputation = users.join(response_given.set_index('user_id'), on='user_id', how = 'left')
    user_reputation = user_reputation.join(response_received.set_index('user_id'), on='user_id', how = 'left') 
    user_reputation = user_reputation.fillna(0)
    
    user_reputation['user_received_net'] = user_reputation['user_received_upvotes'] - user_reputation['user_received_downvotes']
    user_reputation['user_given_net'] = user_reputation['user_given_upvotes'] - user_reputation['user_given_downvotes']
    
    # Assign category
    user_reputation = assign_reputation_category(user_reputation)

    # Format and upload
    
    # Delete existing
    with db_connection.connect() as connection:
        result = connection.execute('''DELETE FROM User_Reputation''')
        
    # Arrange and format columns for table
    user_reputation = user_reputation[['user_id'
                                       , 'user_reputation'
                                       , 'user_reputation_category_id'
                                       , 'user_received_upvotes'
                                       , 'user_received_downvotes'
                                       , 'user_received_net'
                                       , 'user_given_upvotes'
                                       , 'user_given_downvotes'
                                       , 'user_given_net']]

    # Load feedback to MySQL
    print(user_reputation.head())
    user_reputation.to_sql('User_Reputation', con = db_connection, if_exists = "append", index = False)



#####################
# RUN SIM
#####################

def run_simulation(start_date, day_count, poisson_mean, price_perc_items, min_shopping_list_items, max_shopping_list_items, db_connection):

    # DELETE TABLE ROWS
    delete_table_rows(db_connection)

    # SEED USER SHOPPING LISTS
    generate_shopping_list_history(db_connection, min_shopping_list_items, max_shopping_list_items, start_date)

    # GET USERS
    users = pd.read_sql('SELECT user_id FROM User', con=db_connection)

    # GET STORES
    stores = pd.read_sql('SELECT DISTINCT store_name, store_id FROM Store', con=db_connection)

    # GET CHAINS
    chains = pd.read_sql('SELECT DISTINCT store_name FROM Store', con=db_connection)

    # GET ITEMS
    items = pd.read_sql('SELECT item_id FROM Item', con=db_connection)

    # GET STORE FEEDBACK
    store_feedback = pd.read_sql('''
        SELECT store_feedback_category_id
        , store_feedback_category 
        FROM Store_Feedback_Category''', con=db_connection)

    # ASSIGN STORE QUALITY
    stores = assign_store_quality(chains, stores)

    # ASSIGN ITEM PRICES
    items = assign_item_prices(items)

    # ASSIGN PREFERRED STORE
    users = assign_preferred_store(users, stores)

    # ASSIGN USER PREFERENCES
    users = assign_user_preferences(users)

    # SEED NEXT TRIP DATE
    users['next_trip_date'] = users.apply(lambda row : shopper_start_date(start_date, poisson_mean), axis = 1)

    # SIMULATE EACH DAY
    for sim_date in (start_date + timedelta(n) for n in range(day_count)):
        
        print(sim_date)
        
        # Update shopping list data
        update_shopping_list(db_connection)
        
        # Update user reputation
        generate_user_reputation(db_connection)
        
        # Pull in current shopping lists
        all_shopping_list = pd.read_sql('SELECT * FROM Shopping_List', con=db_connection)
        
        # Loop over users
        for u in users['user_id']:
            
            # Get date of user's next grocery trip
            user_row = users[users['user_id'] == u]        
            next_trip_date = user_row.iloc[0]['next_trip_date']
            
            # If next trip is today, have the user take a grocery trip
            if next_trip_date == sim_date:
                
                print("Taking a grocery trip!")
                print(u)
                
                # Get user's shopping list
                user_shopping_list = all_shopping_list[all_shopping_list['user_id'] == u]
                
                # Generate store feedback
                generate_store_feedback(sim_date
                                        , user_row
                                        , stores
                                        , db_connection)
                
                # Generate price feedback
                generate_price_feedback(sim_date
                                        , price_perc_items
                                        , user_shopping_list
                                        , stores
                                        , items
                                        , users
                                        , db_connection)
                
                # Generate store response
                generate_store_response(sim_date
                                        , user_row
                                        , db_connection)
                
                # Generate price response
                generate_price_response(sim_date
                                        , user_row
                                        , db_connection)
                
                # Update date of next trip
                days_until_next_trip = int(np.random.poisson(poisson_mean, 1)) + 1
                users.loc[users['user_id'] == u, "next_trip_date"] = sim_date + timedelta(days_until_next_trip)


run_simulation(start_date, day_count, poisson_mean, price_perc_items, min_shopping_list_items, max_shopping_list_items, db_connection)                
