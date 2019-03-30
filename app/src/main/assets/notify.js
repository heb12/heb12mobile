function notify(text) {
	popupAnimation("show");
	var popup = document.getElementById('popupContent');
	
	if (text == "firsttime") {
		popup.innerHTML = '<h2>Welcome to Heb12!</h2>\
		<p>Heb12 Mobile is a free open-sourced app designed to make reading the Bible easy and hassle-free. If you would like to contribute or give feedback, please visit the&nbsp;<a href="https://github.com/heb12/heb12-mobile" target="_blank" rel="noopener">Github repository</a>.</p> \
		<p><strong>Pro Tip: Tap on a bible verse for a list of extra actions.</strong></p>';
	} else if (text == "settings") {
		popup.innerHTML = "\
		<h2>Settings</h2>\
		<span class='textBesideSelect'>Theme:</span>\
		<select id='themeSelect' onchange=\"setTheme(this.value)\">\
			<option>Default</option>\
			<option>Dark</option>\
			<option>Dark Blue</option>\
			<option>Amethyst</option>\
		</select>\
		<br>\
		<p id=\"fontPreview\">The big brown fox jumps over the lazy dog.</p>\
		<span class='textBesideSelect'>Theme:</span>\
		<select id='fontSelect' onchange=\"setFont(this.value)\">\
			<option>Times New Roman</option>\
			<option>Arial</option>\
			<option>Comfortaa</option>\
			<option>Helvetica</option>\
			<option>Courier New</option>\
		</select>\
		<br>\
		<div>\
			<div class='icon' style='float: left' onclick='setFontSize(\"minus\")'>\
				<img src=\"images/left.svg\" width=\"45\">\
			</div>\
			<div class='icon' style='float:left'>\
				<div style='width: 45px; text-align: center; padding-top: 10px; font-size: 20px;' id='fontSizeSelect'>\
					12\
				</div>\
			</div>\
			<div class='icon' style='float: left' onclick='setFontSize(\"plus\")'>\
				<img src=\"images/right.svg\" width=\"45\">\
			</div>\
		</div>\
		<br>\
		<br>\
		<p>This will reset all your saved data. When reset the app, it will close so you can re-launch it.</p>\
		<br>\
		<div class='button bg' onclick='updateConfigFile(\"def\"); interface.exec(\"other\", \"close\")'>\
			Reset\
		</div>\
		";

		document.getElementById('page').style.fontSize = session.currentFontSize + "px";
		document.getElementById('page').style.lineHeight = (session.currentFontSize + 7) + "px";
		document.getElementById('fontPreview').style.fontSize = session.currentFontSize + "px";
		document.getElementById('themeSelect').value = session.currentTheme;
		document.getElementById('fontSelect').value = session.currentFont;
		document.getElementById('fontSizeSelect').innerHTML = session.currentFontSize;
	} else if (text == "info") {
		popup.innerHTML = "\
		<img style=\"display:inline; float:left; margin-right:10px;\" src=\"images/logo.png\" width=\"150\">\
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
	} else {
		popup.innerHTML = text;
	}
}
