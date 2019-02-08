var books = [ "Genesis", "Exodus", "Leviticus", "Numbers", "Deuteronomy", "Joshua", "Judges", "Ruth", "1st Samuel", "2nd Samuel", "1st Kings", "2nd Kings", "1st Chronicles", "2nd Chronicles", "Ezra", "Nehemiah", "Esther", "Job", "Psalms", "Proverbs", "Ecclesiastes", "Song of Solomon", "Isaiah", "Jeremiah", "Lamentations", "Ezekiel", "Daniel", "Hosea", "Joel", "Amos", "Obadiah", "Jonah", "Micah", "Nahum", "Habakkuk", "Zephaniah", "Haggai", "Zechariah", "Malachi", "Matthew", "Mark", "Luke", "John", "Acts", "Romans", "1st Corinthians", "2nd Corinthians", "Galatians", "Ephesians", "Philippians", "Colossians", "1st Thessalonians", "2nd Thessalonians", "1st Timothy", "2nd Timothy", "Titus", "Philemon", "Hebrews", "James", "1st Peter", "2nd Peter", "1st John", "2nd John", "3rd John", "Jude", "Revelation" ];
var currentBookNumber = 1;
var data;

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
	devmode:false
}

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
			interface.exec("write",`/* Heb12 Configuration File - Edit at your own risk! */\ncurrentTranslation=BBE;\nlastBook=Hebrews;\nlastChapter=12;`);
		}	

		// Parse config file into JS
		if (!data[1] == "") {
			var configuration = data[1];
			configuration = configuration.replace(/\/\*[A-Za-z0-9 -!.:]+\*\//g,"");
			configuration = configuration.split(";");
			document.getElementById('book').value = configuration[1].split("=")[1];
			document.getElementById('chapter').value = configuration[2].split("=")[1];
		}
	}

	// load Hebrews 12
	updateTranslation();
	document.getElementById('page').innerHTML = load("Hebrews",12);
	update();
}

