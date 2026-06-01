import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv

# Ensure we import from the local package
import sys
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from src.core.local_provider import LocalProvider
from src.chatbot import Chatbot

load_dotenv()

app = Flask(__name__)
# Enable CORS for the React frontend (running on port 3000)
CORS(app, resources={r"/api/*": {"origins": "*"}})

# Global instances
llm_provider = None
chatbot = None

def init_ai():
    """Initialize the Local Phi-3 Model."""
    global llm_provider, chatbot
    
    if chatbot is not None:
        return  # Already initialized
        
    model_path = os.getenv("LOCAL_MODEL_PATH", "./models/Phi-3-mini-4k-instruct-q4.gguf")
    
    if not os.path.exists(model_path):
        print(f"ERROR: Model file not found at {model_path}")
        return
        
    try:
        print(f"Loading Phi-3 model from {model_path}...")
        # Note: n_ctx=4096 for Phi-3-mini-4k
        llm_provider = LocalProvider(model_path=model_path, n_ctx=4096)
        chatbot = Chatbot(llm=llm_provider)
        print("Model loaded successfully!")
    except Exception as e:
        print(f"Failed to load model: {e}")

@app.route('/api/chat', methods=['POST'])
def chat():
    """API Endpoint to chat with the Phi-3 model."""
    global chatbot
    
    if chatbot is None:
        init_ai()
        
    if chatbot is None:
        return jsonify({"error": "AI model is not loaded. Check server logs."}), 503
        
    data = request.json
    if not data or 'message' not in data:
        return jsonify({"error": "Missing 'message' in request body"}), 400
        
    user_message = data['message']
    print(f"User: {user_message}")
    
    try:
        # Use the chatbot to generate a response
        response = chatbot.chat(user_message)
        print(f"AI: {response}")
        return jsonify({"response": response})
    except Exception as e:
        print(f"Error generating response: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/status', methods=['GET'])
def status():
    """Check if the API and model are running."""
    return jsonify({
        "status": "ok", 
        "model_loaded": chatbot is not None
    })

if __name__ == '__main__':
    # Initialize the model before starting the server
    print("Starting TravelHub AI Backend Server...")
    init_ai()
    app.run(host='0.0.0.0', port=5000, debug=False)
