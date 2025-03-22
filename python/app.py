from flask import Flask, jsonify
from models.image_to_text import image_bp
from models.speech_to_text import audio_bp
from models.video_to_text import video_bp
from models.evaluation import evaluation_bp

app = Flask(__name__)

app.register_blueprint(image_bp)
app.register_blueprint(audio_bp)
app.register_blueprint(evaluation_bp)
app.register_blueprint(video_bp)

@app.route("/")
def home():
    return jsonify({"message": "ML Models are running!"})

if __name__ == "__main__":
    app.run(debug=True)
