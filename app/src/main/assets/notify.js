function notify(text) {
	popupAnimation("show");
	var popup = document.getElementById('popupContent');
	
	if (text == "firsttime") {
		popup.innerHTML = '<h2>Welcome to Heb12!</h2>\
		<p>' + session.language.description + '</p> \
		<p><strong>Pro Tip: Tap on a bible verse for a list of extra actions.</strong></p>';
	} else if (text == "settings") {
		popup.innerHTML = session.language.settings;

		document.getElementById('page').style.fontSize = session.currentFontSize + "px";
		document.getElementById('page').style.lineHeight = (session.currentFontSize + 7) + "px";
		document.getElementById('fontPreview').style.fontSize = session.currentFontSize + "px";
		document.getElementById('themeSelect').value = session.currentTheme;
		document.getElementById('fontSelect').value = session.currentFont;
		document.getElementById('fontSizeSelect').innerHTML = session.currentFontSize;
		document.getElementById('languageSelect').value = session.currentLanguage;
	} else if (text == "info") {
		popup.innerHTML = "\
		<img onclick='haha()' style=\"display:inline; float:left; margin-right:10px;\" src=\"images/logo.png\" width=\"150\">\
		<div style=\"display:inline;\">\
		   <h2>Heb12 Mobile v1.0</h2>\
		   <p>\
		   Heb12 Mobile is a free open-sourced app designed to make reading the bible easy and hassle-free. Feel free to contribute to the \
		   <a target=\"_blank\" href=\"https://github.com/heb12/heb12-mobile\">Github repository</a>.\
		   </p>\
		</div>\
		<br>\
		<p><a style='color: blue; text-decoration: underline;' onclick=\"goToChapter('Hebrews', '4'); popupAnimation('close'); sidebarAnimation('close')\">Hebrews 4:12</a> - For the word of God is living, and powerful, and sharper than any two-edged sword, piercing even to the dividing asunder of soul and spirit, and of the joints and marrow, and is a discerner of the thoughts and intents of the heart.</p>\
		<br>\
		<h2>Credits</h2>\
		<p>Lead Programmer - Pufflegamerz aka Petabyte Studios</p>\
		<p>Openbibles - MasterOfTheTiger</p>\
		<p>Material icons - Material.io</p>\
		<p>Formatted NET API - Bible Labs</p>\
		<p><a href=\"https://github.com/thiagobodruk\" target=\"_blank\">@thiagobodruk</a> - Offline Bible JSON files</p>";
	} else if (text == "bookmarks") {
		var htmlList = "";
		for (var i = 0; i < Object.keys(session.bookmarkedChapters).length; i++) {
			if (eval("session.bookmarkedChapters." + Object.keys(session.bookmarkedChapters)[i])) {
				var chapter = Object.keys(session.bookmarkedChapters)[i].toString();
				chapter = replaceNumbers(chapter, "2")
				htmlList += "\
				<hr>\
				<p style='font-size:21px;'>" + chapter.replace(/_/g, " ") + "</p>\
				<div class='button bg' onclick='goToChapter(\"" + chapter +"\".split(\"_\")[0], \"" + chapter +"\".split(\"_\")[1]); sidebarAnimation(\"close\"); popupAnimation(\"close\")'>\
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
		session.titleClicks++
		if (session.titleClicks >= 10) {
			popup.innerHTML = '<h1>You found an easter egg!</h1><p>This popup is very cool. Also you must check out <a href="http://frypup.is-great.net" target="_blank">frypup.is-great.net</a>. It is a website @Pufflegamerz made and it might just be the best one in the world. <br>Also, you <i>need</i> to see this picture of my pet guinea pig:</p><img width="320" src="images/blank.jpg">';
		} else {
			document.getElementsByClassName("popup")[0].style.display = "none";
		}
	} else if (text == 'download') {
		popup.innerHTML = "Download";
	}
	 else {
		popup.innerHTML = text;
	}
}
var hahaha = 0;
function haha() {
	hahaha++
	if (hahaha > 5) {
		interface.exec("toast", "There totally aren't any easter eggs in this app...")
	}
}