var bible = `var bible = [`;
for (var i = 0; i < bbe.length; i++) {
	bible += `["` + bbe[i].name + `",` + `,` + bbe[i].chapters.length + `],`;
}
bible += "];"

prompt("", bible);