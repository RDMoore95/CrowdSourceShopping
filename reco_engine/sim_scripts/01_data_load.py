#############################################
# DATA LOAD
# Author: Adam Walker
# Date: April 2020
# Purpose: Load initial dummy data from CSVs
#############################################

# Imports
import sys
from sqlalchemy import create_engine
import pymysql
import pandas as pd

#####################
# CONNECTION DETAILS
#####################

# Source DB details
exec(open("/Users/walkerag/Documents/osu/cs467/project_paths.py").read())

# Create connection
db_connection = create_engine(db_connection_str)


#####################
# CHECK DB
#####################

# Show all tables in database
all_tables = pd.read_sql('SHOW TABLES', con=db_connection)
print(all_tables)

# Describe all the DB tables
def describe_table(table, db_connection):
        
    print(table)    
    table_cols = pd.read_sql('DESCRIBE ' + table, con=db_connection)
    print(table_cols)

result = [describe_table(table, db_connection) for table in all_tables['Tables_in_project']]


#####################
# LOAD TABLES
#####################

# Function to load data from a CSV into MySQL database
def data_loader_csv(data_path, table_name, db_connection, load_type):
    
    print("Loading data from CSV")
    
    # Read in from CSV
    df = pd.read_csv(data_path + 'Input Data - ' + table_name.lower() + '.csv')
    
    print(df.head(5))
    
    # Load to mySQL
    df.to_sql(table_name, con = db_connection, if_exists = load_type, index = False)
    
    # Check table
    results_df = pd.read_sql('SELECT * FROM ' + table_name + ' LIMIT 5', con=db_connection)
    print(results_df)

data_loader_csv(data_path, "Country", db_connection, "append")
data_loader_csv(data_path, "State", db_connection, "append")
data_loader_csv(data_path, "Item", db_connection, "append")
data_loader_csv(data_path, "User", db_connection, "append")
data_loader_csv(data_path, "Store", db_connection, "append")
data_loader_csv(data_path, "Store_Feedback_Category", db_connection, "append")
data_loader_csv(data_path, "User_Reputation_Category", db_connection, "append")
