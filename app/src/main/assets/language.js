// Go through all the Html elements and update them with the language
function updateLanguage() {
	var translation = eval(session.currentLanguage.toLowerCase());
	session.language = translation;
	for (var i = 0; i < Object.keys(translation).length; i++) {
		var thing = Object.keys(translation)[i];
		if (!Array.isArray(eval("translation." + Object.keys(translation)[i]))) {

			// Don't update these elements
			if (!(thing == "description") && !(thing == "settings")) {
				var text = translation[Object.keys(translation)[i]];
				text = text.replace(/\[version\]/g, session.version);
				text = text.replace(/\[connection\]/g, session.connectivity);
				text = text.replace(/\{Github repository\}/g, "<a href='https://github.com/heb12/heb12-mobile'>Github repository</a>");
				document.getElementsByName("text-" + Object.keys(translation)[i])[0].innerHTML = text;
			}
		}
	}
}