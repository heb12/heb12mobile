var file = "";
for (var i = 0; i < kjv2000.osis.osisText.div.length; i++) {
	for (var n = 0; n < kjv2000.osis.osisText.div[i].chapter.length; n++) {
		for (var l = 0; l < kjv2000.osis.osisText.div[i].chapter[n].verse.length; l++) {
			file += kjv2000.osis.osisText.div[i].chapter[n].verse[l].text + "$";
		}
	}
}
console.log(file);