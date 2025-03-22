import os
import cv2
import pytesseract
import numpy as np
import torch
import librosa
import threading
import json
import io
from PIL import Image
from moviepy import VideoFileClip  
from transformers import AutoModelForSpeechSeq2Seq, AutoProcessor, pipeline
from flask import jsonify
from models.summarization import summarize_text
from models.evaluation import evaluate_solution

pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"

DEVICE = torch.device("cuda" if torch.cuda.is_available() else "cpu")
DEVICE_IDX = 0 if torch.cuda.is_available() else -1
model_id = "openai/whisper-tiny.en"
asr_model = AutoModelForSpeechSeq2Seq.from_pretrained(model_id).to(DEVICE)
processor = AutoProcessor.from_pretrained(model_id)
asr_pipe = pipeline(
    "automatic-speech-recognition",
    model=asr_model,
    tokenizer=processor.tokenizer,
    feature_extractor=processor.feature_extractor,
    torch_dtype=torch.float16 if torch.cuda.is_available() else torch.float32,
    device=DEVICE_IDX
)

class OCRProcessor:
    def preprocess_image(self, image):
        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
        enhanced = cv2.convertScaleAbs(gray, alpha=1.8, beta=30)
        thresholded = cv2.adaptiveThreshold(enhanced, 255, 
                                            cv2.ADAPTIVE_THRESH_GAUSSIAN_C,
                                            cv2.THRESH_BINARY, 11, 2)
        return thresholded

    def extract_text(self, image):
        processed_image = self.preprocess_image(image)
        config = "--psm 6 --oem 3"
        text = pytesseract.image_to_string(Image.fromarray(processed_image), config=config).strip()
        return text if text else None

class VideoProcessor:
    def __init__(self, video_path, frame_skip=10, threshold=30):
        self.video_path = video_path
        self.frame_skip = frame_skip
        self.threshold = threshold
        self.ocr = OCRProcessor()
        self.extracted_texts = set()

    def extract_text_from_video(self):
        cap = cv2.VideoCapture(self.video_path)
        if not cap.isOpened():
            return "Error: Cannot open video file."
        
        frame_count, prev_frame = 0, None
        while True:
            success, curr_frame = cap.read()
            if not success:
                break
            if frame_count % self.frame_skip == 0:
                if prev_frame is not None:
                    diff = np.mean(cv2.absdiff(cv2.cvtColor(prev_frame, cv2.COLOR_BGR2GRAY),
                                               cv2.cvtColor(curr_frame, cv2.COLOR_BGR2GRAY)))
                    if diff > self.threshold:
                        text = self.ocr.extract_text(curr_frame)
                        if text:
                            self.extracted_texts.add(text)
                prev_frame = curr_frame.copy()
            frame_count += 1
        cap.release()
        return "\n".join(self.extracted_texts)

    def extract_audio(self):
        audio_path = "./temp_audio.wav"
        try:
            video = VideoFileClip(self.video_path)
            video.audio.write_audiofile(audio_path, codec="pcm_s16le", logger=None)
            return audio_path
        except Exception as e:
            return str(e)

def process_video(file, problem_statement, rubric):
    os.makedirs("./uploads", exist_ok=True)
    video_path = os.path.join("./uploads", file.filename)
    file.save(video_path)
    
    processor_instance = VideoProcessor(video_path, frame_skip=15, threshold=35)
    extracted_text, transcript = "", ""

    def ocr_task():
        nonlocal extracted_text
        extracted_text = processor_instance.extract_text_from_video()
    
    def asr_task():
        nonlocal transcript
        audio_file = processor_instance.extract_audio()
        if isinstance(audio_file, str) and "Error" not in audio_file:
            try:
                audio, sr = librosa.load(audio_file, sr=16000, mono=True)
            except Exception as e:
                transcript = f"Error processing audio: {str(e)}"
                return
            samples_per_chunk = 30 * sr
            num_chunks = len(audio) // samples_per_chunk + (1 if len(audio) % samples_per_chunk else 0)
            chunks = []
            for i in range(num_chunks):
                start = i * samples_per_chunk
                chunk = audio[start: start + samples_per_chunk]
                if len(chunk) < samples_per_chunk:
                    pad_width = samples_per_chunk - len(chunk)
                    chunk = np.pad(chunk, (0, pad_width), mode='constant')
                chunks.append(chunk)
            results = asr_pipe(chunks)
            transcript = " ".join(result["text"] for result in results if "text" in result)
            os.remove(audio_file)
    
    # Run OCR and ASR concurrently.
    ocr_thread = threading.Thread(target=ocr_task)
    asr_thread = threading.Thread(target=asr_task)
    ocr_thread.start()
    asr_thread.start()
    ocr_thread.join()
    asr_thread.join()

    text_summary = summarize_text(extracted_text)
    audio_summary = summarize_text(transcript)
    api_key = os.getenv("GEMINI_API_KEY")
    evaluation_result = evaluate_solution(
        problem_statement=problem_statement,
        solution=text_summary + "\n" + audio_summary,
        rubric=rubric,
        api_key=api_key
    )

    os.remove(video_path)
    
    return {
        "extracted_text": extracted_text,
        "text_summary": text_summary,
        "transcription": transcript,
        "audio_summary": audio_summary,
        "evaluation": evaluation_result
    }
