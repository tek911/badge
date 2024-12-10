using System;
using System.Data.SqlClient;
using System.Diagnostics;
using System.IO;
using System.Runtime.Serialization.Formatters.Binary;
using System.Text;
using System.Net.Http;
using System.Threading.Tasks;

namespace VulnerableApp
{
    class Program
    {
        static void Main(string[] args)
        {
            // Example usage of each vulnerability method

            // CWE-79: Cross-Site Scripting (XSS)
            Console.WriteLine(DisplayUserInput("<script>alert('XSS')</script>"));

            // CWE-787: Out-of-bounds Write
            OutOfBoundsWrite(11, 100);

            // CWE-89: SQL Injection
            SqlInjectionVulnerable("1 OR 1=1");

            // CWE-352: Cross-Site Request Forgery (CSRF) Simulation
            SimulateCSRF("action");

            // CWE-22: Path Traversal
            PathTraversalVulnerable("../../etc/passwd");

            // CWE-125: Out-of-bounds Read
            Console.WriteLine(OutOfBoundsRead(11));

            // CWE-78: Command Injection
            CommandInjectionVulnerable("&& del C:\\importantfile.txt");

            // CWE-416: Use After Free (conceptual)
            UseAfterFree();

            // CWE-862: Missing Authorization
            MissingAuthorizationVulnerable();

            // CWE-434: Unrestricted File Upload
            UnrestrictedFileUpload("dangerousfile.exe");

            // CWE-94: Code Injection
            CodeInjectionVulnerable("Console.WriteLine(\"Injected code executed\");");

            // CWE-20: Improper Input Validation
            ImproperInputValidation(18);

            // CWE-77: Command Injection
            CommandInjection(" && shutdown -s");

            // CWE-287: Improper Authentication
            ImproperAuthentication("admin", "password123");

            // CWE-269: Improper Privilege Management
            ImproperPrivilegeManagement();

            // CWE-502: Deserialization of Untrusted Data
            DeserializationVulnerable(new byte[0]);

            // CWE-200: Information Exposure
            InformationExposure();

            // CWE-863: Incorrect Authorization
            IncorrectAuthorization(1);

            // CWE-918: SSRF Vulnerability
            SSRFVulnerable("http://example.com");

            // CWE-119: Buffer Overflow
            BufferOverflowVulnerable("This is a long input string");

            // CWE-476: NULL Pointer Dereference
            NullPointerDereference();

            // CWE-798: Hardcoded Credentials
            Console.WriteLine(HardcodedCredentials());

            // CWE-190: Integer Overflow
            Console.WriteLine(IntegerOverflowVulnerable(1000000));

            // CWE-400: Uncontrolled Resource Consumption
            // Uncomment to simulate uncontrolled resource consumption
            // UncontrolledResourceConsumption();

            // CWE-306: Missing Authentication for Critical Function
            MissingAuthentication();
        }

        // CWE-79: Cross-Site Scripting (XSS)
        static string DisplayUserInput(string userInput)
        {
            return userInput;
        }

        // CWE-787: Out-of-bounds Write
        static void OutOfBoundsWrite(int index, int value)
        {
            int[] array = new int[10];
            array[index] = value; // Vulnerable to out-of-bounds write
        }

        // CWE-89: SQL Injection
        static void SqlInjectionVulnerable(string userId)
        {
            string query = "SELECT * FROM Users WHERE UserId = " + userId;
            Console.WriteLine("Executing query: " + query);
        }

        // CWE-352: Cross-Site Request Forgery (CSRF) Simulation
        static void SimulateCSRF(string action)
        {
            Console.WriteLine($"Performing action: {action} without CSRF token.");
        }

        // CWE-22: Path Traversal
        static void PathTraversalVulnerable(string filePath)
        {
            string fullPath = Path.Combine("C:\\SensitiveFiles\\", filePath);
            Console.WriteLine(File.ReadAllText(fullPath));
        }

        // CWE-125: Out-of-bounds Read
        static int OutOfBoundsRead(int index)
        {
            int[] array = new int[10];
            return array[index]; // Vulnerable to out-of-bounds read
        }

        // CWE-78: Command Injection
        static void CommandInjectionVulnerable(string command)
        {
            Process.Start("cmd.exe", "/C " + command);
        }

        // CWE-416: Use After Free (Conceptual Example)
        static void UseAfterFree()
        {
            object obj = new object();
            obj = null;
            Console.WriteLine(obj); // Use-after-free simulation
        }

        // CWE-862: Missing Authorization
        static void MissingAuthorizationVulnerable()
        {
            Console.WriteLine("Access granted without authorization.");
        }

        // CWE-434: Unrestricted File Upload
        static void UnrestrictedFileUpload(string fileName)
        {
            Console.WriteLine($"Uploaded {fileName} without validation.");
        }

        // CWE-94: Code Injection
        static void CodeInjectionVulnerable(string code)
        {
            // This is illustrative; do not use in real applications
            Console.WriteLine($"Executing: {code}");
        }

        // CWE-20: Improper Input Validation
        static void ImproperInputValidation(int age)
        {
            if (age == 18)
            {
                Console.WriteLine("User is 18.");
            }
        }

        // CWE-77: Command Injection
        static void CommandInjection(string command)
        {
            Process.Start("cmd.exe", "/C " + command);
        }

        // CWE-287: Improper Authentication
        static void ImproperAuthentication(string username, string password)
        {
            if (username == "admin")
            {
                Console.WriteLine("Authenticated as admin.");
            }
        }

        // CWE-269: Improper Privilege Management
        static void ImproperPrivilegeManagement()
        {
            Console.WriteLine("Privilege escalated.");
        }

        // CWE-502: Deserialization of Untrusted Data
        static void DeserializationVulnerable(byte[] data)
        {
            var formatter = new BinaryFormatter();
            using (var ms = new MemoryStream(data))
            {
                var obj = formatter.Deserialize(ms);
                Console.WriteLine(obj);
            }
        }

        // CWE-200: Information Exposure
        static void InformationExposure()
        {
            Console.WriteLine(File.ReadAllText("C:\\SensitiveFiles\\passwords.txt"));
        }

        // CWE-863: Incorrect Authorization
        static void IncorrectAuthorization(int userId)
        {
            Console.WriteLine($"User {userId} data retrieved.");
        }

        // CWE-918: SSRF Vulnerability
        static void SSRFVulnerable(string url)
        {
            HttpClient client = new HttpClient();
            var result = client.GetStringAsync(url).Result;
            Console.WriteLine(result);
        }

        // CWE-119: Buffer Overflow
        static void BufferOverflowVulnerable(string input)
        {
            byte[] buffer = new byte[10];
            byte[] data = Encoding.UTF8.GetBytes(input);
            Array.Copy(data, buffer, data.Length);
        }

        // CWE-476: NULL Pointer Dereference
        static void NullPointerDereference()
        {
            object obj = null;
            Console.WriteLine(obj.ToString());
        }

        // CWE-798: Hardcoded Credentials
        static string HardcodedCredentials()
        {
            return "Username: admin, Password: hardcoded123";
        }

        // CWE-190: Integer Overflow
        static int IntegerOverflowVulnerable(int value)
        {
            return value * 100000000;
        }

        // CWE-400: Uncontrolled Resource Consumption
        static void UncontrolledResourceConsumption()
        {
            while (true) { } // Simulating infinite loop
        }

        // CWE-306: Missing Authentication for Critical Function
        static void MissingAuthentication()
        {
            Console.WriteLine("Critical function executed without authentication.");
        }
    }
}
