using Microsoft.AspNetCore.Mvc;
using System.Data.SqlClient;
using System.Diagnostics;
using System.Runtime.Serialization.Formatters.Binary;
using System.Text;
using System.Xml;
using System.Net;
using Microsoft.AspNetCore.Authorization;
using System.Runtime.InteropServices;

namespace VulnerableApp.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class VulnerableController : ControllerBase
    {
        // CWE-798: Hard-coded Credentials
        private const string ConnectionString = "Server=myserver;Database=mydb;User Id=admin;Password=admin123;";
        private const string AdminPassword = "admin123";

        private readonly ILogger<VulnerableController> _logger;

        public VulnerableController(ILogger<VulnerableController> logger)
        {
            _logger = logger;
        }

        // CWE-79: Cross-Site Scripting (XSS)
        [HttpGet("xss")]
        public ContentResult Xss([FromQuery] string userInput)
        {
            // Dangerous: Direct HTML injection
            return new ContentResult
            {
                ContentType = "text/html",
                Content = $"<div>{userInput}</div>"
            };
        }

        // CWE-89: SQL Injection
        [HttpGet("users")]
        public IActionResult GetUser(string username)
        {
            using (var connection = new SqlConnection(ConnectionString))
            {
                connection.Open();
                // Dangerous: Direct SQL concatenation
                using (var command = new SqlCommand($"SELECT * FROM Users WHERE Username = '{username}'", connection))
                {
                    var reader = command.ExecuteReader();
                    // Process results...
                    return Ok("Query executed");
                }
            }
        }

        // CWE-22: Path Traversal
        [HttpGet("file")]
        public IActionResult GetFile(string filename)
        {
            // Dangerous: No path validation
            var path = Path.Combine("files", filename);
            var content = System.IO.File.ReadAllText(path);
            return Ok(content);
        }

        // CWE-78: OS Command Injection
        [HttpGet("execute")]
        public IActionResult ExecuteCommand(string command)
        {
            // Dangerous: Direct command execution
            var process = new Process
            {
                StartInfo = new ProcessStartInfo
                {
                    FileName = "cmd.exe",
                    Arguments = $"/C {command}",
                    RedirectStandardOutput = true,
                    UseShellExecute = false,
                    CreateNoWindow = true
                }
            };
            process.Start();
            var output = process.StandardOutput.ReadToEnd();
            process.WaitForExit();
            return Ok(output);
        }

        // CWE-434: Unrestricted File Upload
        [HttpPost("upload")]
        public async Task<IActionResult> Upload(IFormFile file)
        {
            // Dangerous: No file type validation
            var filePath = Path.Combine("uploads", file.FileName);
            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }
            return Ok("File uploaded successfully");
        }

        // CWE-502: Deserialization of Untrusted Data
        [HttpPost("deserialize")]
        public IActionResult Deserialize([FromBody] byte[] data)
        {
            // Dangerous: Unsafe deserialization
            using (var ms = new MemoryStream(data))
            {
                var bf = new BinaryFormatter();
#pragma warning disable SYSLIB0011
                var obj = bf.Deserialize(ms);
#pragma warning restore SYSLIB0011
                return Ok(obj);
            }
        }

        // CWE-200: Information Exposure
        [HttpGet("debug")]
        public IActionResult Debug()
        {
            // Dangerous: Exposing sensitive information
            var info = new
            {
                ConnectionString,
                AdminPassword,
                Environment.GetEnvironmentVariables(),
                System.Runtime.InteropServices.RuntimeInformation.OSDescription
            };
            return Ok(info);
        }

        // CWE-918: Server-Side Request Forgery (SSRF)
        [HttpGet("fetch")]
        public async Task<IActionResult> FetchUrl(string url)
        {
            // Dangerous: No URL validation
            using (var client = new HttpClient())
            {
                var response = await client.GetStringAsync(url);
                return Ok(response);
            }
        }

        // CWE-787 & CWE-125: Out-of-bounds Write/Read
        [HttpGet("buffer")]
        public unsafe IActionResult UnsafeBuffer()
        {
            // Dangerous: Buffer overflow
            byte[] source = new byte[20];
            fixed (byte* ptr = source)
            {
                byte* destination = ptr - 10; // Dangerous: Writing outside bounds
                Buffer.MemoryCopy(ptr, destination, 20, 30);
            }
            return Ok("Buffer operation completed");
        }

        // CWE-476: NULL Pointer Dereference
        [HttpGet("nullpointer")]
        public IActionResult NullPointer()
        {
            string str = null;
            // Dangerous: Null pointer dereference
            return Ok(str.ToLower());
        }

        // CWE-190: Integer Overflow
        [HttpGet("calculate")]
        public IActionResult Calculate(int input)
        {
            // Dangerous: No overflow checking
            int result = input * input * input * input;
            return Ok(result);
        }

        // CWE-400: Uncontrolled Resource Consumption
        [HttpGet("resource")]
        public IActionResult ConsumeResources()
        {
            var list = new List<byte[]>();
            // Dangerous: Memory exhaustion
            while (true)
            {
                list.Add(new byte[1024 * 1024]);
            }
        }

        // CWE-94: Code Injection
        [HttpGet("eval")]
        public IActionResult EvaluateCode(string code)
        {
            // Dangerous: Code execution
            var result = Microsoft.CodeAnalysis.CSharp.Scripting.CSharpScript.EvaluateAsync(code).Result;
            return Ok(result);
        }

        // CWE-306: Missing Authentication
        [HttpGet("admin")]
        [AllowAnonymous]
        public IActionResult AdminPanel()
        {
            // Dangerous: No authentication check
            return Ok("Welcome to admin panel");
        }

        // CWE-352: Cross-Site Request Forgery (CSRF)
        [HttpPost("transfer")]
        [IgnoreAntiforgeryToken]
        public IActionResult TransferMoney(string to, decimal amount)
        {
            // Dangerous: No CSRF protection
            return Ok($"Transferred ${amount} to {to}");
        }

        // CWE-862: Missing Authorization
        [HttpGet("user/{id}")]
        public IActionResult GetUserData(string id)
        {
            // Dangerous: No authorization check
            return Ok($"User data for ID: {id}");
        }

        // CWE-269: Improper Privilege Management
        [HttpPost("elevate")]
        public IActionResult ElevatePrivileges()
        {
            // Dangerous: No privilege validation
            HttpContext.Session.SetString("Role", "Admin");
            return Ok("Privileges elevated");
        }
    }

    // Additional vulnerable class for memory-related vulnerabilities
    public class UnsafeMemoryOperations
    {
        // CWE-416: Use After Free demonstration
        [DllImport("kernel32.dll")]
        private static extern IntPtr HeapAlloc(IntPtr hHeap, uint dwFlags, UIntPtr dwBytes);

        [DllImport("kernel32.dll")]
        private static extern bool HeapFree(IntPtr hHeap, uint dwFlags, IntPtr lpMem);

        [DllImport("kernel32.dll")]
        private static extern IntPtr GetProcessHeap();

        public unsafe void DemonstrateUseAfterFree()
        {
            IntPtr heap = GetProcessHeap();
            IntPtr memory = HeapAlloc(heap, 0, new UIntPtr(100));
            
            // Free the memory
            HeapFree(heap, 0, memory);
            
            // Dangerous: Use after free
            byte* ptr = (byte*)memory.ToPointer();
            *ptr = 42; // Accessing freed memory
        }
    }

    // Program.cs additions for vulnerability demonstration
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Add services to the container.
            builder.Services.AddControllers();
            
            // Dangerous: Disable CSRF protection globally
            builder.Services.AddControllersWithViews(options =>
            {
                options.Filters.Add(new IgnoreAntiforgeryTokenAttribute());
            });

            // Add session support for privilege management demo
            builder.Services.AddSession();

            var app = builder.Build();

            // Dangerous: Disable CORS
            app.UseCors(x => x.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader());

            app.UseAuthorization();
            app.UseSession();
            app.MapControllers();

            app.Run();
        }
    }
}
