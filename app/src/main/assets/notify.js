// This mess is all the html for displaying popups
function notify(text) {
	animateIt("popup", "show")
	var popup = document.getElementById('popupContent');
	
	if (text == "firsttime") {
		popup.innerHTML = '<h2>Welcome to Heb12!</h2>\
		<p>' + app.language.description + '</p> \
		<p><strong>Pro Tip: Tap on a bible verse for a list of extra actions.</strong></p>';
	} else if (text == "settings") {
		popup.innerHTML = app.language.settings;

		// Set selects with hidden english value
		document.getElementById('languageSelect').querySelector("option[eng=" + current.language + "]").selected = true;
		document.getElementById('fontSelect').querySelector("option[eng=" + current.font + "]").selected = true;
		document.getElementById('themeSelect').querySelector("option[eng=" + current.theme + "]").selected = true;

		// Regularly set things
		document.getElementById('page').style.fontSize = current.fontSize + "px";
		document.getElementById('page').style.lineHeight = (current.fontSize + 7) + "px";
		document.getElementById('fontPreview').style.fontSize = current.fontSize + "px";
		document.getElementById('fontSizeSelect').innerHTML = current.fontSize;
	} else if (text == "info") {
		popup.innerHTML = "\
		<img onclick='haha()' style=\"display:inline; float:left; margin-right:10px;\" src=\"images/logo.png\" width=\"150\">\
		<div style=\"display:inline;\">\
		   <h2>Heb12 Mobile " + app.version + "</h2>\
		   <p>\
		   " + app.language.description + "\
		   </p>\
		</div>\
		<br>\
		<p><a style='color: blue; text-decoration: underline;' onclick=\"goToChapter('Hebrews', '4'); animateIt('popup', 'close'); animateIt('sidebar', 'close')\">Hebrews 4:12</a> - For the word of God is living, and powerful, and sharper than any two-edged sword, piercing even to the dividing asunder of soul and spirit, and of the joints and marrow, and is a discerner of the thoughts and intents of the heart.</p>\
		<br>\
		<h2>Credits</h2>\
		<p>Programming - Pufflegamerz aka Petabyte Studios</p>\
		<p>Openbibles - MasterOfTheTiger</p>\
		<p>Material icons - Material.io</p>\
		<p>Formatted NET API - Bible Labs</p>\
		<p>childofgod@theres.life - German Translation</p>\
		";
	} else if (text == "bookmarks") {
		var htmlList = "";

		// Go through the bookmarks and list them
		for (var i = 0; i < Object.keys(app.bookmarkedChapters).length; i++) {
			if (app.bookmarkedChapters[Object.keys(app.bookmarkedChapters)[0]]) {
				var chapter = Object.keys(app.bookmarkedChapters)[i].toString();
				htmlList += "\
				<hr>\
				<p style='font-size:21px;'>" + chapter.replace(/_/g, " ") + "</p>\
				<div class='button bg' onclick='goToChapter(\"" + chapter +"\".split(\"_\")[0], \"" + chapter +"\".split(\"_\")[1]); sidebarAnimation(\"close\"); animateIt(\"sidebar\", \"close\")'>\
					Visit\
				</div>\
				<br><br>\
				"
			}
		}
		popup.innerHTML = "\
		<h2>Bookmarks</h2>\
		" + htmlList + "\
		";
	} else if (text == 'hehe') {
		app.titleClicks++
		if (app.titleClicks >= 10) {
			popup.innerHTML = '<h1>You found an easter egg!</h1><p>This popup is very cool. Also you must check out <a href="http://frypup.is-great.net" target="_blank">frypup.is-great.net</a>. It is a website @Pufflegamerz made and it might just be the best one in the world. <br>Also, you <i>need</i> to see this picture of my pet guinea pig:</p><img width="320" src="images/blank.jpg">';
		} else {
			document.getElementsByClassName("popup")[0].style.display = "none";
		}
	} else if (text == 'download') {
		popup.innerHTML = "<h1>Download</h1>";
		if (app.status == "Offline") {
			popup.innerHTML += "To download translations, you must be connected to the internet.";
		} else {
			var html = "";
			for (var i = 0; i < langList.length; i++) {
				langString = langShort[langList[i]];

				// Add title
				html += "<h2>" + langString + "</h2>";

				// Add chapter things
				for (var n = 0; n < eval(langList[i]).length; n++) {
					var filename = langList[i] + "_" + eval(langList[i])[n];

					// Change url to close if translation already downloaded
					var url = "";
					if (!(!window[filename])) {
						url = "images/close.svg"
					}
					html += "<span class='translationDownloadButton' onclick='downloadTranslation(\"" + langList[i] + "\", \"" + eval(langList[i])[n] + "\", this)'>" + eval(langList[i])[n].toUpperCase() + "<img class='translationDownloadSpinner' src='" + url + "' onclick='deleteTranslation(this, \"" + filename + "\")'></span><br>";
				}
			}
			popup.innerHTML += html;
		}
	}
	 else {
		popup.innerHTML = text;
	}
}

// Sorry
var hahaha = 0;
function haha() {
	hahaha++
	if (hahaha > 5) {
		interface.exec("toast", "There totally aren't any easter eggs in this app...");
	}
}