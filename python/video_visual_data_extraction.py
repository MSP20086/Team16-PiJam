import cv2
import pytesseract
import numpy as np
import os
import re
import time
import google.generativeai as genai
from PIL import Image
from dotenv import load_dotenv

# Load environment variables from credentials.env
dotenv_path = os.path.join(os.path.dirname(__file__), "credentials.env")
load_dotenv(dotenv_path)

# Retrieve API key from environment variables
google_api_key = os.getenv("GOOGLE_API_KEY")

# Ensure the API key is loaded
if not google_api_key:
    raise ValueError("Error: GOOGLE_API_KEY is missing. Check your credentials.env file.")

# Configure Generative AI API
genai.configure(api_key=google_api_key)


class OCRProcessor:
    def __init__(self, tesseract_path=None):
        if tesseract_path:
            pytesseract.pytesseract.tesseract_cmd = tesseract_path

    def preprocess_image(self, image):
        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
        enhanced = cv2.convertScaleAbs(gray, alpha=1.5, beta=20)
        thresholded = cv2.adaptiveThreshold(enhanced, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY, 11, 2)
        return thresholded

    def extract_text(self, image):
        processed_image = self.preprocess_image(image)
        pil_image = Image.fromarray(processed_image)
        extracted_text = pytesseract.image_to_string(pil_image, config="--psm 4 --oem 3")
        return self.clean_text(extracted_text.strip())

    def clean_text(self, text):
        filtered_lines = []
        for line in text.split("\n"):
            line = line.strip()
            if len(line) < 5:
                continue
            if not re.search(r'[A-Za-z0-9]', line):
                continue
            if re.match(r'^[\|\-=~\s]+$', line):
                continue
            filtered_lines.append(line)
        return "\n".join(filtered_lines) if filtered_lines else None


class VideoProcessor:
    def __init__(self, video_path, tesseract_path=None, threshold=30, frame_skip=10):
        self.video_path = video_path
        self.threshold = threshold
        self.frame_skip = frame_skip
        self.ocr = OCRProcessor(tesseract_path)

    def extract_unique_text_from_video(self):
        cap = cv2.VideoCapture(self.video_path)
        if not cap.isOpened():
            print("Error: Cannot open video file.")
            return None

        frame_count, prev_frame = 0, None
        extracted_texts = set()

        while True:
            success, curr_frame = cap.read()
            if not success:
                break
            if frame_count % self.frame_skip == 0:
                if prev_frame is not None:
                    diff = cv2.absdiff(cv2.cvtColor(prev_frame, cv2.COLOR_BGR2GRAY),
                                       cv2.cvtColor(curr_frame, cv2.COLOR_BGR2GRAY))
                    if np.mean(diff) > self.threshold:
                        extracted_text = self.ocr.extract_text(curr_frame)
                        if extracted_text:
                            extracted_texts.add(extracted_text)
                prev_frame = curr_frame.copy()
            frame_count += 1

        cap.release()
        return "\n".join(extracted_texts)


def summarize_text(extracted_text):
    if not extracted_text:
        return "No text to summarize."
    model = genai.GenerativeModel("gemini-2.0-flash")
    response = model.generate_content([{"text": f"Summarize the following extracted text:\n\n{extracted_text}"}])
    return response.text if response.text else "Summarization failed."


if __name__ == "__main__":
    video_path = "example.mp4"
    tesseract_path = r"C:\\Program Files\\Tesseract-OCR\\tesseract.exe"
    start = time.time()

    processor = VideoProcessor(video_path, tesseract_path, threshold=35, frame_skip=15)
    extracted_text = processor.extract_unique_text_from_video()
    summary = summarize_text(extracted_text)

    print("\nExtracted Text:")
    print(extracted_text)
    print("\nSummary:")
    print(summary)
    print("\nTime taken:", round(time.time() - start, 2), "seconds")
