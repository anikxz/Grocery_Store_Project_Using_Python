from flask import Flask, request, jsonify

app = Flask(__name__)
@app.route('/hello')
def hello():
    return "Hello, How are you?"

if __name__ == "__main__":
    print("Start python flask server for grocery store management system")
    app.run(port=5000)