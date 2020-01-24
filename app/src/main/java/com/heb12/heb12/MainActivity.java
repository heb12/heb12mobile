package com.heb12.heb12;

import android.content.Context;
import android.net.Uri;
import android.os.Build;
import android.support.annotation.RequiresApi;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.util.Log;
import android.webkit.WebView;
import android.webkit.JavascriptInterface;
import android.widget.Toast;
import android.content.Intent;
import android.Manifest;
import android.content.pm.PackageManager;
import android.support.v4.app.ActivityCompat;
import android.support.v4.content.ContextCompat;
import java.io.File;
import java.io.*;
import java.io.FileOutputStream;
import android.os.*;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.webkit.WebSettings;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.content.ClipboardManager;
import android.content.ClipData;
import android.os.Environment;
import java.net.URI;

public class MainActivity extends AppCompatActivity {

    private WebView view;

    @RequiresApi(api = Build.VERSION_CODES.KITKAT)
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        boolean firstTime = false;

        // Directory and config file change (Jan 2019)
        // Detect if /Heb12 exists and Heb12config exists at the same time. If not, create it, and move files
        File heb12 = new File(Environment.getExternalStorageDirectory() + "/Heb12");
        File configCheck = new File(Environment.getExternalStorageDirectory(), "/Heb12Config");
        if (!heb12.isDirectory() && configCheck.exists()) {
            heb12.mkdir();

            // Make heb12/translations folder
            File heb12translations = new File(Environment.getExternalStorageDirectory() + "/Heb12/translations");
            heb12translations.mkdir();

            // Move config file
            File configNew = new File(Environment.getExternalStorageDirectory(), "Heb12/Heb12Config");
            configCheck.renameTo(configNew);

            // Android studio can't move entire directories, so we will move each translation file
            String path = Environment.getExternalStorageDirectory().toString() + "/translations";
            File directory = new File(path);
            File[] files = directory.listFiles();

            for (int i = 0; i < files.length; i++) {
                File translation = new File(Environment.getExternalStorageDirectory(), "/translations/" + files[i].getName());

                // Read file
                int length = (int) translation.length();
                byte[] bytes = new byte[length];

                try {
                    FileInputStream ready = new FileInputStream(translation);
                    try {
                        ready.read(bytes);
                    } finally {
                        ready.close();
                    }
                } catch (Exception e) {
                    Toast.makeText(MainActivity.this, "1Error: " + e, Toast.LENGTH_SHORT).show();
                }

                // Get final read result
                String translationData = new String(bytes);

                // Create identical file in /heb12/translations
                File newTranslation = new File(Environment.getExternalStorageDirectory(), "/Heb12/translations/" + files[i].getName());
                try {
                    newTranslation.createNewFile();
                } catch (IOException e) {
                    Toast.makeText(MainActivity.this, "2Error: " + e, Toast.LENGTH_SHORT).show();
                }

                // Attempt to write to file
                try {
                    FileOutputStream stream = new FileOutputStream(newTranslation);
                    stream.write(translationData.getBytes());
                    stream.close();
                } catch (IOException e) {
                    Toast.makeText(MainActivity.this, "2Error: " + e, Toast.LENGTH_SHORT).show();
                }
            }
        } else {
            // If new user
            heb12.mkdir();
        }

