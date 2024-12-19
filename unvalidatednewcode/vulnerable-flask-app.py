from flask import Flask, request, render_template_string, redirect, session, send_file
import sqlite3
import os
import subprocess
import pickle
import json
from werkzeug.utils import secure_filename
import ctypes
import sys

app = Flask(__name__)
app.secret_key = "hardcoded_secret_key_123"  # CWE-798: Hard-coded Credentials

# Database initialization
def init_db():
    conn = sqlite3.connect('users.db')
    c = conn.cursor()
    c.execute('''CREATE TABLE IF NOT EXISTS users
                 (username TEXT, password TEXT, is_admin INTEGER)''')
    conn.commit()
    conn.close()

init_db()

# CWE-79: Cross-Site Scripting (XSS)
@app.route('/xss')
def xss():
    name = request.args.get('name', '')
    template = f'''
    <h1>Hello {name}!</h1>
    <a href="/">Back to home</a>
    '''
    return render_template_string(template)

# CWE-89: SQL Injection
@app.route('/login', methods=['POST'])
def login():
    username = request.form.get('username')
    password = request.form.get('password')
    
    conn = sqlite3.connect('users.db')
    c = conn.cursor()
    query = f"SELECT * FROM users WHERE username = '{username}' AND password = '{password}'"
    c.execute(query)
    user = c.fetchone()
    conn.close()
    
    if user:
        session['logged_in'] = True
        return redirect('/dashboard')
    return "Login failed"

# CWE-22: Path Traversal
@app.route('/download')
def download_file():
    filename = request.args.get('file')
    return send_file(filename)

# CWE-78: OS Command Injection
@app.route('/ping')
def ping():
    host = request.args.get('host', 'localhost')
    cmd = f"ping -c 1 {host}"
    return subprocess.check_output(cmd, shell=True)

# CWE-434: Unrestricted File Upload
@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return 'No file uploaded'
    file = request.files['file']
    filename = secure_filename(file.filename)
    file.save(os.path.join('uploads', filename))
    return 'File uploaded successfully'

# CWE-502: Deserialization of Untrusted Data
@app.route('/deserialize', methods=['POST'])
def deserialize_data():
    data = request.get_data()
    return pickle.loads(data)

# CWE-200: Information Exposure
@app.route('/debug')
def debug_info():
    return str(sys.modules)

# CWE-918: Server-Side Request Forgery (SSRF)
@app.route('/fetch')
def fetch_url():
    import urllib.request
    url = request.args.get('url')
    return urllib.request.urlopen(url).read()

# CWE-787 & CWE-125: Out-of-bounds Write/Read
def unsafe_buffer_operations():
    buffer = ctypes.create_string_buffer(10)
    data = b"A" * 20
    ctypes.memmove(buffer, data, len(data))  # Buffer overflow
    return buffer.raw

# CWE-476: NULL Pointer Dereference
class User:
    def __init__(self, name):
        self.name = name

@app.route('/user')
def get_user():
    user = None
    return user.name  # Will cause NULL pointer dereference

# CWE-190: Integer Overflow
@app.route('/calculate')
def calculate():
    num = int(request.args.get('num', '1'))
    result = num * num * num * num * num  # Potential integer overflow
    return str(result)

# CWE-400: Uncontrolled Resource Consumption
@app.route('/regex', methods=['POST'])
def regex_denial():
    import re
    pattern = request.form.get('pattern', '')
    text = request.form.get('text', '')
    return str(re.findall(pattern, text))

# CWE-94: Code Injection
@app.route('/eval')
def eval_code():
    expr = request.args.get('expr', '')
    return str(eval(expr))

# Main route with CSRF vulnerability (CWE-352)
@app.route('/')
def index():
    return '''
    <form action="/login" method="POST">
        <input type="text" name="username">
        <input type="password" name="password">
        <input type="submit" value="Login">
    </form>
    '''  # No CSRF token included

if __name__ == '__main__':
    app.run(debug=True)
