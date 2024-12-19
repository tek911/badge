import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';

// CWE-798: Hardcoded Credentials
const API_KEY = "1234567890abcdef";
const ADMIN_PASSWORD = "admin123";

// Component with multiple vulnerabilities
function VulnerableApp() {
  const [userData, setUserData] = useState(null);
  const [htmlContent, setHtmlContent] = useState('');
  const [sqlQuery, setSqlQuery] = useState('');
  const [command, setCommand] = useState('');
  const [fileContent, setFileContent] = useState(null);
  const [debugInfo, setDebugInfo] = useState({});
  const [serializedData, setSerializedData] = useState('');
  const [url, setUrl] = useState('');
  const [calculation, setCalculation] = useState(0);
  const [isAdmin, setIsAdmin] = useState(false);

  // CWE-79: Cross-site Scripting (XSS)
  const renderUserInput = () => {
    // Dangerous: Direct HTML injection
    return <div dangerouslySetInnerHTML={{ __html: htmlContent }} />;
  };

  // CWE-89: SQL Injection (simulated)
  const executeSqlQuery = () => {
    // Dangerous: Direct concatenation of user input into SQL query
    fetch(`/api/query?sql=SELECT * FROM users WHERE id = ${sqlQuery}`);
  };

  // CWE-78: Command Injection (simulated)
  const executeCommand = () => {
    // Dangerous: Direct command execution
    fetch(`/api/execute?cmd=${command}`);
  };

  // CWE-434: Unrestricted File Upload
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    // Dangerous: No file type validation
    const formData = new FormData();
    formData.append('file', file);
    fetch('/api/upload', { method: 'POST', body: formData });
  };

  // CWE-502: Deserialization of Untrusted Data
  const deserializeData = () => {
    // Dangerous: Unsafe deserialization
    const obj = JSON.parse(serializedData);
    eval(`(${obj})`);
  };

  // CWE-200: Information Exposure
  useEffect(() => {
    // Dangerous: Exposing sensitive debug information
    setDebugInfo({
      environment: process.env,
      apiKey: API_KEY,
      adminPassword: ADMIN_PASSWORD
    });
  }, []);

  // CWE-918: Server-Side Request Forgery (simulated)
  const fetchUrl = () => {
    // Dangerous: No URL validation
    fetch(url);
  };

  // CWE-190: Integer Overflow
  const performCalculation = (input) => {
    // Dangerous: No overflow checking
    setCalculation(input * input * input * input);
  };

  // CWE-400: Uncontrolled Resource Consumption
  const processLargeData = () => {
    // Dangerous: No resource limits
    let result = [];
    for (let i = 0; i < 1000000000; i++) {
      result.push(i * i);
    }
  };

  // CWE-94: Code Injection
  const evaluateCode = (code) => {
    // Dangerous: Direct code execution
    eval(code);
  };

  // CWE-287: Improper Authentication
  const login = (password) => {
    // Dangerous: Weak authentication
    if (password === ADMIN_PASSWORD) {
      setIsAdmin(true);
    }
  };

  // CWE-862: Missing Authorization
  const accessAdminPanel = () => {
    // Dangerous: No proper authorization check
    fetch('/api/admin/data');
  };

  // CWE-22: Path Traversal (simulated)
  const readFile = (path) => {
    // Dangerous: No path validation
    fetch(`/api/files/${path}`);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Vulnerable React Application</h1>

      {/* XSS Vulnerability */}
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">XSS Test</h2>
        <input 
          type="text"
          className="border p-2 mr-2"
          onChange={(e) => setHtmlContent(e.target.value)}
          placeholder="Enter HTML content"
        />
        {renderUserInput()}
      </section>

      {/* SQL Injection */}
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">SQL Injection Test</h2>
        <input 
          type="text"
          className="border p-2 mr-2"
          onChange={(e) => setSqlQuery(e.target.value)}
          placeholder="Enter SQL query"
        />
        <button 
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={executeSqlQuery}
        >
          Execute Query
        </button>
      </section>

      {/* Command Injection */}
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Command Injection Test</h2>
        <input 
          type="text"
          className="border p-2 mr-2"
          onChange={(e) => setCommand(e.target.value)}
          placeholder="Enter command"
        />
        <button 
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={executeCommand}
        >
          Execute Command
        </button>
      </section>

      {/* File Upload */}
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Unrestricted File Upload</h2>
        <input 
          type="file"
          className="border p-2"
          onChange={handleFileUpload}
        />
      </section>

      {/* SSRF */}
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">SSRF Test</h2>
        <input 
          type="text"
          className="border p-2 mr-2"
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Enter URL to fetch"
        />
        <button 
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={fetchUrl}
        >
          Fetch URL
        </button>
      </section>

      {/* Code Injection */}
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Code Injection Test</h2>
        <input 
          type="text"
          className="border p-2 mr-2"
          onChange={(e) => evaluateCode(e.target.value)}
          placeholder="Enter code to evaluate"
        />
      </section>

      {/* Authentication Test */}
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Authentication Test</h2>
        <input 
          type="password"
          className="border p-2 mr-2"
          onChange={(e) => login(e.target.value)}
          placeholder="Enter admin password"
        />
        {isAdmin && <div>Admin access granted!</div>}
      </section>

      {/* Debug Information */}
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Debug Information</h2>
        <pre className="bg-gray-100 p-4 rounded">
          {JSON.stringify(debugInfo, null, 2)}
        </pre>
      </section>
    </div>
  );
}

// Create root element and render app
const container = document.getElementById('root');
const root = createRoot(container);
root.render(<VulnerableApp />);

export default VulnerableApp;
