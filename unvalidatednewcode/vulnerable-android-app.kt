// MainActivity.kt
package com.example.vulnerableapp

import android.Manifest
import android.content.Intent
import android.os.Bundle
import android.webkit.WebView
import android.webkit.WebViewClient
import androidx.appcompat.app.AppCompatActivity
import android.database.sqlite.SQLiteDatabase
import android.util.Log
import java.io.*
import javax.crypto.Cipher
import javax.crypto.spec.SecretKeySpec
import android.content.Context
import android.net.Uri
import android.os.Environment
import okhttp3.OkHttpClient
import okhttp3.Request
import org.json.JSONObject
import java.util.Base64
import kotlin.concurrent.thread

class MainActivity : AppCompatActivity() {
    // CWE-798: Hard-coded Credentials
    companion object {
        private const val API_KEY = "1234567890abcdef"
        private const val ENCRYPTION_KEY = "hardcodedkey12345"
        private const val DB_PASSWORD = "admin123"
    }

    private lateinit var db: SQLiteDatabase
    private val client = OkHttpClient()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)
        initializeDatabase()
    }

    // CWE-89: SQL Injection
    private fun queryUser(username: String) {
        // Dangerous: Direct string concatenation in SQL
        val query = "SELECT * FROM users WHERE username = '$username'"
        db.rawQuery(query, null)
    }

    // CWE-79: Cross-site Scripting (XSS)
    private fun displayUserContent(content: String) {
        val webView = WebView(this)
        webView.settings.javaScriptEnabled = true
        // Dangerous: Direct HTML/JavaScript injection
        webView.loadData(content, "text/html", "UTF-8")
    }

    // CWE-200: Information Exposure
    private fun logSensitiveInfo() {
        // Dangerous: Logging sensitive information
        Log.d("API_KEY", API_KEY)
        Log.d("DB_PASSWORD", DB_PASSWORD)
        Log.d("DEVICE_INFO", android.os.Build.FINGERPRINT)
    }

    // CWE-312: Cleartext Storage of Sensitive Information
    private fun storeCredentials(username: String, password: String) {
        // Dangerous: Storing sensitive data in cleartext
        val sharedPref = getSharedPreferences("auth", Context.MODE_PRIVATE)
        with(sharedPref.edit()) {
            putString("username", username)
            putString("password", password)
            apply()
        }
    }

    // CWE-330: Use of Insufficiently Random Values
    private fun generateToken(): String {
        // Dangerous: Using predictable random values
        return System.currentTimeMillis().toString()
    }

    // CWE-494: Download of Code Without Integrity Check
    private fun downloadAndLoadDex(url: String) {
        // Dangerous: Loading code without verification
        val dexFile = File(cacheDir, "downloaded.dex")
        URL(url).openStream().use { input ->
            FileOutputStream(dexFile).use { output ->
                input.copyTo(output)
            }
        }
        // Load DEX without verification
        val classLoader = dalvik.system.DexClassLoader(
            dexFile.absolutePath,
            cacheDir.absolutePath,
            null,
            classLoader
        )
    }

    // CWE-22: Path Traversal
    private fun readFileContent(filename: String): String {
        // Dangerous: No path validation
        val file = File(getExternalFilesDir(null), filename)
        return file.readText()
    }

    // CWE-78: OS Command Injection
    private fun executeCommand(command: String) {
        // Dangerous: Direct command execution
        Runtime.getRuntime().exec(command)
    }

    // CWE-287: Improper Authentication
    private fun authenticateUser(username: String, password: String): Boolean {
        // Dangerous: Weak authentication
        return password.length > 3
    }

    // CWE-434: Unrestricted File Upload
    private fun saveFile(uri: Uri) {
        // Dangerous: No file type validation
        contentResolver.openInputStream(uri)?.use { input ->
            File(getExternalFilesDir(null), "uploaded_file").outputStream().use { output ->
                input.copyTo(output)
            }
        }
    }

    // CWE-502: Deserialization of Untrusted Data
    private fun deserializeData(data: String) {
        // Dangerous: Unsafe deserialization
        val bytes = Base64.getDecoder().decode(data)
        ObjectInputStream(ByteArrayInputStream(bytes)).readObject()
    }

    // CWE-918: Server-Side Request Forgery (SSRF)
    private fun fetchUrl(url: String) {
        // Dangerous: No URL validation
        thread {
            val request = Request.Builder().url(url).build()
            client.newCall(request).execute()
        }
    }

    // CWE-94: Code Injection
    private fun evaluateJavaScript(code: String) {
        val webView = WebView(this)
        webView.settings.javaScriptEnabled = true
        // Dangerous: Executing arbitrary JavaScript
        webView.evaluateJavascript(code, null)
    }

    // CWE-269: Improper Privilege Management
    private fun elevatePrivileges() {
        // Dangerous: No privilege validation
        requestPermissions(arrayOf(
            Manifest.permission.WRITE_EXTERNAL_STORAGE,
            Manifest.permission.READ_CONTACTS,
            Manifest.permission.ACCESS_FINE_LOCATION
        ), 0)
    }

    // CWE-295: Improper Certificate Validation
    private fun setupInsecureConnection() {
        // Dangerous: Disabling SSL/TLS verification
        val unsafeClient = OkHttpClient.Builder()
            .hostnameVerifier { _, _ -> true }
            .build()
    }

    // CWE-319: Cleartext Transmission of Sensitive Information
    private fun sendCredentials(username: String, password: String) {
        // Dangerous: Sending sensitive data over HTTP
        val url = "http://example.com/login?username=$username&password=$password"
        thread {
            val request = Request.Builder().url(url).build()
            client.newCall(request).execute()
        }
    }

    // CWE-326: Inadequate Encryption Strength
    private fun encryptData(data: String): String {
        // Dangerous: Using weak encryption
        val key = SecretKeySpec(ENCRYPTION_KEY.toByteArray(), "AES")
        val cipher = Cipher.getInstance("AES/ECB/PKCS5Padding")
        cipher.init(Cipher.ENCRYPT_MODE, key)
        return Base64.getEncoder().encodeToString(cipher.doFinal(data.toByteArray()))
    }

    // CWE-601: URL Redirection to Untrusted Site
    private fun redirectToUrl(url: String) {
        // Dangerous: No validation of redirect URL
        startActivity(Intent(Intent.ACTION_VIEW, Uri.parse(url)))
    }

    private fun initializeDatabase() {
        db = openOrCreateDatabase("app.db", Context.MODE_PRIVATE, null)
        db.execSQL("""
            CREATE TABLE IF NOT EXISTS users (
                username TEXT,
                password TEXT
            )
        """)
    }
}

// AndroidManifest.xml additions for demonstration
<!--
<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.example.vulnerableapp">

    <!-- Dangerous: Excessive permissions -->
    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
    <uses-permission android:name="android.permission.READ_CONTACTS" />
    <uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
    <uses-permission android:name="android.permission.CAMERA" />
    
    <!-- Dangerous: Allowing backup -->
    <application
        android:allowBackup="true"
        android:debuggable="true"
        android:usesCleartextTraffic="true">
        
        <!-- Dangerous: Exported activities -->
        <activity
            android:name=".MainActivity"
            android:exported="true">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
    </application>
</manifest>
-->
