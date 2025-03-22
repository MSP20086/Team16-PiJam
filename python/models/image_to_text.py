import json
import os
from flask import Blueprint, request, jsonify
from PIL import Image
import pytesseract
from models.summarization import summarize_text
from models.evaluation import evaluate_solution

pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"

image_bp = Blueprint("image_transcription", __name__)

@image_bp.route("/image", methods=["POST"])
def predict_image():
    if "image" not in request.files:
        return jsonify({"error": "No image file provided"}), 400

    if "problem_statement" not in request.form:
        return jsonify({"error": "No problem statement provided"}), 400

    if "rubric" not in request.form:
        return jsonify({"error": "No evaluation rubric provided"}), 400

    try:
        rubric = json.loads(request.form["rubric"])  
    except json.JSONDecodeError:
        return jsonify({"error": "Invalid rubric format. Must be valid JSON."}), 400

    image = Image.open(request.files["image"]).convert("RGB")
    transcription = pytesseract.image_to_string(image)

    summary = summarize_text(transcription)
    problem_statement = request.form["problem_statement"]

    api_key = os.getenv("GEMINI_API_KEY")
    evaluation_result = evaluate_solution(
        problem_statement=problem_statement,
        solution=summary,
        rubric=rubric,
        api_key=api_key
    )

    return jsonify({
        "transcription": transcription.strip(),
        "summary": summary.strip(),
        "evaluation": evaluation_result
    })
