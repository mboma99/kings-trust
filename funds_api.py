import requests
from bs4 import BeautifulSoup
from flask import Flask, jsonify, send_from_directory
from flask_cors import CORS
import os

app = Flask(__name__, static_folder="static")  # Changed static_folder to 'static'
CORS(app)  # Enable CORS for all routes

DONATION_URL = "https://events.kingstrust.org.uk/fundraisers/theworldpaymakers"

# Serve index.html at the root route
@app.route("/")
def index():
    return send_from_directory(app.static_folder, "index.html")

# Helper function to scrape the donation amount
def get_donation_amount():
    try:
        response = requests.get(DONATION_URL, verify=False)  # Disable SSL verification
        response.raise_for_status()
        soup = BeautifulSoup(response.text, "html.parser")
        # Find the <h3> element with class "money mt0"
        h3 = soup.find("h3", class_="money mt0")
        if h3:
            strong = h3.find("strong")
            if strong and strong.text.strip().startswith("£"):
                return strong.text.strip()
        return "Not found"
    except Exception as e:
        return f"Error: {str(e)}"

@app.route("/funds")
def funds():
    amount = get_donation_amount()
    return jsonify({"amount": amount})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
