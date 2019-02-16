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
	loadedTranslations:[]
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
		data = data.replace(/%22/g,'"');
		data = data.replace(/%20/g," ");
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
			configuration = configuration.replace(/\/\*[A-Za-z0-9 -!.:]+\*\//g,"");
			configuration = configuration.split(";");
			document.getElementById('book').value = configuration[1].split("=")[1];
			document.getElementById('chapter').value = configuration[2].split("=")[1];

			session.currentTheme = configuration[3].split("=")[1];
			setTheme(configuration[3].split("=")[1]);

		}
	}

	// load Hebrews 12
	updateTranslation();

	// Use special methods to use script only when it is loaded
	var waitUntilLoad = setInterval(function() {
		if (eval('typeof ' + session.currentTranslationString.toLowerCase() + ' !== "undefined"')) {
			if (session.devmode) {
				document.getElementById('page').innerHTML = load("Hebrews",12);
			} else {
				document.getElementById('page').innerHTML = load(document.getElementById('book').value,document.getElementById('chapter').value);
			}
			update();
			clearInterval(waitUntilLoad);
		}
	},10);

}

// Function to get verse or verses from the json files
function load(book,chapter,verse) {
	var breaks = "<br>".repeat(session.breaksAfterVerse);
	document.getElementById('chapter').innerHTML = "";

	// Openbibles parser and the other json files
	if (isOpenbibles()) {

		var bookNum;
		for (var i = 0; i < books.length; i++) {
			if (books[i] == book) {
				bookNum = i;
				session.currentBookNumber = i;
			}
		}

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
				page += " <b id='verse' onclick='notify(" + '"verse-' + (i) + '"' + ")'>" + (i + 1) + "</b> " + verses[i].text + breaks;
			}
		}

		page = page.replace(/\[/g,"");
		page = page.replace(/\]/g,"");

		return page;
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
				var breaks = "<br>".repeat(session.breaksAfterVerse);
				finalResult += " <b id='verse' onclick='notify(" + '"verse-' + (i + 1) + '"' + ")'>" + (i + 1) + "</b> " + page[i] + breaks;
			}
		} else {
			finalResult = page[verse - 1];
		}

		// Remove wierd things inserted inside text in Offline KJV version
		finalResult = finalResult.replace(/\{[a-zA-Z0-9 .,;]+: or, [a-zA-Z0-9 .,;]+\}/g,"");
		finalResult = finalResult.replace(/:/g,"");
		finalResult = finalResult.replace(/\}/g,"");
		finalResult = finalResult.replace(/\{/g,"");
		finalResult = finalResult.replace(/\.\.\./g,"");

		return finalResult;
	}
}

// Notify function - can only be used once at a time.
function notify(text) {

	popupAnimation("show");
	var popup = document.getElementById('popupContent');

	if (text == "welcome") {
		popup.innerHTML = "<h2>Welcome to Heb12 Mobile!</h2><br><span><b>Tip</b>: Tap on the bold number in front of a verse to get some info about it.</span>";
	} else if (text.startsWith("verse")) {
		var book = document.getElementById('book').value;
		var chap = document.getElementById('chapter').value;
		var verse = text.split("-")[1];
		var verseText = verse;
		if (isOpenbibles()) {
			verseText++;
		}
		var entire = book + " " + chap + ":" + verseText;
		session.currentVerse = entire;

		popup.innerHTML = `
		<h2>` + entire + `</h2>
		<span>` + load(book, chap, verse) + `</span>
		<hr>
		<div class="icon">
			<img src="images/search.svg" width="45" onclick="search('` + entire + `')">
		</div>
		<div class="icon">
			<img src="images/clipboard.svg" width="45" onclick="interface.exec('copy','` + load(book, chap, verse) + `')">
		</div>
		<div class="icon">
			<img src="images/share.svg" width="45" onclick="interface.exec('share','` + entire + " - " + load(book, chap, verse) + `')">
		</div>
		<hr>

		`;
	} else if (text == "firsttime") {
		popup.innerHTML = `
		<h2>Welcome to Heb12!</h2>
		<p>
		Heb12 Mobile is a free open-sourced app designed to make reading the bible easy and hassle-free.
		</p>
		<p>
		Tip: Tap on the bold text of a verse to get some info on it.
		</p>`;
	} else if (text == "settings") {
		popup.innerHTML = `
		<h2>Settings</h2>
		<span class='textBesideSelect'>Theme:</span>
		<select id='themeSelect' onchange="setTheme(this.value)">
			<option>Default</option>
			<option>Dark</option>
			<option>Dark Blue</option>
		</select>
		<p>This will reset all your saved data. When reset the app, it will close so you can re-launch it.</p>
		<br>
		<div class='button bg' onclick='updateConfigFile("def")'>
			Reset
		</div>
		`;
		document.getElementById('themeSelect').value = session.currentTheme;
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
		<h2>Credits</h2>
		<p>Pufflegamerz aka Petabyte Studios - Programming</p>
		<p>MasterOfTheTiger - Founder of Heb12 Ministries</p>
		<p>Material.io - Material icons</p>
		<p>Bible Labs - Formatted KJV API</p>
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
		}

	} else if (option == "previous") {
		if (chapter !== 1) {
			chapter--;
		} else {
			book = books[session.currentBookNumber - 1];
			chapter = bible[session.currentBookNumber - 1][2];
		}
	}

	if (bible[session.currentBookNumber][2] <= chapter) {
		chapter = bible[session.currentBookNumber][2];
	}

	// Get offline data
	if (session.currentTranslationString == "netOnline" && !session.devmode) {
		document.getElementById('book').value = book;
		document.getElementById('chapter').value = chapter;
		var result = interface.exec("get", "http://labs.bible.org/api/?passage=" + book + " " + chapter + " && formatting=full");

		// Very bad method - needs to be updated
		setTimeout(function() {
			document.getElementById('page').innerHTML = result;
		},10);
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
		["currentTranslation",session.currentTranslationString,"BBE"],
		["lastBook", document.getElementById('book').value,"Hebrews"],
		["lastChapter",document.getElementById('chapter').value,"12"],
		["theme",session.currentTheme,"Default"]
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
		sidebarAnimation("close");
		document.getElementById('page').innerHTML = load(valid[1], theChapter);
		result.style.display = "none";
		document.getElementById('search').value = "";
	}
}

// Use like: validChapter("John-1");
function validChapter(thing) {
	for (var i = 0; i < books.length; i++) {
		var firstPart = editBook(thing, 1);
		var secondPart = editBook(books[i], 2);
		if (firstPart == secondPart) {
			if (bible[i][2] >= thing.split("-")[1]) {
				return [true,books[i]]
			}
		}
	}
	return [false]
}

// Make Books easier to search
function editBook(book, part) {
	book = book.replace("1st ","1 ").replace("2nd ","2 ");
	if (part == 1) {
		book = book.replace("Psalm","Psalms").split("-")[0].toUpperCase();
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