import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.*;
import org.springframework.stereotype.Controller;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpSession;
import java.io.*;
import java.nio.file.*;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.Statement;
import java.util.*;
import java.net.URL;
import javax.script.ScriptEngine;
import javax.script.ScriptEngineManager;

@SpringBootApplication
@Controller
public class VulnerableApplication {

    // CWE-798: Hard-coded Credentials
    private static final String DB_CONNECTION = "jdbc:mysql://localhost:3306/test";
    private static final String DB_USER = "admin";
    private static final String DB_PASSWORD = "admin123";
    
    private final JdbcTemplate jdbcTemplate;
    
    public VulnerableApplication(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public static void main(String[] args) {
        SpringApplication.run(VulnerableApplication.class, args);
    }

    // CWE-79: Cross-Site Scripting (XSS)
    @GetMapping("/xss")
    @ResponseBody
    public String xss(@RequestParam String userInput) {
        // Dangerous: Direct HTML injection
        return "<div>" + userInput + "</div>";
    }

    // CWE-89: SQL Injection
    @PostMapping("/users")
    @ResponseBody
    public String findUser(@RequestParam String username) {
        try (Connection conn = DriverManager.getConnection(DB_CONNECTION, DB_USER, DB_PASSWORD)) {
            // Dangerous: Direct SQL concatenation
            Statement stmt = conn.createStatement();
            stmt.executeQuery("SELECT * FROM users WHERE username = '" + username + "'");
            return "Query executed";
        } catch (Exception e) {
            return "Error: " + e.getMessage();
        }
    }

    // CWE-22: Path Traversal
    @GetMapping("/download")
    @ResponseBody
    public ResponseEntity<Resource> downloadFile(@RequestParam String filename) throws IOException {
        // Dangerous: No path validation
        Path path = Paths.get("files/" + filename);
        Resource resource = new UrlResource(path.toUri());
        return ResponseEntity.ok().body(resource);
    }

    // CWE-78: OS Command Injection
    @GetMapping("/execute")
    @ResponseBody
    public String executeCommand(@RequestParam String command) throws IOException {
        // Dangerous: Direct command execution
        Process process = Runtime.getRuntime().exec(command);
        return "Command executed";
    }

    // CWE-434: Unrestricted File Upload
    @PostMapping("/upload")
    @ResponseBody
    public String handleFileUpload(@RequestParam("file") MultipartFile file) {
        try {
            // Dangerous: No file type validation
            String filename = file.getOriginalFilename();
            Path path = Paths.get("uploads/" + filename);
            Files.copy(file.getInputStream(), path, StandardCopyOption.REPLACE_EXISTING);
            return "File uploaded successfully";
        } catch (IOException e) {
            return "Upload failed: " + e.getMessage();
        }
    }

    // CWE-502: Deserialization of Untrusted Data
    @PostMapping("/deserialize")
    @ResponseBody
    public Object deserialize(@RequestBody byte[] data) {
        try (ObjectInputStream ois = new ObjectInputStream(new ByteArrayInputStream(data))) {
            // Dangerous: Unsafe deserialization
            return ois.readObject();
        } catch (Exception e) {
            return "Error: " + e.getMessage();
        }
    }

    // CWE-200: Information Exposure
    @GetMapping("/debug")
    @ResponseBody
    public Map<String, String> debugInfo() {
        // Dangerous: Exposing sensitive information
        Map<String, String> info = new HashMap<>();
        info.put("db_connection", DB_CONNECTION);
        info.put("db_user", DB_USER);
        info.put("db_password", DB_PASSWORD);
        info.put("system_properties", System.getProperties().toString());
        return info;
    }

    // CWE-918: Server-Side Request Forgery (SSRF)
    @GetMapping("/fetch")
    @ResponseBody
    public String fetchUrl(@RequestParam String url) {
        try {
            // Dangerous: No URL validation
            URL targetUrl = new URL(url);
            try (InputStream in = targetUrl.openStream()) {
                return new String(in.readAllBytes());
            }
        } catch (Exception e) {
            return "Error: " + e.getMessage();
        }
    }

    // CWE-787 & CWE-125: Out-of-bounds Write/Read
    @GetMapping("/buffer")
    @ResponseBody
    public String unsafeBuffer() {
        byte[] buffer = new byte[10];
        byte[] data = new byte[20];
        Arrays.fill(data, (byte) 'A');
        
        // Dangerous: Buffer overflow
        System.arraycopy(data, 0, buffer, 0, data.length);
        return new String(buffer);
    }

    // CWE-476: NULL Pointer Dereference
    @GetMapping("/nullpointer")
    @ResponseBody
    public String nullPointer() {
        String str = null;
        // Dangerous: Null pointer dereference
        return str.toLowerCase();
    }

    // CWE-190: Integer Overflow
    @GetMapping("/calculate")
    @ResponseBody
    public int calculate(@RequestParam int input) {
        // Dangerous: No overflow checking
        return input * input * input * input;
    }

    // CWE-400: Uncontrolled Resource Consumption
    @GetMapping("/resource")
    @ResponseBody
    public String consumeResources() {
        List<byte[]> data = new ArrayList<>();
        // Dangerous: Memory exhaustion
        while (true) {
            data.add(new byte[1024 * 1024]);
        }
    }

    // CWE-94: Code Injection
    @GetMapping("/eval")
    @ResponseBody
    public Object evaluateCode(@RequestParam String code) {
        try {
            // Dangerous: Code execution
            ScriptEngine engine = new ScriptEngineManager().getEngineByName("nashorn");
            return engine.eval(code);
        } catch (Exception e) {
            return "Error: " + e.getMessage();
        }
    }

    // CWE-306: Missing Authentication
    @GetMapping("/admin")
    @ResponseBody
    public String adminPanel() {
        // Dangerous: No authentication check
        return "Welcome to admin panel";
    }

    // CWE-352: Cross-Site Request Forgery (CSRF)
    @PostMapping("/transfer")
    @ResponseBody
    public String transferMoney(@RequestParam String to, @RequestParam double amount) {
        // Dangerous: No CSRF token
        return "Transferred $" + amount + " to " + to;
    }

    // CWE-862: Missing Authorization
    @GetMapping("/user/{id}")
    @ResponseBody
    public String getUserData(@PathVariable String id) {
        // Dangerous: No authorization check
        return "User data for ID: " + id;
    }

    // CWE-269: Improper Privilege Management
    @PostMapping("/elevate")
    @ResponseBody
    public String elevatePrivileges(HttpSession session) {
        // Dangerous: No privilege validation
        session.setAttribute("role", "ADMIN");
        return "Privileges elevated";
    }
}

// Additional vulnerable class for memory-related vulnerabilities
class UnsafeMemoryOperations {
    private static native void unsafeOperation(byte[] data);
    
    // CWE-416: Use After Free (conceptual Java example)
    public void demonstrateUseAfterFree() {
        Object obj = new Object();
        obj = null;
        // Force garbage collection
        System.gc();
        // Dangerous: Attempting to use after free
        try {
            obj.toString();
        } catch (NullPointerException e) {
            // Expected exception
        }
    }
}
