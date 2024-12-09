import os
import subprocess
import pickle
import sqlite3
import random
import string
import hashlib
import hmac
import base64
import json
import requests
from flask import Flask, request, render_template_string, make_response
from threading import Thread
import time

app = Flask(__name__)

# CWE-79: Improper Neutralization of Input During Web Page Generation ('Cross-site Scripting')
@app.route('/xss', methods=['GET', 'POST'])
def xss_vulnerable():
    if request.method == 'POST':
        user_input = request.form['input']
        # Vulnerable to XSS
        return render_template_string(f'<p>{user_input}</p>')
    return '''
        <form method="post">
            <input type="text" name="input">
            <input type="submit">
        </form>
    '''

# CWE-787: Out-of-bounds Write
def out_of_bounds_write(index, value):
    arr = [0] * 10
    # Vulnerable to out-of-bounds write
    arr[index] = value

# CWE-89: Improper Neutralization of Special Elements used in an SQL Command ('SQL Injection')
def sql_injection_vulnerable(user_id):
    conn = sqlite3.connect('example.db')
    cursor = conn.cursor()
    # Vulnerable to SQL Injection
    cursor.execute(f"SELECT * FROM users WHERE id = {user_id}")
    return cursor.fetchall()

# CWE-352: Cross-Site Request Forgery (CSRF)
@app.route('/csrf', methods=['POST'])
def csrf_vulnerable():
    # Vulnerable to CSRF
    user = request.form['user']
    action = request.form['action']
    # Perform action on behalf of user
    return f"Action {action} performed for user {user}"

# CWE-22: Improper Limitation of a Pathname to a Restricted Directory ('Path Traversal')
def path_traversal_vulnerable(filename):
    # Vulnerable to path traversal
    with open(f'/var/www/html/{filename}', 'r') as f:
        return f.read()

# CWE-125: Out-of-bounds Read
def out_of_bounds_read(index):
    arr = [0] * 10
    # Vulnerable to out-of-bounds read
    return arr[index]

# CWE-78: Improper Neutralization of Special Elements used in an OS Command ('OS Command Injection')
def os_command_injection_vulnerable(user_input):
    # Vulnerable to OS command injection
    os.system(f'ls {user_input}')

# CWE-416: Use After Free
def use_after_free():
    class Node:
        def __init__(self, value):
            self.value = value
            self.next = None

    head = Node(1)
    head.next = Node(2)
    # Free the node
    del head.next
    # Use after free
    print(head.next.value)

# CWE-862: Missing Authorization
@app.route('/admin')
def missing_authorization_vulnerable():
    # Missing authorization check
    return "Welcome to the admin panel"

# CWE-434: Unrestricted Upload of File with Dangerous Type
@app.route('/upload', methods=['POST'])
def unrestricted_file_upload():
    file = request.files['file']
    # Unrestricted file upload
    file.save(f'/uploads/{file.filename}')
    return "File uploaded"

# CWE-94: Improper Control of Generation of Code ('Code Injection')
def code_injection_vulnerable(user_input):
    # Vulnerable to code injection
    exec(user_input)

# CWE-20: Improper Input Validation
def improper_input_validation(user_age):
    # Improper input validation
    if user_age == 18:
        print("User is 18")

# CWE-77: Improper Neutralization of Special Elements used in a Command ('Command Injection')
def command_injection_vulnerable(user_input):
    # Vulnerable to command injection
    subprocess.run(f'echo {user_input}', shell=True)

# CWE-287: Improper Authentication
def improper_authentication(username, password):
    # Improper authentication
    if username == 'admin':
        print("Authenticated as admin")

# CWE-269: Improper Privilege Management
def improper_privilege_management():
    # Improper privilege management
    os.setuid(0)  # Set user ID to root

# CWE-502: Deserialization of Untrusted Data
def deserialization_vulnerable(serialized_data):
    # Vulnerable to deserialization of untrusted data
    return pickle.loads(serialized_data)

# CWE-200: Exposure of Sensitive Information to an Unauthorized Actor
def exposure_of_sensitive_info():
    # Exposure of sensitive information
    with open('/etc/passwd', 'r') as f:
        print(f.read())

# CWE-863: Incorrect Authorization
@app.route('/user/<int:user_id>')
def incorrect_authorization_vulnerable(user_id):
    # Incorrect authorization
    return f"User {user_id} data"

# CWE-918: Server-Side Request Forgery (SSRF)
def ssrf_vulnerable(url):
    # Vulnerable to SSRF
    response = requests.get(url)
    return response.text

# CWE-119: Improper Restriction of Operations within the Bounds of a Memory Buffer
def buffer_overflow_vulnerable(data):
    buffer = bytearray(10)
    # Vulnerable to buffer overflow
    buffer[:len(data)] = data

# CWE-476: NULL Pointer Dereference
def null_pointer_dereference():
    ptr = None
    # Vulnerable to null pointer dereference
    print(ptr.value)

# CWE-798: Use of Hard-coded Credentials
def hardcoded_credentials():
    # Hard-coded credentials
    username = 'admin'
    password = 'password123'
    return username, password

# CWE-190: Integer Overflow or Wraparound
def integer_overflow_vulnerable(value):
    # Vulnerable to integer overflow
    result = value * 1000000
    return result

# CWE-400: Uncontrolled Resource Consumption
def uncontrolled_resource_consumption():
    # Uncontrolled resource consumption
    while True:
        pass

# CWE-306: Missing Authentication for Critical Function
@app.route('/critical')
def missing_authentication_vulnerable():
    # Missing authentication
    return "Critical function accessed"

if __name__ == '__main__':
    app.run(debug=True)
