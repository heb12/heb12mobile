package com.heb12.heb12;

import android.content.Context;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
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

import android.content.ClipboardManager;
import android.content.ClipData;
import android.os.Environment;

public class MainActivity extends AppCompatActivity {

    private WebView view;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        boolean firstTime = false;

        // Create Heb12 config file
        File config = new File(Environment.getExternalStorageDirectory(), "Heb12Config");
        try {

            // Create config file if it doesn't already exist
            if (!config.exists()) {
                config.createNewFile();
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

            String content = new String(bytes);

            // Load the files in the webview
            WebView view = (WebView) findViewById(R.id.WebView);
            view.getSettings().setJavaScriptEnabled(true);

            view.loadUrl("file:///android_asset/index.html?[\"" + firstTime + "\",`" + content + "`]");
            getSupportActionBar().hide();

            // Add a Javascript interface
            view.addJavascriptInterface(new JavaScriptInterface(), "interface");


        } catch (IOException e) {

            // Turn on storage
            WebView view = (WebView) findViewById(R.id.WebView);
            view.getSettings().setJavaScriptEnabled(true);

            view.loadUrl("file:///android_asset/enableStorage.html");
            getSupportActionBar().hide();

            // Add a Javascript interface
            view.addJavascriptInterface(new JavaScriptInterface(), "interface");

            int MY_PERMISSIONS_REQUEST_WRITE_STORAGE = 1;

            // Here, thisActivity is the current activity
            if (ContextCompat.checkSelfPermission(MainActivity.this,
                    Manifest.permission.WRITE_EXTERNAL_STORAGE)
                    != PackageManager.PERMISSION_GRANTED) {

                // Permission is not granted
                // Should we show an explanation?
                if (ActivityCompat.shouldShowRequestPermissionRationale(MainActivity.this,
                        Manifest.permission.WRITE_EXTERNAL_STORAGE)) {
                    // Show an explanation to the user *asynchronously* -- don't block
                    // this thread waiting for the user's response! After the user
                    // sees the explanation, try again to request the permission.
                } else {
                    // No explanation needed; request the permission
                    ActivityCompat.requestPermissions(MainActivity.this,
                            new String[]{Manifest.permission.WRITE_EXTERNAL_STORAGE},
                            MY_PERMISSIONS_REQUEST_WRITE_STORAGE);

                    // MY_PERMISSIONS_REQUEST_READ_CONTACTS is an
                    // app-defined int constant. The callback method gets the
                    // result of the request.
                }
            } else {
                // Permission has already been granted
            }
        }
    }

    // Update settings --- toasty code: Toast.makeText(MainActivity.this, "foo", Toast.LENGTH_SHORT).show();
    private class JavaScriptInterface {
        private String result;

        @JavascriptInterface
        public String exec(String type, String data) {
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
                File config = new File(Environment.getExternalStorageDirectory(), "Heb12Config");
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

            }

            return type;
        }
    }
}
