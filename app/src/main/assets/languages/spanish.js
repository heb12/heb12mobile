var spanish = {
	next: "Siguiente",
	previous: "Anterior",
	version: "Versión [version] [connection]",
	translationTitle: "Traducción Actual",
	translations: [
		"BBE (Biblia en Básico Inglés) (Desconectado)",
		"KJV (King James Versión) (Desconectado)",
		"KJV 2000 (King James Versión 2000) (Desconectado)",
		"NET (New English Translation) (En línea)",
		"ASV (American Standard Version) (Desconectado)",
		"DBY (Darby Bible) (Desconectado)"
	],
	VOTDTitle: "Verse of the Day",
	description: "Heb12 Mobile es una aplicación gratuita de código abierto creado para hacer que la lectura de la Biblia sea fácil y sin complicaciones. Siéntase libre de contribuir a la  <a href='https://github.com/heb12/heb12-mobile'>repositorio de Github</a>.",
	credits: [
		"Credits",
		"Lead Programmer - Pufflegamerz aka Petabyte Studios",
		"Openbibles - MasterOfTheTiger",
		"Material icons - Material.io",
		"Formatted NET API - Bible Labs",
		"@thiagobodruk - Offline Bible JSON files",
		"childofgod@theres.life - German Translation"
	],
	settings:"\
		<h2>Settings</h2>\
		<span class='textBesideSelect'>Idioma:</span>\
		<select id='languageSelect' onchange=\"setLanguage(this.options[this.selectedIndex].getAttribute('eng'))\">\
			<option eng='english'>Inglés</option>\
			\
			<option eng='german'>German</option>\
		</select>\
		<br>\
		<span class='textBesideSelect'>Theme:</span>\
		<select id='themeSelect' onchange=\"setTheme(this.options[this.selectedIndex].getAttribute('eng'))\">\
			<option eng='default'>Default</option>\
			<option eng='dark'>Dark</option>\
			<option eng='darkblue'>Dark Blue</option>\
			<option eng='amethyst'>Amethyst</option>\
		</select>\
		<br>\
		<div id='fontPreviewBox'>\
		<p id=\"fontPreview\">The big brown fox jumps over the lazy dog.</p>\
		</div>\
		<span class='textBesideSelect'>Font:</span>\
		<select id='fontSelect' onchange=\"setFont(this.options[this.selectedIndex].getAttribute('eng'))\">\
			<option eng='Times New Roman'>Times New Roman</option>\
			<option eng='Arial'>Arial</option>\
			<option eng='Comfortaa'>Comfortaa</option>\
			<option eng='Helvetica'>Helvetica</option>\
			<option eng='Courier New'>Courier New</option>\
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
		<p>This will reset all your saved data. When you reset the app, it will close so you can re-launch it.</p>\
		<br>\
		<div class='button bg' onclick='updateConfigFile(\"def\"); interface.exec(\"other\", \"close\")'>\
			Reset\
		</div>\
		",
		english: "English",
		french: "French",
		offline: "To download translations, you must be connected to the internet."
}