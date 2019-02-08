package com.heb12.heb12;

import android.content.Context;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.util.Log;
import android.webkit.WebView;
import android.app.Activity;
import android.os.Build;
import android.view.View;
import android.webkit.JavascriptInterface;
import android.webkit.ValueCallback;
import android.webkit.WebViewClient;
import android.widget.Toast;
import java.io.File;
import java.io.*;
import java.io.FileOutputStream;
import android.content.ClipboardManager;
import android.content.ClipData;
import android.os.Environment;
import java.io.ObjectOutputStream;


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
        }
    }

    // Update settings --- toasty code: Toast.makeText(MainActivity.this, "foo", Toast.LENGTH_SHORT).show();
    private class JavaScriptInterface {
        @JavascriptInterface
        public void exec(String type, String data) {
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
            }
        }
    }
}
