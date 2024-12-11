import java.io.*;
import java.nio.file.*;
import java.sql.*;
import javax.servlet.*;
import javax.servlet.http.*;

// Java Servlet application intentionally vulnerable to multiple CWEs for testing purposes
public class VulnerableApp extends HttpServlet {

    // CWE-798: Use of Hard-coded Credentials
    private static final String SECRET_KEY = "hardcodedsecret";

    // CWE-20: Improper Input Validation
    private String validateInput(String userInput) {
        // No validation performed
        return userInput;
    }

    // CWE-89: SQL Injection vulnerability
    private ResultSet getUserData(String username, Connection conn) throws SQLException {
        Statement stmt = conn.createStatement();
        // Vulnerable to SQL Injection
        return stmt.executeQuery("SELECT * FROM users WHERE username = '" + username + "'");
    }

    // CWE-79: Cross-site Scripting (XSS) vulnerability
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
        String query = request.getParameter("query");
        // No sanitization performed, allowing XSS
        response.getWriter().write("<html><body>Search result: " + query + "</body></html>");
    }

    // CWE-352: CSRF vulnerability
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
        // No CSRF token validation
        response.getWriter().write("Profile updated successfully");
    }

    // CWE-22: Path Traversal vulnerability
    protected void downloadFile(HttpServletRequest request, HttpServletResponse response) throws IOException {
        String filename = request.getParameter("filename");
        // Directly using user input, allowing path traversal
        File file = new File("uploads/" + filename);
        Files.copy(file.toPath(), response.getOutputStream());
    }

    // CWE-78: OS Command Injection vulnerability
    protected void runCommand(HttpServletRequest request, HttpServletResponse response) throws IOException {
        String command = request.getParameter("command");
        // Directly using user input, allowing OS command injection
        Process process = Runtime.getRuntime().exec(command);
        BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()));
        StringBuilder result = new StringBuilder();
        String line;
        while ((line = reader.readLine()) != null) {
            result.append(line).append("
");
        }
        // Write raw command output without interpreting it as HTML, preventing XSS
        response.setContentType("text/plain");
        response.getWriter().write(result.toString());
    }
    }

    // CWE-200: Exposure of Sensitive Information
    protected void getConfig(HttpServletRequest request, HttpServletResponse response) throws IOException {
        // Exposing sensitive information
        response.getWriter().write("App version: 1.0.0\nSecret Key: " + SECRET_KEY);
    }

    // CWE-502: Deserialization of Untrusted Data
    protected void deserialize(HttpServletRequest request, HttpServletResponse response) throws IOException, ClassNotFoundException {
        ObjectInputStream ois = new ObjectInputStream(request.getInputStream());
        // Directly deserializing untrusted data
        Object obj = ois.readObject();
        response.getWriter().write("Deserialized: " + obj.toString());
    }

    // CWE-434: Unrestricted Upload of File with Dangerous Type
    protected void uploadFile(HttpServletRequest request, HttpServletResponse response) throws IOException {
        Part filePart = request.getPart("file");
        // No file type validation
        filePart.write("uploads/" + filePart.getSubmittedFileName());
    }

    // CWE-94: Improper Control of Code Generation
    protected void executeCode(HttpServletRequest request, HttpServletResponse response) throws IOException {
        String code = request.getParameter("code");
        // Directly executing untrusted code (pseudo-code representation)
        // eval(code);  // Dangerous in interpreted languages
        response.getWriter().write("Code executed");
    }

    // CWE-77: Improper Neutralization of Special Elements used in a Command
    protected void executeCommand(HttpServletRequest request, HttpServletResponse response) throws IOException {
        String command = request.getParameter("command");
        // No neutralization, allowing injection
        Process process = Runtime.getRuntime().exec(command);
        response.getWriter().write("Command executed");
    }

    // CWE-287: Improper Authentication
    protected void authenticate(HttpServletRequest request, HttpServletResponse response) throws IOException {
        String username = request.getParameter("username");
        // Weak authentication mechanism
        if ("admin".equals(username)) {
            response.getWriter().write("Authenticated");
        } else {
            response.getWriter().write("Access Denied");
        }
    }

    // CWE-416: Use After Free
    protected void useAfterFree(HttpServletRequest request, HttpServletResponse response) throws IOException {
        String data = "ImportantData";
        data = null; // Freeing the data
        // Accessing freed data
        response.getWriter().write(data);
    }

    // CWE-125: Out-of-bounds Read
    protected void readBuffer(HttpServletRequest request, HttpServletResponse response) throws IOException {
        int[] buffer = {1, 2, 3, 4, 5};
        int index = Integer.parseInt(request.getParameter("index"));
        // No bounds checking, allowing out-of-bounds read
        response.getWriter().write("Value: " + buffer[index]);
    }

    // CWE-787: Out-of-bounds Write
    protected void writeBuffer(HttpServletRequest request, HttpServletResponse response) throws IOException {
        int[] buffer = new int[10];
        int index = Integer.parseInt(request.getParameter("index"));
        int value = Integer.parseInt(request.getParameter("value"));
        // No bounds checking, allowing out-of-bounds write
        buffer[index] = value;
        response.getWriter().write("Buffer updated");
    }

    // CWE-918: Server-Side Request Forgery (SSRF)
    protected void fetchUrl(HttpServletRequest request, HttpServletResponse response) throws IOException {
        String url = request.getParameter("url");
        // No validation of URL, allowing SSRF
        try (InputStream in = new URL(url).openStream()) {
            response.getWriter().write(new String(in.readAllBytes()));
        }
    }

    // CWE-190: Integer Overflow or Wraparound
    protected void integerOverflow(HttpServletRequest request, HttpServletResponse response) throws IOException {
        int value = Integer.parseInt(request.getParameter("value"));
        // No bounds checking, allowing overflow
        int result = value * 1000000000;
        response.getWriter().write("Result: " + result);
    }

    // CWE-400: Uncontrolled Resource Consumption
    protected void resourceConsumption(HttpServletRequest request, HttpServletResponse response) throws IOException {
        int size = Integer.parseInt(request.getParameter("size"));
        // Allowing large allocations
        StringBuilder builder = new StringBuilder(size);
        for (int i = 0; i < size; i++) {
            builder.append("A");
        }
        response.getWriter().write("Resource allocated");
    }

    // CWE-306: Missing Authentication for Critical Function
    protected void criticalFunction(HttpServletRequest request, HttpServletResponse response) throws IOException {
        // No authentication for critical functionality
        response.getWriter().write("Critical function executed");
    }
}
