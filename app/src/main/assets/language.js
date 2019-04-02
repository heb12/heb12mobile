function updateLanguage() {
	var translation = eval(session.currentLanguage);
	session.language = translation;
	for (var i = 0; i < Object.keys(translation).length; i++) {
		var thing = Object.keys(translation)[i];
		if (!Array.isArray(eval("translation." + Object.keys(translation)[i]))) {
			// Don't do these
			if (!(thing == "description") && !(thing == "settings")) {
				var text = translation[Object.keys(translation)[i]];
				text = text.replace(/\[version\]/g, session.version);
				text = text.replace(/\[connection\]/g, session.connectivity);
				document.getElementsByName("text-" + Object.keys(translation)[i])[0].innerHTML = text;
			}
		}
	}
}