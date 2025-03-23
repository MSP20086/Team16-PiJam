from flask import Flask, jsonify, request, Blueprint
import json
from models.image_to_text import process_image
from models.speech_to_text import process_audio
from models.video_to_text import process_video
def create_app():
    app = Flask(__name__)

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
            return jsonify(result)
        elif file_type == "audio":
            result = process_audio(file, problem_statement, rubric)
            return result
        elif file_type == "video":
            result = process_video(file, problem_statement, rubric)
            return jsonify(result)
        else:
            return jsonify({"error": "Unsupported file type"}), 400
    return app

if __name__ == "__main__":
    app = create_app()
    app.run(debug=True)


#for deploying the website in google colab, use this
#https://colab.research.google.com/drive/1pZF7Ak1raa45zRwXhJk3VbhvpF4QmUTd?usp=sharing

# from flask import Flask, jsonify, request
# import json
# from models.image_to_text import process_image
# from models.speech_to_text import process_audio
# from models.video_to_text import process_video
# from pyngrok import ngrok
# import os

# app = Flask(__name__)
# api_key = os.getenv("NGROK_API_KEY")
# if not api_key:
#     raise ValueError("Ngrok API key is missing! Set it using os.environ or Colab Secrets.")
# ngrok.set_auth_token(api_key)

# public_url = ngrok.connect(5000)
# print(f" Public URL: {public_url}")

# @app.route("/process", methods=["POST"])
# def process_file():
#     if "file" not in request.files:
#         return jsonify({"error": "No file provided"}), 400

#     file = request.files["file"]
#     file_type = file.content_type.split("/")[0]

#     if "problem_statement" not in request.form:
#         return jsonify({"error": "No problem statement provided"}), 400

#     if "rubric" not in request.form:
#         return jsonify({"error": "No evaluation rubric provided"}), 400

#     try:
#         rubric = json.loads(request.form["rubric"])
#     except json.JSONDecodeError:
#         return jsonify({"error": "Invalid rubric format. Must be valid JSON."}), 400

#     problem_statement = request.form["problem_statement"]

#     if file_type == "image":
#         result = process_image(file, problem_statement, rubric)
#     elif file_type == "audio":
#         result = process_audio(file, problem_statement, rubric)
#     elif file_type == "video":
#         result = process_video(file, problem_statement, rubric)
#     else:
#         return jsonify({"error": "Unsupported file type"}), 400

#     return jsonify(result)

# if __name__ == "__main__":
#     app.run(port=5000, host="0.0.0.0")

#remove pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"
#from moviepy import VideoFileClip   here it should be moviepy.editor
