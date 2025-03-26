from flask import Flask, jsonify, request, Blueprint
import json
from models.image_to_text import process_image
from models.speech_to_text import process_audio
from models.video_to_text import process_video
from models.text_analysis import analyze_text_data
from pyngrok import ngrok
import os

def create_text_analysis_blueprint():
    blueprint = Blueprint("text_analysis", __name__)
    
    @blueprint.route("/analyze_text", methods=["POST"])
    def analyze_text():
        try:
            data = request.get_json()
            print(data)
            if not data:
                return jsonify({"error": "No data provided"}), 400
            
            response = analyze_text_data(data) 
            return jsonify(response) 
        except Exception as e:
            return jsonify({"error": str(e)}), 500
    
    return blueprint

def create_app():
    app = Flask(__name__)
    app.register_blueprint(create_text_analysis_blueprint(), url_prefix="/api")
    
    @app.route("/evaluate", methods=["POST"])
    def process_file():
        if "file" not in request.files:
            return jsonify({"error": "No file provided"}), 400
        
        file = request.files["file"]
        file_type = file.content_type.split("/")[0]
        
        if "problem_statement" not in request.form:
            return jsonify({"error": "No problem statement provided"}), 400

        if "rubric" not in request.form:
            return jsonify({"error": "No evaluation rubric provided"}), 400

        try:
            rubric = json.loads(request.form["rubric"])
        except json.JSONDecodeError:
            return jsonify({"error": "Invalid rubric format. Must be valid JSON."}), 400

        problem_statement = request.form["problem_statement"]
        
        if file_type == "image":
            result = process_image(file, problem_statement, rubric)
        elif file_type == "audio":
            result = process_audio(file, problem_statement, rubric)
        elif file_type == "video":
            result = process_video(file, problem_statement, rubric)
        else:
            return jsonify({"error": "Unsupported file type"}), 400
        
        return jsonify(result)
    
    return app

if __name__ == "__main__":
    api_key = os.getenv("NGROK_API_KEY")
    if not api_key:
        raise ValueError("Ngrok API key is missing! Set it using os.environ or Colab Secrets.")
    
    ngrok.set_auth_token(api_key)
    public_url = ngrok.connect(5000)
    print(f"Public URL: {public_url}")
    
    app = create_app()
    app.run(port=5000, host="0.0.0.0")