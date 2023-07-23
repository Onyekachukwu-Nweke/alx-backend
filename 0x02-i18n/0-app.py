#!/usr/bin/env python3
"""
Create a single / route and an index.html template that simply outputs
“Welcome to Holberton” as page title (<title>) and
“Hello world” as header (<h1>).
"""
from flask import Flask, render_template


app = Flask(__name__)


@app.route('/')
def home():
    """
    renders template/index.html
    """
    return render_template('0-index.html')


if __name__ == "__main__":
    app.run(host='127.0.0.1', port='5000')