// Function to get verse or verses from the json files
function load(book,chapter,verse) {
	var breaks = "<br>".repeat(session.breaksAfterVerse);

	if (session.currentTranslationString == "KJV2000") {

		for (var i = 0; i < books.length; i++) {
			if (books[i] == book) {
				bookNum = i;
			}
		}

		// Make accurate chapter length
		document.getElementById('chapter').innerHTML = "";
		for (var i = 1; i <= kjv2000.osis.osisText.div[bookNum].chapter.length; i++) {
			document.getElementById('chapter').innerHTML += "<option>" + i + "</option>";
		}

		document.getElementById('book').value = book;
		document.getElementById('chapter').value = chapter;

		// For 1 chapter books
		if (!kjv2000.osis.osisText.div[bookNum].chapter.verse) {
			var verses = kjv2000.osis.osisText.div[bookNum].chapter[chapter - 1].verse;
		} else {
			document.getElementById('chapter').innerHTML = "<option>1</option>";
			var verses = kjv2000.osis.osisText.div[bookNum].chapter.verse;
		}

		var page = "";
		if (!isNaN(verse)) {
			page = verses[verse].text;
			console.log();
		} else {
			for (var i = 0; i < verses.length; i++) {
				page += " <b id='verse' onclick='notify(" + '"verse-' + (i + 1) + '"' + ")'>" + (i + 1) + "</b> " + verses[i].text + breaks;
			}
		}

		return page;
	} else {
		var page;
		var booky;

		// Get chapter data
		for (var i = 0; i < books.length; i++) {
			if (books[i] == book) {
				page = session.currentTranslation[i].chapters[chapter - 1];
				booky = session.currentTranslation[i].chapters.length;
				currentBookNumber = i;
			}
		}

		document.getElementById('chapter').innerHTML = "";

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
		var entire = book + " " + chap + ":" + verse;
		session.currentVerse = entire;

		popup.innerHTML = `
		<h2>` + entire + `</h2>
		<span>` + load(book, chap, verse) + `</span>
		<br><br>
		<div style='width:200px;' class='button bg' onclick="search('` + entire + `')">Search verse on Google</div>
		<br><br>
		<div class='button bg' onclick="interface.exec('copy','` + session.currentVerse + `')">Copy verse</div> `;
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
		`;
	} else if (text == "info") {
		popup.innerHTML = `
		<img style="display:inline; float:left; margin-right:10px;" src="images/logo.png" width="150">
		<div style="display:inline;">
		   <h2>Heb12 Mobile v1.0</h2>
		   <p>
		   Heb12 Mobile is a free open-sourced app designed to make reading the bible easy and hassle-free. Feel free to contribute to the 
		   <a target="_blank" href="https://github.com/heb12/heb12-android">Github repository</a>.
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
			popup.innerHTML = '<h1>You found an easter egg!</h1><p>This popup is very cool. Also you must check out <a href="http://frypup.is-great.net" target="_blank">frypup.is-great.net</a>. It is a website @Pufflegamerz made and it might just be the best one in the world. Also, you <i>need</i> to see this picture of my pet guinea pig:</p><img width="320" src="images/blank.jpg">';
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
	document.getElementById('page').innerHTML = load(books[randomBook], randomChapter);
	settingsAnimation("close");
}

// Function to handle page updates
function update(option) {
	var book = document.getElementById('book').value;
	var chapter = Number(document.getElementById('chapter').value);
	document.getElementById("kjvOnline").style.display = "none";

	updateTranslation();

	// If the user goes back at the first chapter of a book, go back to the previous book
	if (option == "next") {
		if (session.currentTranslation[currentBookNumber].chapters.length == Number(document.getElementById('chapter').value)) {
			if (book == "Revelation" && chapter == 22) {
				console.log("End of Bible :-/");
			} else {
				book = books[currentBookNumber + 1];
				chapter = 1;
			}
		} else {
			chapter++;
		}
	} else if (option == "previous") {
		if (chapter !== 1) {
			chapter--;
		} else {
			book = books[currentBookNumber - 1];
			chapter = session.currentTranslation[currentBookNumber - 1].chapters.length;
		}
	}
	// Show overlay iframe if translation is KJV Online
	if (session.currentTranslationString == "KJVONLINE") {
		document.getElementById('book').value = book;
		document.getElementById('chapter').value = chapter;
		var iframe = document.getElementById('kjvOnline');
		iframe.src = "http://labs.bible.org/api/?passage=" + book + " " + chapter + " && formatting=full";
	} else {
		document.getElementById('page').innerHTML = load(book, chapter);
	}

	// Update the configuration file
	if (!session.devmode) {
		interface.exec("write",`/* Heb12 Configuration File - Edit at your own risk! */\ncurrentTranslation=` + session.currentTranslationString + `;\nlastBook=` + book + `;\nlastChapter=` + chapter + `;`);
	}
}

// Update the current translation
function updateTranslation() {
	var translation = document.getElementById('translation').value;
	document.getElementById("kjvOnline").style.display = "none";
	if (translation.startsWith("BBE")) {
		session.currentTranslation = eval(bbe);
		session.currentTranslationString = "BBE";
	} else if (translation.startsWith("KJV 2000")) {
		document.getElementById('kjvOnline').style.display = "none";
		session.currentTranslationString = "KJV2000";
		session.currentTranslation = eval(kjv);
	} else if (translation.startsWith("KJV") && translation.endsWith("(Offline)")) {
		session.currentTranslation = eval(kjv);
		session.currentTranslationString = "KJV";
	} else if (translation.startsWith("KJV") && translation.endsWith("(Online)")) {
		document.getElementById('kjvOnline').style.display = "block";
		session.currentTranslationString = "KJVONLINE";
		session.currentTranslation = eval(kjv); // If current translation is KJV Offline, use Offline KJV so that everything works.
	} else {
		document.getElementById("kjvOnline").style.display = "none";
	}
}

// A simple function to search somthing on Google
function search(thing) {
	window.open("https://www.google.nl/search?q=" + thing);
}

// Function to close settings menu
function settingsAnimation(action) {
	if (action == "close") {
		document.getElementById("settings").style.WebkitAnimationName = "slideOut";
		setTimeout(function() {
			document.getElementById('settings').style.display = "none";
		},500);
	} else {
		document.getElementById('settings').style.display = "block";
		document.getElementById("settings").style.WebkitAnimationName = "slideIn";
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