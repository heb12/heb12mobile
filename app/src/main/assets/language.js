// Go through all the Html elements and update them with the language
function updateLanguage() {
	var translation = eval(current.language.toLowerCase());
	app.language = translation;
	for (var i = 0; i < Object.keys(translation).length; i++) {
		var thing = Object.keys(translation)[i];
		var dontTranslate = ["description", "settings", "french", "german", "english", "offline", "version" , "translationTitle"];

		// Don't replace strings with arrays
		if (!Array.isArray(eval("translation." + Object.keys(translation)[i]))) {

			// Don't update certan elements
			if (!dontTranslate.includes(thing)) {
				var text = translation[Object.keys(translation)[i]];
				document.getElementsByName(Object.keys(translation)[i])[0].innerHTML = text;
			}
		}
	}
}