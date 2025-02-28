from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import requests
from datetime import datetime

app = Flask(__name__)
CORS(app)

API_URL = "https://financialmodelingprep.com/api/v3/income-statement/AAPL?period=annual"
API_KEY = os.getenv("NEXT_PUBLIC_API_KEY")

@app.route('/')
def home():
    return "Flask API is running"

@app.route('/data', methods=['GET'])
def fetch_data():
    try:
        response = requests.get(f"{API_URL}&apikey={API_KEY}")
        response.raise_for_status()
        data = response.json()
        
        # fetch filter params
        year_start = request.args.get('year_start', type=int)
        year_end = request.args.get('year_end', type=int)
        min_revenue = request.args.get('min_revenue', type=float)
        max_revenue = request.args.get('max_revenue', type=float)
        min_net_income = request.args.get('min_net_income', type=float)
        max_net_income = request.args.get('max_net_income', type=float)
        sort_by = request.args.get('sort_by')
        sort_order = request.args.get('sort_order', 'asc')
        
        filtered_data = []
        for item in data:
            year = datetime.strptime(item["date"], "%Y-%m-%d").year
            
            if year_start and year < year_start:
                continue
            if year_end and year > year_end:
                continue
            if min_revenue is not None and item.get("revenue", 0) < min_revenue:
                continue
            if max_revenue is not None and item.get("revenue", 0) > max_revenue:
                continue
            if min_net_income is not None and item.get("netIncome", 0) < min_net_income:
                continue
            if max_net_income is not None and item.get("netIncome", 0) > max_net_income:
                continue
            
            filtered_data.append(item)
            
        if sort_by:
            reverse = sort_order == "desc"
            filtered_data = sorted(filtered_data, key=lambda x: x.get(sort_by, 0), reverse=reverse)
            
        return jsonify(filtered_data)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)