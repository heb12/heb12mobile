// Language Information for Openbibles API
// Contributors, feel free to add translations that work

var langShort = {
	"en": "English",
	"fr": "French",
	"de": "German",
	"es": "Spanish"
};

var langList = [
	"en",
	"fr",
	"de",
	"es"
];

// English
var en = [
	"acv",
	"jubl2000",
	"kjv",
	"nheb",
	"rhe",
	"rsv",
	"wbt",
	"web",
	"ylt",
	"rwebster"
];

// French
var fr = [
	"bdc"
];

// German
var de = [
	"gerneue",
	"vaness"
];

// Spanish
var es = [
	"rva",
	"sev",
	"sparv"
]

// Download trnslation, load it, and do cool animation stuff
function downloadTranslation(language, translation, elem) {
	var filename = language + "_" + translation;

	if (downloadedTranslationsObj[filename] == "true") {
		deleteTranslation(elem.childNodes[1], filename);
	} else {
		var script = document.createElement("SCRIPT");
		script.src = "http://heb12api.duckdns.org/download.php?language=" + language + "&&translation=" + translation + "&&callback=returnTranslation";
		console.log(script.src)
		script.type = "text/javascript";
		document.getElementById('loadedScripts').appendChild(script);

		// Show loading icon
		elem.childNodes[1].style.display = "block";

		// Change image + change animation
		elem.childNodes[1].style.animationName = "spin";
		elem.childNodes[1].src = "images/loading.svg";

		// Create the file and option in menu
		script.onload = function() {
			elem.childNodes[1].src = "images/close.svg";

			// Make a file in the translations folder (if devmode off)
			if (!app.devmode) {
				interface.exec("makefile " + filename + ".js", JSON.stringify(window[filename]));
			}

			// Add it to the list
			downloadedTranslationsObj[filename] = "true";

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
	if (typeof downloadedTranslationsObj[name] !== "undefined") {
		// Remove the translation from folder
		if (!app.devmode) {
			interface.exec("deletetranslation", name + ".js");
		}

		// Hide image and remove from translation list
		elem.style.display = "none";
		delete downloadedTranslationsObj[name]

		// Remove translation from options menu
		var translation = document.getElementById("translation").children;
		for (var i = 0; i < translation.length; i++) {
			if (translation[i].getAttribute("val") == name) {
				translation[i].outerHTML = "";
			}
		}
	}
}