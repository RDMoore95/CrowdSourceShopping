from flask import Flask
from flask_restful import Resource, Api
from flask_cors import CORS, cross_origin
from flask import jsonify
from flask import request

app = Flask(__name__)
# CORS(app)

# api = Api(app)

# class HelloWorld(Resource):
# 	def get(self):
# 		print("Hello world request")
# 		return jsonify({'hello': 'world'})

# api.add_resource(HelloWorld, '/getStores')

# print("Got a request")
# @cross_origin(origin='*',headers=['Content-Type','Authorization'])

@app.route('/getStores/', methods=['POST', 'GET'])
def getUserStores():

    print(request.json)

    print("User ID is 1")

    # Some sort of model
    # Return results

    result = {
	"stores": [{
			"id": "1",
			"name": "Trader Joe",
			"location": "SF"
		},
		{
			"id": "2",
			"name": "Safeway",
			"location": "SF"
		}
	]
	}

    return result, 201

# @app.route('/time')
# def get_current_time():
#   return {'time': time.time()}

if __name__ == '__main__':
    app.run(debug=True)
