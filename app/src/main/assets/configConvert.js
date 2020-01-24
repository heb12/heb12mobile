// This converts the old text configuration files to the new JSON ones, and
// convert config file revisions made over the years.

// Input is in string form
function convert(config) {

	// Use multiple variables to detect version
	var hasComment = config.includes("/* Heb12 Configuration File - Edit at your own risk! */");
	var isJSON = true;

	try {
		JSON.parse(config);
	} catch (e) {
		isJSON = false;
	}

	// It is the old version, from 2018
	if (hasComment && !isJSON) {
		// Remove comment
		config = config.replace("/* Heb12 Configuration File - Edit at your own risk! */", "");

		// Split config file
		config = config.split(";");

		// Each item is name=value, so set it to just the value
		for (var i = 0; i < config.length; i++) {
			config[i] = config[i].split("=")[1];
		}

		var translation = config[0];
		var book = config[1];
		var chapter = config[2];
		var theme = config[3];
		var font = config[4];
		var highlighted = config[5];
		var fontSize = config[6];
		var bookmarked = config[7];

		// Detect if highlighted part has brackets, then it is JSON
		if (highlighted.includes("{") && highlighted.includes("}")) {
			highlighted = highlighted.replace(/_/g, " "); // Remove underscore
			highlighted = JSON.parse(highlighted);
		} else {
			var verses = highlighted.split(",");
			var newHighlighted = {};

			// Turn "John 3 16 yellow" into "'John 3 16': 'yellow'"
			for (var i = 0; i < verses.length; i++) {
				var split = verses[i].split(" ");
				var color = split.pop(); // Remove last part (returns removed part)
				var verse = split.join(" "); // Use the result

				newHighlighted[verse] = color;
			}

			highlighted = newHighlighted;
		}

		return { 
		   "currentTranslation": translation,
		   "lastBook": book,
		   "lastChapter": chapter,
		   "theme": theme,
		   "font": font,
		   "fontSize": fontSize,
		   "highlightedVerses": highlighted,
		   "bookmarkedChapters": bookmarked
		}
	} else {
		// It is the newer JSON version, but changes can still be made
		config = JSON.parse(config);


		// Convert {"John 3 16": true} to simply ["John 3 16"]
		if (!Array.isArray(config.bookmarkedChapters)) {
			config.bookmarkedChapters = Object.keys(config.bookmarkedChapters);
		}

		return config
	}
}

// Example
//console.log(convert(`/* Heb12 Configuration File - Edit at your own risk! */currentTranslation=KJV2000;lastBook=Genesis;lastChapter=1;theme=Default;font=Arial;highlightedVerses=John 3 16 yellow, Hebrews 4 12 lightgreen, Luke 9 23 lightgreen;fontSize=18;bookmarkedChapters={"Hebrews_4":true,"John_3":true};`));
