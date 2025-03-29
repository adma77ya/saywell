from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import speech_recognition as sr
from gtts import gTTS
import json
from spellchecker import SpellChecker
from dotenv import dotenv_values
import traceback
import re
from openai import OpenAI

import requests
import json




client = OpenAI(api_key="sk-f8c5d77fe38b42bbb7686fc8f1e5ebbe", base_url="https://api.deepseek.com")

# Load environment variables
config = dotenv_values(".env")

# Initialize spell checker with English dictionary
spell = SpellChecker()

# Add custom dictionary for strict checking
informal_words = {
    'u': 'you',
    'r': 'are',
    'ur': 'your',
    'y': 'why',
    'k': 'okay',
    'ok': 'okay',
    'pls': 'please',
    'plz': 'please',
    'thx': 'thanks',
    'ty': 'thank you',
    'gonna': 'going to',
    'wanna': 'want to',
    'idk': 'I don\'t know',
    'bc': 'because',
    'cuz': 'because',
    'cause': 'because',
    'rn': 'right now',
    'tbh': 'to be honest',
    'nvm': 'never mind',
    'omg': 'oh my god',
    'lol': 'laugh out loud',
    'asap': 'as soon as possible',
    'fyi': 'for your information'
}

def is_proper_word(word):
    # Check if word contains numbers
    if any(char.isdigit() for char in word):
        return False
        
    # Check if word is too short (except a, I, A)
    if len(word) == 1 and word.lower() not in ['a', 'i']:
        return False
        
    # Check if word has repeating letters more than twice
    for i in range(len(word)-2):
        if word[i] == word[i+1] == word[i+2]:
            return False
            
    # Check if word is properly capitalized
    if word.lower() == 'i' and word != 'I':
        return False
        
    return True

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})

# Initialize speech recognizer
recognizer = sr.Recognizer()

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({
        "status": "healthy",
        "message": "SayWell API is running",
        "env_check": {
            "firebase_id_set": bool(config.get('FIREBASE_PROJECT_ID')),
            "firebase_email_set": bool(config.get('FIREBASE_CLIENT_EMAIL'))
        }
    })

@app.route('/api/speech-to-text', methods=['POST'])
def speech_to_text():
    if 'audio' not in request.files:
        return jsonify({"error": "No audio file provided"}), 400
    
    audio_file = request.files['audio']
    try:
        # Convert speech to text using Google Speech Recognition
        with sr.AudioFile(audio_file) as source:
            audio_data = recognizer.record(source)
            text = recognizer.recognize_google(audio_data)
            return jsonify({"text": text})
    except Exception as e:
        print("Speech-to-Text Error:", str(e))
        print("Traceback:", traceback.format_exc())
        return jsonify({"error": str(e)}), 500

@app.route('/api/text-to-speech', methods=['POST'])
def text_to_speech():
    data = request.json
    if not data or 'text' not in data:
        return jsonify({"error": "No text provided"}), 400
    
    try:
        text = data['text']
        if not text.strip():
            return jsonify({"error": "Empty text provided"}), 400

        tts = gTTS(text=text, lang='en')
        audio_path = os.path.join(app.root_path, "temp_audio.mp3")
        tts.save(audio_path)
        
        # In a production environment, you would upload this to cloud storage
        # For now, we'll just return success
        return jsonify({"success": True, "message": "Audio generated successfully"})
    except Exception as e:
        print("Text-to-Speech Error:", str(e))
        print("Traceback:", traceback.format_exc())
        return jsonify({"error": str(e)}), 500

@app.route('/api/check-spelling', methods=['POST'])
def check_spelling():
    input_text = request.json.get("text","")
    prefTeachStyle = request.json.get("prefTeachStyle",)
    age = request.json.get("age",)
    struggleSyllable = request.json.get("struggleSyllable",)
    nickname = request.json.get("nickname")

    api_response = requests.post(
    url="https://openrouter.ai/api/v1/chat/completions",
    headers={
        "Authorization": "Bearer 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",
        "Content-Type": "application/json",
        # "HTTP-Referer": "<YOUR_SITE_URL>", # Optional. Site URL for rankings on openrouter.ai.
        # "X-Title": "<YOUR_SITE_NAME>", # Optional. Site title for rankings on openrouter.ai.
    },

    data=json.dumps({
    "model": "deepseek/deepseek-chat",
    "messages": [
      { "role": "system", "content": f"You are SayWell, an AI assistant built to help with reading and writing."
      f" Your job is to correct mistakes, simplify text, and improve pronunciation. "
      f"You must:"
      f"1. Fix spelling and grammar mistakes in the user's text."
      f"2. Simplify long or difficult sentences."
      f"3. Convert misspelled words into syllables and show pronunciation (example: 'necessary' → 'nes-uh-ser-ee')."
      f"4. Do NOT define words. Only correct and simplify text."
      f"5. Keep responses clear, short, and encouraging."
      f"6. Teach the user in this manner : {prefTeachStyle} "
      f"7. Age is : {age} and struggles such as remember- {struggleSyllable}" 
      f"8. Call user as {nickname} "
      
      },
    { "role": "user", "content": input_text }
    ],
  })
)
    corrected_text = api_response.json()['choices'][0]['message']['content']
    print({corrected_text})
    
    return jsonify({"corrected_text": corrected_text})  # Ensure JSON structure
if __name__ == '__main__':
    app.run(debug=True)





