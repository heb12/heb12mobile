// Session Variables
var session = {
	version:"1.3",
	breaksAfterVerse:1,
	mouseDown:false,
	titleClicks:0,
	currentVerse:"Hmmmm.",
	currentTranslation:"",
	currentTranslationString:"",
	theme:"",
	devmode:false,
	currentBookNumber:57,
	currentTheme:"Default",
	loadedTranslations:[],
	netjsondata:"foo",
	doneLoadingJSON:false,
	netTextData:"foo",
	numberThingy:0,
	loadedScript:false,
	loadedScriptData:"foo",
	currentFont:"Arial",
	highlightedVerses:{
		John_3_16:"yellow",
		Hebrews_4_12:"lightgreen"
	},
	currentFontSize:18
}

var data;

// When the page loads
window.onload = function() {
	document.getElementById('loadingMessage').style.display = "none";

	// Fill the selects
	for (var i = 0; i < books.length; i++) {
		document.getElementById('book').innerHTML += "<option>" + books[i] + "</option>";
	}

	for (var i = 1; i <= 55; i++) {
		document.getElementById('chapter').innerHTML += "<option>" + i + "</option>";
	}

	// A simple solution to the devmode problem :-)
	if (!window.location.href.includes("?")) {
		session.devmode = true;
	} else {
		session.devmode = false;
	}

	// Do some things if the viewer is on safari on iOS
	if (/iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream) {
		session.devmode = true;
	}

	// Load data
	if (!session.devmode) {
		// Open data
		data = window.location.href.split("?")[1];
		data = data.replace(/%22/g, '"');
		data = data.replace(/%20/g, " ");
		data = eval(data);

		// If loading the app for the first time.
		if (data[0] == "true") {
			notify("firsttime");

			// Load the default config file
			updateConfigFile("def");
		}	

		// Parse config file into JS
		if (!data[1] == "") {
			var configuration = data[1];
			configuration = configuration.replace(/\/\*[A-Za-z0-9 -!.:]+\*\//g, "");
			configuration = configuration.split(";");
			document.getElementById('book').value = configuration[1].split("=")[1];
			document.getElementById('chapter').value = configuration[2].split("=")[1];

			session.currentTheme = configuration[3].split("=")[1];
			session.currentFont = configuration[4].split("=")[1];
			session.currentFontSize = Number(configuration[6].split("=")[1]);

			document.getElementById('page').style.fontSize = session.currentFontSize + "px";
			document.getElementById('page').style.lineHeight = (session.currentFontSize + 7) + "px";
			document.getElementById('page').style.fontFamily = session.currentFont;
			//setFont(configuration[4].split("=")[1]);
			session.currentTranslationString = configuration[0].split("=")[1];
			setTheme(configuration[3].split("=")[1]);
			session.highlightedVerses = JSON.parse(configuration[5].split("=")[1].split(","));

		}
	}

	// load Hebrews 4
	updateTranslation();

	// Use special methods to use script only when it is loaded
	var waitUntilLoad = setInterval(function() {
		if (eval('typeof ' + session.currentTranslationString.toLowerCase() + ' !== "undefined"')) {
			if (session.devmode) {
				document.getElementById('page').innerHTML = load("Hebrews", 4);
			} else {
				document.getElementById('page').innerHTML = load(document.getElementById('book').value, document.getElementById('chapter').value);
			}
			update();
			clearInterval(waitUntilLoad);
		}
	}, 10);

	document.getElementById("book").value = "Hebrews";
	document.getElementById("chapter").value = "4";

	// Load verse of the day
	loadJSONP("http://labs.bible.org/api/?passage=votd&type=json&callback=getScript");
	var waitUntilLoad2 = setInterval(function() {
		if (session.loadedScript) {
			var waitUntilLoad3 = setInterval(function() {
				if (session.loadedScript) {
					var theVerse = session.loadedScriptData[0].text.replace('<a style="" target="_blank" href="http://netbible.com/net-bible-preface">&copy;NET</a>', "");
					theVerse = "<b>" + session.loadedScriptData[0].bookname + " " + session.loadedScriptData[0].chapter + ":" + session.loadedScriptData[0].verse + "</b> - " + theVerse;
					document.getElementById('votd').innerHTML = theVerse;
					clearInterval(waitUntilLoad3);
				}
			}, 1);
			clearInterval(waitUntilLoad2);
		}
	}, 10);

}

// Function to get verse or verses from the json files
function load(book, chapter, verse) {
	var breaks = "<br>".repeat(session.breaksAfterVerse);
	document.getElementById('chapter').innerHTML = "";

	var bookNum;
	for (var i = 0; i < books.length; i++) {
		if (books[i] == book) {
			bookNum = i;
			session.currentBookNumber = i;
		}
	}


	// Openbibles parser and the other json files
	if (isOpenbibles()) {

		// Make accurate chapter length
		for (var i = 1; i <= bible[bookNum][2]; i++) {
			document.getElementById('chapter').innerHTML += "<option>" + i + "</option>";
		}

		document.getElementById('book').value = book;
		document.getElementById('chapter').value = chapter;

		// 1 Chapter books
		var verses;
		if (!session.currentTranslation.osis.osisText.div[bookNum].chapter.verse) {
			verses = session.currentTranslation.osis.osisText.div[bookNum].chapter[chapter - 1].verse;
		} else {
			document.getElementById('chapter').innerHTML = "<option>1</option>";
			verses = session.currentTranslation.osis.osisText.div[bookNum].chapter.verse;
		}

		// Add html to verses or return just a verse
		var page = "";
		if (!isNaN(verse)) {
			page = verses[verse].text;
		} else {
			for (var i = 0; i < verses.length; i++) {
				page += modifyVerse(i + 1, verses[i].text);
			}
		}

		page = page.replace(/\[/g, "");
		page = page.replace(/\]/g, "");

		return page;
	} else if (session.currentTranslationString == "netOnline") {

		for (var i = 1; i <= bible[session.currentBookNumber][2]; i++) {
			document.getElementById('chapter').innerHTML += "<option>" + i + "</option>";
		}

		document.getElementById('book').value = book;
		document.getElementById('chapter').value = chapter;

		var netjson = document.createElement("SCRIPT");
		netjson.type = "text/javascript";

		if (!isNaN(verse)) {
			netjson.src = "http://labs.bible.org/api/?passage=" + book + " " + chapter + ":" + verse + "&type=json&callback=getNET";
		} else {
			netjson.src = "http://labs.bible.org/api/?passage=" + book + " " + chapter + "&type=json&callback=getNET&&formatting=full";
		}

		netjson.id = "netjson";
		document.getElementsByTagName('head')[0].appendChild(netjson);

		netjson.onload = function() {
			var finaldata = "";
			if (isNaN(verse)) {
				for (var i = 0; i < session.netjsondata.length; i++) {
					if (!(!session.netjsondata[i].title)) {
						finaldata += "<h3>" + session.netjsondata[i].title + "</h3>";
					}

					finaldata += modifyVerse(i, session.netjsondata[i].text);
				}
			} else {
				console.log(verse);
				finaldata = session.netjsondata[0].text;
			}

			session.doneLoadingJSON = true;
			session.netTextData = finaldata;
		}
	} else {

		var page;
		var booky;

		// Get chapter data
		for (var i = 0; i < books.length; i++) {
			if (books[i] == book) {
				page = session.currentTranslation[i].chapters[chapter - 1];
				booky = session.currentTranslation[i].chapters.length;
				session.currentBookNumber = i;
			}
		}

		// Make accurate chapter length
		for (var i = 1; i <= booky; i++) {
			document.getElementById('chapter').innerHTML += "<option>" + i + "</option>";
		}

		document.getElementById('book').value = book;
		document.getElementById('chapter').value = chapter;
		
		var finalResult = "";

		// Return verse or verses
		if (isNaN(verse)) {
			for (var i = 0; i < page.length; i++) {
				finalResult += modifyVerse(i, page[i]);
			}
		} else {
			finalResult = page[verse - 1];
		}

		// Remove wierd things inserted inside text in Offline KJV version
		finalResult = finalResult.replace(/\{[a-zA-Z0-9 .,;]+: or, [a-zA-Z0-9 .,;]+\}/g, "");
		finalResult = finalResult.replace(/\}/g, "");
		finalResult = finalResult.replace(/\{/g, "");
		finalResult = finalResult.replace(/\.\.\./g, "");

		return finalResult;
	}
}

// Notify function - can only be used once at a time.
function notify(text) {

	popupAnimation("show");
	var popup = document.getElementById('popupContent');
	
	if (text == "firsttime") {
		popup.innerHTML = `
		<h2>Welcome to Heb12!</h2>
		<p>Heb12 Mobile is a free open-sourced app designed to make reading the Bible easy and hassle-free. If you would like to contribute or give feedback, please visit the&nbsp;<a href="https://github.com/heb12/heb12-mobile" target="_blank" rel="noopener">Github repository</a>.</p>
		<p><strong>Pro Tip: Tap on a bible verse for a list of extra actions.</strong></p>`;
	} else if (text == "settings") {
		popup.innerHTML = `
		<h2>Settings</h2>
		<span class='textBesideSelect'>Theme:</span>
		<select id='themeSelect' onchange="setTheme(this.value)">
			<option>Default</option>
			<option>Dark</option>
			<option>Dark Blue</option>
		</select>
		<br>
		<p id="fontPreview">The big brown fox jumps over the lazy dog.</p>
		<span class='textBesideSelect'>Theme:</span>
		<select id='fontSelect' onchange="setFont(this.value)">
			<option>Times New Roman</option>
			<option>Arial</option>
			<option>Comfortaa</option>
			<option>Helvetica</option>
			<option>Courier New</option>
		</select>
		<br>
		<div>
			<div class='icon' style='float: left' onclick='setFontSize("minus")'>
				<img src="images/left.svg" width="45">
			</div>
			
			<div class='icon' style='float:left'>
				<div style='width: 45px; text-align: center; padding-top: 10px; font-size: 20px;' id='fontSizeSelect'>
					12
				</div>
			</div>

			<div class='icon' style='float: left' onclick='setFontSize("plus")'>
				<img src="images/right.svg" width="45">
			</div>
		</div>
		<br>
		<br>


		<p>This will reset all your saved data. When reset the app, it will close so you can re-launch it.</p>
		<br>
		<div class='button bg' onclick='updateConfigFile("def"); interface.exec("other", "close")'>
			Reset
		</div>
		`;

		document.getElementById('page').style.fontSize = session.currentFontSize + "px";
		document.getElementById('page').style.lineHeight = (session.currentFontSize + 7) + "px";
		document.getElementById('fontPreview').style.fontSize = session.currentFontSize + "px";
		document.getElementById('themeSelect').value = session.currentTheme;
		document.getElementById('fontSelect').value = session.currentFont;
		document.getElementById('fontSizeSelect').innerHTML = session.currentFontSize;
	} else if (text == "info") {
		popup.innerHTML = `
		<img style="display:inline; float:left; margin-right:10px;" src="images/logo.png" width="150">
		<div style="display:inline;">
		   <h2>Heb12 Mobile v1.0</h2>
		   <p>
		   Heb12 Mobile is a free open-sourced app designed to make reading the bible easy and hassle-free. Feel free to contribute to the 
		   <a target="_blank" href="https://github.com/heb12/heb12-mobile">Github repository</a>.
		   </p>
		</div>
		<br>
		<p><a style='color: blue; text-decoration: underline;' onclick="document.getElementById('page').innerHTML = load('Hebrews', 4); notify('verse-12')">Hebrews 4:12</a> - For the word of God is living, and powerful, and sharper than any two-edged sword, piercing even to the dividing asunder of soul and spirit, and of the joints and marrow, and is a discerner of the thoughts and intents of the heart.</p>
		<br>
		<h2>Credits</h2>
		<p>Lead Programmer - Pufflegamerz aka Petabyte Studios</p>
		<p>Openbibles - MasterOfTheTiger</p>
		<p>Material icons - Material.io</p>
		<p>Formatted KJV API - Bible Labs</p>
		<p><a href="https://github.com/thiagobodruk" target="_blank">@thiagobodruk</a> - Offline Bible JSON files</p>`;
	} else if (text == 'hehe') {
		session.titleClicks++
		if (session.titleClicks >= 10) {
			popup.innerHTML = '<h1>You found an easter egg!</h1><p>This popup is very cool. Also you must check out <a href="http://frypup.is-great.net" target="_blank">frypup.is-great.net</a>. It is a website @Pufflegamerz made and it might just be the best one in the world. <br>Also, you <i>need</i> to see this picture of my pet guinea pig:</p><img width="320" src="images/blank.jpg">';
		} else {
			document.getElementsByClassName("popup")[0].style.display = "none";
		}
	} else {
		popup.innerHTML = text;
	}
}

// Visit a random chapter
function random() {
	var randomBook = Math.floor(Math.random() * books.length);
	var randomChapter = Math.floor(Math.random() * session.currentTranslation[randomBook].chapters.length);
	if (randomChapter == 0) {
		randomChapter = 1;
	}

	document.getElementById('page').innerHTML = load(books[randomBook], randomChapter);
	sidebarAnimation("close");
}

// Function to handle page updates
function update(option) {
	var book = document.getElementById('book').value;
	var chapter = Number(document.getElementById('chapter').value);

	updateTranslation();

	// Update book number
	for (var i = 0; i < books.length; i++) {
		if (books[i] == book) {
			session.currentBookNumber = i;
		}
	}

	// If the user goes back at the first chapter of a book, go back to the previous book
	if (option == "next") {
		if (bible[session.currentBookNumber][2] == Number(document.getElementById('chapter').value)) {
			if (book == "Revelation" && chapter == 22) {
				book = "Genesis";
				chapter = 1;
			} else {
				book = books[session.currentBookNumber + 1];
				chapter = 1;
			}
		} else {
			chapter++;
			if (bible[session.currentBookNumber][2] <= chapter) {
				chapter = bible[session.currentBookNumber][2];
			}
		}

	} else if (option == "previous") {
		if (chapter !== 1) {
			chapter--;
		} else {
			book = books[session.currentBookNumber - 1];
			chapter = bible[session.currentBookNumber - 1][2];
		}
	}

	// Get offline data
	if (session.currentTranslationString == "netOnline") {
		load(book, chapter);
		var int = setInterval(function() {
			if (session.doneLoadingJSON) {
				document.getElementById('page').innerHTML = session.netTextData;
				session.doneLoadingJSON = false;
				clearInterval(int);
			}
		},1);
	} else {
		var waitUntilLoad = setInterval(function() {
			if (eval('typeof ' + session.currentTranslationString.toLowerCase() + ' !== "undefined"')) {
				document.getElementById('page').innerHTML = load(book, chapter);
				clearInterval(waitUntilLoad);
			}
		},10);
	}

	// Update the configuration file
	if (!session.devmode) {
		updateConfigFile();
	}
}

// Update the current translation
function updateTranslation() {
	var translation = document.getElementById('translation').value;

	// Check what the selected translation is
	if (translation.startsWith("BBE")) {
		session.currentTranslationString = "BBE";
	} else if (translation.startsWith("KJV 2000")) {
		session.currentTranslationString = "KJV2000";
	} else if (translation.startsWith("KJV") && translation.endsWith("(Offline)")) {
		session.currentTranslationString = "KJV";
	} else if (translation.startsWith("ASV") && translation.endsWith("(Offline)")) {
		session.currentTranslationString = "ASV";
	} else if (translation.startsWith("DBY") && translation.endsWith("(Offline)")) {
		session.currentTranslationString = "DBY";
	} else if (translation.startsWith("NET") && translation.endsWith("(Online)")) {
		session.currentTranslationString = "netOnline";
	}

	// Only load the script if it hasn't loaded yet
	if (!session.loadedTranslations.includes(session.currentTranslationString.toLowerCase())) {
		var script = document.createElement("script");
	    script.src = "bibles/" + session.currentTranslationString.toLowerCase() + ".js";
	    script.type = "text/javascript";
	    script.id = session.currentTranslationString.toLowerCase() + "Script";
		document.getElementsByTagName("head")[0].appendChild(script);
		session.loadedTranslations.push(session.currentTranslationString.toLowerCase());

		script.onload = function() {
			session.currentTranslation = eval(session.currentTranslationString.toLowerCase());
		}
	} else {
		if (!session.currentTranslationString == "netOnline") {
			session.currentTranslation = eval(session.currentTranslationString.toLowerCase());
		}
	}
}

// A simple function to search somthing on Google
function search(thing) {
	window.open("https://www.google.nl/search?q=" + thing);
}

function getNET(data) {
	session.netjsondata = data;
}

// Function to close settings menu
function sidebarAnimation(action) {
	if (action == "close") {
		document.getElementById("sidebar").style.WebkitAnimationName = "slideOut";
		setTimeout(function() {
			document.getElementById('sidebar').style.display = "none";
		},500);
	} else {
		document.getElementById('sidebar').style.display = "block";
		document.getElementById("sidebar").style.WebkitAnimationName = "slideIn";
	}
}

// Popup animation
function popupAnimation(action) {
	var popup = document.getElementsByClassName("popup")[0];
	if (action == "show") {
		popup.style.display = "block";
		popup.style.WebkitAnimationName = "showPopup";
	} else {
		popup.style.WebkitAnimationName = "hidePopup";
		setTimeout(function() {
			popup.style.display = "none";
		},500);
	}
}

// Update the configuration file or return the default
function updateConfigFile(def) {
	var config = "/* Heb12 Configuration File - Edit at your own risk! */";

	// Name, value, default value
	var options = [
		["currentTranslation", session.currentTranslationString, "BBE"],
		["lastBook", document.getElementById('book').value, "Hebrews"],
		["lastChapter", document.getElementById('chapter').value, "12"],
		["theme", session.currentTheme, "Default"],
		["font", session.currentFont, "Arial"],
		["highlightedVerses",JSON.stringify(session.highlightedVerses), "John 3 16 yellow, Hebrews 4 12 lightgreen"],
		["fonSize", session.currentFontSize, "18"]
	];

	// Return a config file or just a default
	if (!def) {
		for (var i = 0; i < options.length; i++) {
			config += options[i][0] + "=" + options[i][1] + ";";
		}
	} else {
		for (var i = 0; i < options.length; i++) {
			config += options[i][0] + "=" + options[i][2] + ";";
		}
	}
	interface.exec("write", config);
}

// Set current theme
function setTheme(theme) {
	if (theme == "Dark") {
		document.getElementById('theme').innerHTML = '<link rel="stylesheet" type="text/css" href="themes/dark.css">';
	} else if (theme == "Default") {
		document.getElementById('theme').innerHTML = '';
	} else if (theme == "Dark Blue") {
		document.getElementById('theme').innerHTML = '<link rel="stylesheet" type="text/css" href="themes/darkblue.css">';
	}

	session.currentTheme = theme;
	sidebarAnimation("close");
	popupAnimation("close");
	update();
}

function setFont(font) {
	document.getElementById('page').style.fontFamily = font;
	document.getElementById('fontPreview').style.fontFamily = font;

	session.currentFont = font;
	update();
}

// Update the search bar or go to the chapter
function updateSearch(searching) {
	var term = document.getElementById('search').value;
	var result = document.getElementById('searchResults');
	if (result.value == "") {
		result.style.display = "none";
	} else {
		result.style.display = "block";
	}

	// Regexp to recongnise books and chapters
	var validate = /[ ]*([a-zA-z0-9 ]+)[: ;-]+([0-9]+)[ ]*/gm;
	var theBook = term.replace(validate,"$1");
	var theChapter = term.replace(validate,"$2");

	var valid = validChapter(theBook + "-" + theChapter);
	if (valid[0]) {
		result.innerHTML = "<span style='color:green;'>" + valid[1] + " " + theChapter + "</span>";
	} else {
		result.innerHTML = "<span style='color:red;'>Not found</span>";
	}

	// If user is searching something
	if (searching == "visit") {
		if (!term == "") {
			sidebarAnimation("close");
			document.getElementById('book').value = valid[1];
			document.getElementById('chapter').value = theChapter;
			update();
			result.style.display = "none";
			document.getElementById('search').value = "";
		}
	}

	switch (term.toLowerCase()) {
		case "hello":
		case "hi":
		case "Hello":
		case "Hi":
			result.innerHTML = "<span style='color:green;'>Hello!</span>";
			break;
	}
}

// Use like: validChapter("John-1");
function validChapter(thing) {
	for (var i = 0; i < books.length; i++) {
		var firstPart = editBook(thing, 1);
		var secondPart = editBook(books[i], 2);
		if (firstPart == secondPart) {
			if (bible[i][2] >= thing.split("-")[1]) {
				return [true, books[i]]
			}
		}
	}
	return [false]
}

// Make Books easier to search
function editBook(book, part) {
	book = book.replace("1st ","1 ").replace("2nd ","2 ");
	if (part == 1) {
		book = book.toUpperCase();

		// Fix common spelling mistakes
		var correct = [
		["Psalm", "Psalms"],
		["Jhon", "John"],
		["Dan", "Daniel"],
		["Esra", "Ezra"],
		["Thesolionions", "Thessalonians"],
		["Psalmss", "Psalms"] // Bug in Javascript?
		];

		for (var i = 0; i < correct.length; i++) {
			book = book.replace(correct[i][0].toUpperCase(), correct[i][1].toUpperCase());
		}

		book = book.split("-")[0];
	} else {
		book = book.toUpperCase();
	}
	return book
}

// Check if current translation is Openbibles
function isOpenbibles() {
	var type = session.currentTranslationString;
	if (type == "KJV2000" || type == "ASV" || type == "DBY") {
		return true
	} else {
		return false
	}
}

// Simple script to load JSONP
function loadJSONP(url) {
	session.loadedScript = false;

	var iframe = document.createElement("SCRIPT");
	iframe.src = url;
	iframe.id = "loadedScript" + session.numberThingy;
	iframe.type = "text/javascript";
	document.body.appendChild(iframe);

	iframe.onload = function() {
		session.loadedScript = true;
	}

	session.numberThingy++;
}

function getScript(data) {
	session.loadedScriptData = data;
}

// Modify a verse and check if it it highlighted
function modifyVerse(verseNum, verseText) {
	var book = document.getElementById('book').value;
	var chapter = document.getElementById('chapter').value;
	var color = "transparent";
	var textColor = "black";
	if (isOpenbibles()) {
		verseNum--;
	}

	var item = eval("session.highlightedVerses." + book + "_" + chapter + "_" + (Number(verseNum) + 1) );
	if (!(!item)) {
		color = item;
	}

	return `<span class='verse' onclick='versePopup(` + verseNum + `)'><b id='verse'>` + (verseNum + 1) + `</b> <span style='background: ` + color + `;' class='verseText'>` + verseText + `</span></span>` + "<br>".repeat(session.breaksAfterVerse);
}

// Show highlighting menu
function versePopup(verse) {
	var book = document.getElementById('book').value;
	var chapter = document.getElementById('chapter').value;
	var theVerseText = book + " " + chapter + ":" + (verse + 1);
	document.getElementById('verseMenu').setAttribute("verse", book + " " + chapter + " " + (verse + 1));

	document.getElementById('verseMenu').style.display = "block";
	document.getElementById('verseMenu').style.WebkitAnimationName = "up";

	var mainContent = document.getElementById("mainContent");
	mainContent.getElementsByTagName("H2")[0].innerHTML = theVerseText;

	var theVerse;
	var done = false;

	// Get bible verse
	if (session.currentTranslationString == "netOnline") {
		load(book, chapter, verse + 1);
		var int = setInterval(function() {
			if (session.doneLoadingJSON) {
				theVerse = session.netTextData.replace('<a style="" target="_blank" href="http://netbible.com/net-bible-preface">&copy;NET</a>',"");
				done = true;
				clearInterval(int);
			}
		},1);
	} else if (isOpenbibles()) {
		theVerse = load(book, chapter, verse);
		session.doneLoadingJSON = true;
		done = true;
	} else {
		theVerse = load(book, chapter, verse + 1);
		session.doneLoadingJSON = true;
		done = true;
	}

	var entire;
	var wait = setInterval(function() {
		if (session.doneLoadingJSON && done) {
			session.currentVerse = entire;

			mainContent.getElementsByTagName("SPAN")[0].innerHTML = theVerse;
			document.getElementById("verseMenu").children[1].children[0].children[0].setAttribute("onclick", `search("` + theVerseText + `")`);
			document.getElementById("verseMenu").children[1].children[1].children[0].setAttribute("onclick", `interface.exec('copy',"` + theVerseText + ` - ` + theVerse + `")`);
			document.getElementById("verseMenu").children[1].children[2].children[0].setAttribute("onclick", `interface.exec('share',"` + theVerseText + ` - ` + theVerse + `")`);

			session.doneLoadingJSON = false;
			clearInterval(wait);
		}
	}, 10);
}

// Highlight a verse (called from html element)
function highlightVerse(elem) {
	var verse = elem.parentElement.parentElement.getAttribute("verse");
	var color = elem.getAttribute("class").split(" ")[1];

	// I know, I know... eval.
	eval("session.highlightedVerses." + verse.replace(/ /g, "_") + " = '" + color + "'");
	update();

	document.getElementById('verseMenu').style.WebkitAnimationName = "down";
	setTimeout(function() {
		document.getElementById('verseMenu').style.display = "none";
	},700);
}

function closeVerseMenu() {
	document.getElementById('verseMenu').style.WebkitAnimationName = "down";
	setTimeout(function() {
		document.getElementById('verseMenu').style.display = "none";
	},700);
}

function setFontSize(action) {
	if (action == "plus") {
		session.currentFontSize++
	} else {
		session.currentFontSize--
	}

	document.getElementById('page').style.fontSize = session.currentFontSize + "px";
	document.getElementById('page').style.lineHeight = (session.currentFontSize + 7) + "px";
	document.getElementById('fontPreview').style.fontSize = session.currentFontSize + "px";
	document.getElementById('fontSizeSelect').innerHTML = session.currentFontSize;

	update();
}