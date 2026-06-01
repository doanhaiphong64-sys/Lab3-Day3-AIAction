import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv

import sys
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

load_dotenv()

app = Flask(__name__)
# Enable CORS for the React frontend (running on port 3000)
CORS(app, resources={r"/api/*": {"origins": "*"}})

# Global instances
llm_provider = None
agent = None

def init_ai():
    """Initialize the ReAct Agent with LlamaServerProvider."""
    global llm_provider, agent
    
    if agent is not None:
        return
        
    try:
        from src.core.llama_server_provider import LlamaServerProvider
        from src.agent.agent import ReActAgent
        from src.tools.tool_registry import get_default_tools
        
        # We assume llama-server is running on port 8080
        llm_provider = LlamaServerProvider(api_url="http://127.0.0.1:8080/v1")
        
        # Load tools
        registry = get_default_tools()
        
        # Create agent
        agent = ReActAgent(llm=llm_provider, registry=registry, max_steps=5)
    except Exception as e:
        pass # Handle gracefully below if agent is None

@app.route('/api/chat', methods=['POST'])
def chat():
    """API Endpoint to process chat via ReAct Agent."""
    data = request.json
    if not data or 'message' not in data:
        return jsonify({"error": "Missing 'message' in request body"}), 400
        
    user_message = data['message']
    
    if not agent:
        return jsonify({"response": "🤖 Hệ thống Agent chưa sẵn sàng. Vui lòng thử lại sau."})
    
    try:
        # Chạy Agent loop
        final_answer = agent.run(user_message)
        return jsonify({"response": final_answer})
            
    except Exception as e:
        import traceback
        return jsonify({"error": str(e), "traceback": traceback.format_exc()}), 500

@app.route('/api/chat_stream', methods=['POST'])
def chat_stream():
    """API Endpoint to process chat and stream response using Server-Sent Events."""
    from flask import Response
    data = request.json
    if not data or 'message' not in data:
        return jsonify({"error": "Missing 'message' in request body"}), 400
        
    user_message = data['message']
    
    if not agent:
        return jsonify({"error": "Agent not ready"}), 503

    def generate():
        try:
            for chunk in agent.run_stream(user_message):
                # We yield exactly what SSE expects
                yield f"data: {chunk}\n\n"
            yield "data: [DONE]\n\n"
        except Exception as e:
            yield f"data: [ERROR] {str(e)}\n\n"

    return Response(generate(), mimetype='text/event-stream')


@app.route('/api/status', methods=['GET'])
def status():
    """Check if the API and model are running."""
    return jsonify({
        "status": "ok", 
        "agent_loaded": agent is not None
    })

if __name__ == '__main__':
    # Initialize the model before starting the server
    init_ai()
    app.run(host='0.0.0.0', port=5000, debug=False)
