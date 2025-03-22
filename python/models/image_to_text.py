import json
import os
from PIL import Image
import pytesseract
from flask import jsonify
from models.summarization import summarize_text
from models.evaluation import evaluate_solution

pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"

def process_image(file, problem_statement, rubric):
    try:
        image = Image.open(file).convert("RGB")
    except Exception as e:
        return jsonify({"error": "Invalid image file"}), 400

    transcription = pytesseract.image_to_string(image)

    summary = summarize_text(transcription)

    api_key = os.getenv("GEMINI_API_KEY")

    evaluation_result = evaluate_solution(
        problem_statement=problem_statement,
        solution=summary,
        rubric=rubric,
        api_key=api_key
    )
    
    return {
        "transcription": transcription.strip(),
        "summary": summary.strip(),
        "evaluation": evaluation_result
    }