        // Create Heb12 config file
        File config = new File(Environment.getExternalStorageDirectory(), "/Heb12/Heb12Config");
        File translationDir = new File(Environment.getExternalStorageDirectory() + "/Heb12/translations");
        try {

            setContentView(R.layout.activity_main);

            // Create config file if it doesn't already exist
            if (!config.exists()) {
                config.createNewFile();
                translationDir.mkdirs();
                firstTime = true;
            }


            // Read file and send it to the WebView
            int length = (int) config.length();
            byte[] bytes = new byte[length];

            FileInputStream reader = new FileInputStream(config);
            try {
                reader.read(bytes);
            } finally {
                reader.close();
            }

            // Ignore Android Studio; this code is good
            String content = new String(bytes);

            // Load the files in the webview
            WebView view = findViewById(R.id.WebView);

            // Make sure nothing will explode
            WebSettings webSettings = view.getSettings();
            webSettings.setJavaScriptEnabled(true);
            webSettings.setDomStorageEnabled(true);
            webSettings.setLoadWithOverviewMode(true);
            webSettings.setDefaultTextEncodingName("utf-8");
            WebView.setWebContentsDebuggingEnabled(true);
            view.setWebViewClient(new WebViewClient());

            // Send data through URL (send differently according if firstTime or not)
            if (firstTime) {
                view.loadUrl("file:///android_asset/index.html?[\"" + firstTime + "\"]");
            } else {
                view.loadUrl("file:///android_asset/index.html?[\"" + firstTime + "\"," + content + "]");
            }
            getSupportActionBar().hide();

            // Add a Javascript interface
            view.addJavascriptInterface(new JavaScriptInterface(), "interface");


        } catch (IOException e) {

            // Turn on storage
            WebView view = findViewById(R.id.WebView);
            view.getSettings().setJavaScriptEnabled(true);

            view.loadUrl("file:///android_asset/enableStorage.html");
            getSupportActionBar().hide();

            // Add a Javascript interface
            view.addJavascriptInterface(new JavaScriptInterface(), "interface");

            int MY_PERMISSIONS_REQUEST_WRITE_STORAGE = 1;

            // I stole this code from Google, that's why there are comments everywhere
            if (ContextCompat.checkSelfPermission(MainActivity.this,
                    Manifest.permission.WRITE_EXTERNAL_STORAGE)
                    != PackageManager.PERMISSION_GRANTED) {

                // Permission is not granted
                // Should we show an explanation? No
                if (ActivityCompat.shouldShowRequestPermissionRationale(MainActivity.this,
                        Manifest.permission.WRITE_EXTERNAL_STORAGE)) {
                    // Show an explanation to the user *jimmybob200* -- don't block
                    // this thread waiting for the user's response! After the user
                    // sees the explanation, try again to request the permission.
                } else {
                    // No explanation needed; request the permission
                    ActivityCompat.requestPermissions(MainActivity.this,
                            new String[]{Manifest.permission.WRITE_EXTERNAL_STORAGE},
                            MY_PERMISSIONS_REQUEST_WRITE_STORAGE);
                }
            } else {
                // Permission has already been granted, all of that crap was useless
            }
        }


    }

    // Update settings
    private class JavaScriptInterface {
        private String result;

        // This is the Javascript-Java interface. This is where the JavaScript code
        // can communicate with the Java stuff, such as file management.

        @JavascriptInterface
        public String exec(String type, String data) throws IOException {
            if (type.equals("other")) {

                if (data.equals("close")) {
                    finish();
                }

            } else if (type.equals("copy")) {

                // Copy text to clipboard
                ClipboardManager clipboard = (ClipboardManager) getSystemService(Context.CLIPBOARD_SERVICE);
                ClipData clip = ClipData.newPlainText("Verse Copied", data);
                clipboard.setPrimaryClip(clip);

            } else if (type.equals("write")) {

                // Function to update the config file
                File config = new File(Environment.getExternalStorageDirectory(), "/Heb12/Heb12Config");
                try {
                    FileOutputStream stream = new FileOutputStream(config);
                    stream.write(data.getBytes());
                    stream.close();
                } catch (IOException e) {
                    Toast.makeText(MainActivity.this, "Configuration file not found", Toast.LENGTH_SHORT).show();
                }

            } else if (type.equals("share")) {

                Intent myIntent = new Intent(Intent.ACTION_SEND);
                myIntent.setType("text/plain");
                String shareBody = data;
                myIntent.putExtra(Intent.EXTRA_TEXT,shareBody);
                startActivity(Intent.createChooser(myIntent, "Share using"));

            } else if (type.equals("toast")) {

                Toast.makeText(MainActivity.this, data, Toast.LENGTH_SHORT).show();

            } else if (type.startsWith("makefile")) {

                // Try to get name
                String[] separated = type.split(" ");
                String name = separated[1];

                // Create File
                File file = new File("/sdcard/Heb12/translations", name);
                try {
                    file.createNewFile();
                } catch (IOException e) {
                    e.printStackTrace();
                }

                // Write to File
                try {
                    FileOutputStream stream = new FileOutputStream(file);
                    stream.write(data.getBytes());
                    stream.close();
                } catch (IOException e) {
                    Toast.makeText(MainActivity.this, "Configuration file not found", Toast.LENGTH_SHORT).show();
                }
            } else if (type.equals("gettranslations")) {
                String path = Environment.getExternalStorageDirectory().toString() + "/Heb12/translations";
                File directory = new File(path);
                File[] files = directory.listFiles();

                String back = "";

                // Turn it into a JS thingy
                for (int i = 0; i < files.length; i++) {
                    String comma = "";
                    if (i != files.length - 1) {
                        comma = ",";
                    }

                    String name = files[i].getName();
                    back += name + comma;
                }

                // Shove it in the webview
                try {
                    return back;
                } catch (Exception e) {
                    Toast.makeText(MainActivity.this, "Error 1", Toast.LENGTH_SHORT).show();
                }
            } else if (type.equals("test")) {
                try {
                    final WebView view = findViewById(R.id.WebView);
                    view.post(new Runnable() {
                        @Override
                        public void run() {
                            view.loadUrl("javascript:random()");
                        }
                    });
                } catch (Exception e) {
                    Toast.makeText(MainActivity.this, "Error 2" + e, Toast.LENGTH_SHORT).show();
                }
            } else if (type.equals("gettranslationdata")) {
                File file = new File("/sdcard/Heb12/translations", data);

                // Read file
                int length = (int) file.length();
                byte[] bytes = new byte[length];

                try {
                    FileInputStream ready = new FileInputStream(file);
                    try {
                        ready.read(bytes);
                    } finally {
                        ready.close();
                    }
                } catch (Exception e) {
                    Toast.makeText(MainActivity.this, "Error 3 " + data, Toast.LENGTH_SHORT).show();
                }

                // Add translation to JS
                String translation = new String(bytes);

                return translation;
            } else if (type.equals("deletetranslation")) {
                File file = new File("/sdcard/Heb12/translations", data);
                file.delete();
            } else if (type.equals("browser")) {
                Intent browserIntent = new Intent(Intent.ACTION_VIEW, Uri.parse(data));
                startActivity(browserIntent);
            }

            return type;
        }
    }
}
// I wonder if anybody will see this... oh well