// Language Information for Openbibles API
var langShort = {
	"en": "english",
	"fr": "french",
	"de": "german",
	"es": "spanish"
};

var langList = [
	"en",
	"fr",
	"de",
	"es"
];

var en = [
	"acv",
	"jub2000",
	"kjv",
	"nheb",
	"rhe",
	"rsv",
	"wbt",
	"web",
	"ylt"
];

var fr = [
	"bdc"
];

var de = [
	"gerneue"
];

var es = [
	"rva",
	"sev",
	"sparv"
]

// Download trnslation, load it, and do cool animation stuff
function downloadTranslation(language, translation, elem) {
	var filename = language + "_" + translation;

	if (!(!window[filename])) {
		// translation already downloaded
	} else {
		var script = document.createElement("SCRIPT");
		script.src = "http://openbiblesapi.duckdns.org/?language=" + language + "&&translation=" + translation + "&&callback=returnTranslation";
		script.type = "text/javascript";
		document.getElementById('loadedScripts').appendChild(script);

		// Change image + trigger animation
		elem.childNodes[1].src = "images/loading.svg";
		elem.childNodes[1].style.display = "block";

		// Create the file and option in menu
		script.onload = function() {
			elem.childNodes[1].src = "images/close.svg";

			// Make a file in the translations folder (if devmode off)
			if (!app.devmode) {
				interface.exec("makefile " + filename + ".js", JSON.stringify(window[filename]));
			}

			// Stop animation
			elem.childNodes[1].style.animationName = "stop";
			createTranslation(language, translation);
		}
	}
}

// Create the translation option in the menu
function createTranslation(language, translation) {
	var option = document.createElement("OPTION");
	option.innerHTML = translation.toUpperCase() + " (Openbibles) (Offline)";
	option.setAttribute("val", language + "_" + translation);
	option.setAttribute("downloaded", "true");
	var list = document.getElementById("translation");
	list.insertBefore(option, list.childNodes[0]);
}

// I know this is the translation downloader file.. but why not add a translation deleter?
function deleteTranslation(elem, name) {
	if (elem.getAttribute("src") == "images/close.svg") {
		// Remove the translation, and set the image back to normal
		if (!app.devmode) {
			interface.exec("deletetranslation", name + ".js");
		}

		elem.setAttribute("src", "");

		// Remove translation from list
		var translation = document.getElementById("translation").children;
		for (var i = 0; i < translation.length; i++) {
			if (translation[i].getAttribute("val") == name) {
				translation[i].outerHTML = "";
			}
		}
	}
}