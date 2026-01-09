from flask import Flask, render_template, request, jsonify, session, redirect, url_for
import os
import time

app = Flask(__name__)
app.secret_key = os.urandom(24)

# --- MOCK LLM & TEST LOGIC (Shared with Streamlit) ---
def mock_llm_generate(url, reqs):
    time.sleep(1.0)
    return f"""Feature: Functional Testing of {url}

  @happy_path
  Scenario: Successful Login Flow
    Given the user navigates to "{url}"
    When the user enters "standard_user" into the "user-name" field
    And the user enters "secret_sauce" into the "password" field
    And clicks the "login-button" button
    Then the user should see "Products"

  @negative_path
  Scenario: Invalid Login Flow
    Given the user navigates to "{url}"
    When the user enters "wrong_user" into the "user-name" field
    And clicks the "login-button" button
    Then the user should see "Epic sadface: Username and password do not match any user in this service"
"""

def mock_run_test():
    time.sleep(1.5)
    return """
Feature: Functional Testing of https://www.saucedemo.com/ # features/generated.feature:1

  @happy_path
  Scenario: Successful Login Flow                       # features/generated.feature:4
    Given the user navigates to "https://www.saucedemo.com/"  # features/steps/steps.py:10
    When the user enters "standard_user" into the "user-name" field # features/steps/steps.py:15
    And the user enters "secret_sauce" into the "password" field    # features/steps/steps.py:20
    And clicks the "login-button" button                # features/steps/steps.py:25
    Then the user should see "Products"                 # features/steps/steps.py:30

1 feature passed, 0 failed, 0 skipped
1 scenario passed, 0 failed, 0 skipped
5 steps passed, 0 failed, 0 skipped, 0 undefined
Took 0m1.503s

[VERCEL MODE] Browser execution simulated.
"""

# --- ROUTES ---

@app.route('/')
def index():
    if session.get('logged_in'):
        return redirect(url_for('dashboard'))
    return render_template('login.html')

@app.route('/login', methods=['POST'])
def login():
    # Accept any login for demo
    session['logged_in'] = True
    return redirect(url_for('dashboard'))

@app.route('/logout')
def logout():
    session.clear()
    return redirect(url_for('index'))

@app.route('/dashboard')
def dashboard():
    if not session.get('logged_in'):
        return redirect(url_for('index'))
    return render_template('dashboard.html')

@app.route('/api/generate', methods=['POST'])
def generate():
    if not session.get('logged_in'): return jsonify({'error': 'Unauthorized'}), 401
    
    data = request.json
    url = data.get('url')
    reqs = data.get('reqs')
    
    scenario = mock_llm_generate(url, reqs)
    return jsonify({'scenario': scenario})

@app.route('/api/run', methods=['POST'])
def run_test():
    if not session.get('logged_in'): return jsonify({'error': 'Unauthorized'}), 401
    
    logs = mock_run_test()
    return jsonify({'logs': logs, 'status': 'success'})

if __name__ == '__main__':
    app.run(debug=True, port=5000)
