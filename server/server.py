from flask import Flask, request, jsonify, send_file, url_for
import util

app = Flask(__name__, static_url_path='', static_folder='UI')

@app.route('/image_classify')
def serve_app():
    return send_file('UI/app.html')

@app.route('/classify_image', methods=['GET', 'POST'])
def classify_image():
    if request.method == 'POST':
        image_data = request.form['image_data']
        response = jsonify(util.classify_image(image_data))
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response
    else:
        return serve_app()

if __name__ == "__main__":
    print("Starting Python Flask Server for Image Classification")
    util.load_saved_artifacts()
    app.run(port=5000)

