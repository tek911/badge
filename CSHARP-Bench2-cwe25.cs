using System;
using System.Data.SqlClient;
using System.Diagnostics;
using System.IO;
using System.Runtime.Serialization.Formatters.Binary;
using System.Text;

namespace RealVulnerabilitiesApp
{
    class Program
    {
        static void Main(string[] args)
        {
            Console.WriteLine("Enter your input:");

            // Example of user input to simulate untrusted sources
            string userInput = Console.ReadLine();

            // CWE-79: Cross-Site Scripting (XSS)
            CrossSiteScripting(userInput);

            // CWE-89: SQL Injection
            SqlInjection(userInput);

            // CWE-352: Cross-Site Request Forgery (CSRF) Simulation
            SimulateCSRF(userInput, "new@example.com");

            // CWE-22: Path Traversal
            PathTraversal(userInput);

            // CWE-78: Command Injection
            CommandInjection(userInput);

            // CWE-502: Deserialization of Untrusted Data
            DeserializeUntrustedData("serializedData.bin");

            // CWE-94: Code Injection
            CodeInjection(userInput);

            // CWE-190: Integer Overflow
            Console.WriteLine(IntegerOverflow(int.MaxValue));

            // CWE-200: Information Exposure
            InformationExposure();

            // CWE-119: Buffer Overflow Simulation
            BufferOverflowSimulation(userInput);
        }

        // CWE-79: Cross-Site Scripting (XSS)
        static void CrossSiteScripting(string userInput)
        {
            // Vulnerable to XSS: user input is injected into HTML output without sanitization
            string unsafeHtml = $"<div>{userInput}</div>";
            Console.WriteLine("Rendered HTML: " + unsafeHtml);
        }

        // CWE-89: SQL Injection
        static void SqlInjection(string userInput)
        {
            // Vulnerable to SQL Injection: Untrusted input directly concatenated in SQL query
            string connectionString = "your_connection_string_here";
            string query = $"SELECT * FROM Users WHERE Id = {userInput}"; // User input inserted directly
            using (SqlConnection conn = new SqlConnection(connectionString))
            {
                SqlCommand command = new SqlCommand(query, conn);
                conn.Open();
                SqlDataReader reader = command.ExecuteReader();
                while (reader.Read())
                {
                    Console.WriteLine(reader["Name"]);
                }
            }
        }

        // CWE-352: Cross-Site Request Forgery (CSRF)
        static void SimulateCSRF(string action, string value)
        {
            // Simulates a state-changing request without CSRF token
            Console.WriteLine($"Performing {action} with value {value}");
        }

        // CWE-22: Path Traversal
        static void PathTraversal(string filePath)
        {
            // Vulnerable to Path Traversal: User input allows navigating out of intended directories
            string basePath = "C:\\SensitiveData\\";
            string fullPath = Path.Combine(basePath, filePath); // User input inserted directly
            Console.WriteLine("File Content: " + File.ReadAllText(fullPath));
        }

        // CWE-78: Command Injection
        static void CommandInjection(string userInput)
        {
            // Vulnerable to Command Injection: User input is passed directly to the shell
            Process.Start("cmd.exe", "/C dir " + userInput);
        }

        // CWE-502: Deserialization of Untrusted Data
        static void DeserializeUntrustedData(string filePath)
        {
            // Vulnerable to Deserialization of Untrusted Data: File data is not validated
            if (File.Exists(filePath))
            {
                byte[] serializedData = File.ReadAllBytes(filePath);
                BinaryFormatter formatter = new BinaryFormatter();
                using (MemoryStream ms = new MemoryStream(serializedData))
                {
                    object obj = formatter.Deserialize(ms);
                    Console.WriteLine("Deserialized Object: " + obj);
                }
            }
        }

        // CWE-94: Code Injection
        static void CodeInjection(string userInput)
        {
            // Vulnerable to Code Injection: Simulates code execution from untrusted input
            Console.WriteLine($"Simulated code execution: {userInput}");
            // Imagine this is dynamically executed or compiled in real-world scenarios
        }

        // CWE-190: Integer Overflow
        static int IntegerOverflow(int value)
        {
            // Vulnerable to Integer Overflow: Adding to max value
            return checked(value + 1); // Overflow happens if value is int.MaxValue
        }

        // CWE-200: Information Exposure
        static void InformationExposure()
        {
            // Vulnerable to Information Exposure: Sensitive file content displayed
            string sensitiveInfo = File.ReadAllText("C:\\Sensitive\\passwords.txt");
            Console.WriteLine(sensitiveInfo);
        }

        // CWE-119: Buffer Overflow Simulation
        static void BufferOverflowSimulation(string userInput)
        {
            // Vulnerable to Buffer Overflow: User input exceeds buffer length
            byte[] buffer = new byte[10];
            byte[] inputBytes = Encoding.UTF8.GetBytes(userInput);
            Array.Copy(inputBytes, buffer, inputBytes.Length);
        }
    }
}
