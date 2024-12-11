using System;
using System.Data.SqlClient;
using System.Diagnostics;
using System.IO;
using System.Runtime.Serialization.Formatters.Binary;
using System.Security.Cryptography;
using System.Text;

namespace VulnerableApp
{
    [Serializable]
    public class UserData
    {
        public string Data { get; set; }
    }

    class Program
    {
        static void Main(string[] args)
        {
            // Command Injection Vulnerability
            if (args.Length > 0)
            {
                ExecuteCommand(args[0]);
            }

            // Insecure Deserialization Vulnerability
            string filePath = "userdata.bin";
            if (File.Exists(filePath))
            {
                DeserializeData(filePath);
            }

            // SQL Injection Vulnerability
            if (args.Length > 1)
            {
                GetUserData(args[1]);
            }

            // Weak Randomness
            Console.WriteLine($"Random Token: {GenerateToken()}");

            // Hardcoded Secrets
            Console.WriteLine($"Hardcoded Secret: {ApiClient.ApiKey}");

            // Insecure File Handling
            ReadFile("../../somefile.txt");

            // Insecure Permissions
            CreateFile("example.txt");

            // Weak Password Storage
            StorePassword("user", "password123");

            // Logging an error without sanitizing user data
            LogError("This is a sample error.");

            // Simulate XSS by outputting raw HTML
            Console.WriteLine(DisplayUserInput("<script>alert('XSS')</script>"));
        }

        // Vulnerability: Command Injection
        static void ExecuteCommand(string userInput)
        {
            Process.Start("cmd.exe", "/C " + userInput);
        }

        // Vulnerability: Insecure Deserialization
        static void DeserializeData(string filePath)
        {
            BinaryFormatter formatter = new BinaryFormatter();
            using (FileStream fs = new FileStream(filePath, FileMode.Open))
            {
                UserData data = (UserData)formatter.Deserialize(fs);
                Console.WriteLine($"Deserialized Data: {data.Data}");
            }
        }

        // Vulnerability: SQL Injection
        static void GetUserData(string userId)
        {
            string query = "SELECT * FROM Users WHERE UserId = '" + userId + "'";
            using (SqlConnection connection = new SqlConnection("YourConnectionStringHere"))
            {
                SqlCommand command = new SqlCommand(query, connection);
                connection.Open();
                SqlDataReader reader = command.ExecuteReader();
                while (reader.Read())
                {
                    Console.WriteLine($"User Data: {reader[0]}");
                }
            }
        }

        // Vulnerability: Weak Randomness
        static string GenerateToken()
        {
            Random random = new Random();
            byte[] tokenData = new byte[16];
            random.NextBytes(tokenData);
            return Convert.ToBase64String(tokenData);
        }

        // Vulnerability: Hardcoded Secrets
        public class ApiClient
        {
            public const string ApiKey = "HardcodedAPIKey123!";
        }

        // Vulnerability: Insecure File Handling
        static string ReadFile(string fileName)
        {
            string filePath = Path.Combine("C:\\Files\\", fileName);
            return File.ReadAllText(filePath);
        }

        // Vulnerability: Insecure Permissions
        static void CreateFile(string filePath)
        {
            File.WriteAllText(filePath, "Sensitive Data");
            File.SetAttributes(filePath, FileAttributes.Normal);
        }

        // Vulnerability: Weak Password Storage
        static void StorePassword(string username, string password)
        {
            File.WriteAllText($"{username}_password.txt", password);
        }

        // Vulnerability: Logging Sensitive Data
        static void LogError(string errorMessage)
        {
            Console.WriteLine($"Error: {errorMessage}");
        }

        // Vulnerability: XSS Simulation
        static string DisplayUserInput(string userInput)
        {
            return userInput; // In a real app, this should be properly escaped
        }
    }
}
