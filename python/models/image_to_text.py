from flask import Blueprint, request, jsonify
import pytesseract
pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"
from PIL import Image
from models.summarization import summarize_text  

image_bp = Blueprint("image_transcription", __name__)

@image_bp.route("/image", methods=["POST"])
def predict_image():
    if "image" not in request.files:
        return jsonify({"error": "No image file provided"}), 400

    image = Image.open(request.files["image"]).convert("RGB")
    transcription = pytesseract.image_to_string(image)

    summary = summarize_text(transcription) 

    return jsonify({
        "transcription": transcription,
        "summary": summary
    })
