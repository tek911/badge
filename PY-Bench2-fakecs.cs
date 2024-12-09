import os
import subprocess
import pickle
import random
import string

# 1. Command Injection Vulnerability
def command_injection_vulnerable(user_input):
    # This is vulnerable to command injection because we're using `os.system` with unsanitized user input
    os.system(f"echo {user_input}")  # User input directly inserted into shell command

# 2. Insecure Deserialization Vulnerability
def insecure_deserialization_vulnerable(serialized_data):
    # Pickle is insecure as it can execute arbitrary code if given malicious data
    deserialized_data = pickle.loads(serialized_data)
    print(deserialized_data)

# 3. Cross-Site Scripting (XSS) - Flask Web Application Example (pseudo code)
def xss_vulnerable(user_input):
    # This is a placeholder for a web app rendering unsanitized user input in a response.
    return f"<html><body><h1>{user_input}</h1></body></html>"  # Potential for XSS if input is not sanitized

# 4. SQL Injection Vulnerability
import sqlite3

def sql_injection_vulnerable(username, password):
    # Vulnerable to SQL Injection: User input is directly inserted into SQL query
    conn = sqlite3.connect('users.db')
    cursor = conn.cursor()
    query = f"SELECT * FROM users WHERE username='{username}' AND password='{password}'"
    cursor.execute(query)  # Malicious input could bypass authentication
    result = cursor.fetchall()
    return result

# 5. Insecure Randomness (Predictable Random Numbers)
def insecure_random_number():
    # Uses random.seed() by default which can be predictable if you know the seed
    random_number = random.randint(0, 100)
    return random_number

# 6. Hardcoded Secrets (Sensitive Information in Code)
def hardcoded_secrets():
    # Hardcoding passwords, API keys, etc. in source code is a huge vulnerability
    api_key = "super_secret_api_key"
    db_password = "password123"
    print(f"API Key: {api_key}, DB Password: {db_password}")

# 7. Insecure File Handling (Path Traversal)
def insecure_file_handling(file_name):
    # User input is directly used to access files, leading to potential directory traversal
    with open(file_name, 'r') as f:
        print(f.read())  # If user input is like "../etc/passwd", it can expose sensitive files

# 8. Insecure Permissions (File Access Control)
def insecure_permissions(file_name):
    # Using file access without proper permissions control
    if os.access(file_name, os.R_OK):  # Just checking if file is readable, no authentication
        with open(file_name, 'r') as f:
            print(f.read())  # No proper security measures to ensure the file is authorized for access

# 9. Weak Password Storage (Plaintext Passwords)
def weak_password_storage():
    # Storing passwords in plaintext is a critical vulnerability
    username = input("Enter username: ")
    password = input("Enter password: ")
    with open("passwords.txt", "a") as file:
        file.write(f"{username}: {password}\n")  # Password is saved in plaintext

# 10. Cross-Site Request Forgery (CSRF)
def csrf_vulnerable_form():
    # This pseudo code shows how a form can be vulnerable to CSRF.
    # If not protected by tokens, attackers can trick users into submitting requests on their behalf
    user_id = "12345"  # The user ID is a sensitive parameter for the account
    action = "delete_account"
    url = f"http://victim.com/action?user_id={user_id}&action={action}"  # Request can be forged

    return f"Form submission URL: {url}"

# 11. Insufficient Logging and Monitoring
def insufficient_logging():
    # This function should log sensitive events, but it doesn't, making it hard to monitor security issues
    user_input = input("Enter some data: ")
    # No logging, no security monitoring
    print(f"Data: {user_input}")

# 12. Race Condition Vulnerability
def race_condition_vulnerable():
    # Race conditions occur when a system's behavior depends on the relative timing of events
    file_name = "shared_resource.txt"
    with open(file_name, 'a') as file:
        file.write("Incrementing counter...\n")  # If this is called concurrently, it may result in inconsistent data

# 13. Insecure Cryptography (Weak Hashing)
import hashlib

def weak_hashing():
    # Using a weak hashing algorithm (MD5) to store passwords
    password = "supersecretpassword"
    hash_object = hashlib.md5(password.encode())
    print(f"MD5 Hash: {hash_object.hexdigest()}")  # MD5 is not secure for password storage

# 14. Information Disclosure via Stack Traces
def info_disclosure_stack_trace():
    try:
        # Generating an error that will leak information about the code
        1 / 0
    except Exception as e:
        # Printing the full stack trace can give attackers insight into the internal workings of the code
        print(f"Error occurred: {e}")

# 15. Insufficient Input Validation (Integer Overflow)
def insufficient_input_validation():
    # No checks for integer overflow when performing a calculation
    user_input = input("Enter a number: ")
    result = int(user_input) * 1000000000000
    print(f"Result: {result}")  # Malicious input could cause an overflow or crash

# 16. Lack of Secure Transport (No HTTPS)
def lack_of_https():
    # Sensitive information like passwords sent over HTTP can be intercepted.
    username = input("Enter username: ")
    password = input("Enter password: ")
    # Insecure transport without HTTPS:
    print(f"Username: {username}, Password: {password}")  # Data sent over HTTP is insecure

# 17. Improper Error Handling
def improper_error_handling():
    # Displaying the error to the user can leak sensitive information about the application
    try:
        # Try accessing a file that may not exist
        with open("nonexistent_file.txt", "r") as f:
            print(f.read())
    except Exception as e:
        print(f"Error: {e}")  # This could disclose stack trace or other sensitive info

# 18. Insufficient Session Expiry
def session_expiry_vulnerable():
    # Sessions are not expiring or being invalidated after logout, potentially allowing session hijacking
    session_token = "some-session-token"
    print(f"Session Token: {session_token}")  # Session token might be valid even after logout

if __name__ == "__main__":
    # Example inputs to show the vulnerabilities
    command_injection_vulnerable("$(rm -rf /)")  # Command injection
    serialized_data = pickle.dumps({"user": "admin", "password": "password"})
    insecure_deserialization_vulnerable(serialized_data)  # Insecure deserialization
    xss_vulnerable("<script>alert('XSS')</script>")  # XSS vulnerability
    sql_injection_vulnerable("admin' OR '1'='1", "password123")  # SQL Injection
    insecure_random_number()  # Predictable random numbers
    hardcoded_secrets()  # Hardcoded secrets
    insecure_file_handling("../../etc/passwd")  # Path Traversal
    insecure_permissions("important_file.txt")  # Insecure file permissions
    weak_password_storage()  # Storing passwords in plaintext
    csrf_vulnerable_form()  # CSRF vulnerability
    insufficient_logging()  # Lack of logging
    race_condition_vulnerable()  # Race condition
    weak_hashing()  # Using weak hashing algorithms
    info_disclosure_stack_trace()  # Stack trace revealing information
    insufficient_input_validation()  # Integer overflow vulnerability
    lack_of_https()  # No HTTPS in communication
    improper_error_handling()  # Revealing stack trace to users
    session_expiry_vulnerable()  # Session not expiring after logout
