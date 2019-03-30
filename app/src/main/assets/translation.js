var translation = eval(session.currentTranslation);
for (var i = 0; i < Object.keys(english).length; i++) {
	console.log("text-" + Object.keys(english)[i]);
	if (!Array.isArray(Object.keys(english)[i])) {
		document.getElementsByName("text-" + Object.keys(english)[i])[0].innerHTML = english[Object.keys(english)[i]];
	}
}