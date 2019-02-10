# Heb12 Mobile for Developers
Lorem Imsum blah blah

# How to Build
To run and debug Heb12 Mobile, you will need to download and install Android Studio. You can find the website over [here](https://developer.android.com/studio/).

First, you must download the [source](https://github.com/heb12/heb12-mobile/archive/master.zip) from Github and unzip it in

*unfinished*

# Modifying
There are 2 main parts of Heb12 Mobile, one is the main bible interface, which is made in Html5. The other part, which was written in Java, loads the Html5 files into an webview and also acts as a bridge between the JS and the Java code. 
Using the JS interface is pretty simple. The folling JS code would make a toast (small feedback message) from the javascript.js file:

`interface.exec("toast", "Hello, World!");`
