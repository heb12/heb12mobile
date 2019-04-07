var spanish = {
	next: "Siguiente",
	previous: "Anterior",
	version: "Versi&oacute;n [version] [connection]",
	translationTitle: "Traducci&oacute;n actual",
	translations: [
		"BBE (Bible in Basic English) (Desconectado)",
		"KJV (King James Version) (Desconectado)",
		"KJV 2000 (King James Version 2000) (Desconectado)",
		"NET (Nueva Traducci&oacute;n al Ingl&eacute;s) (Online)",
		"ASV (versi&oacute;n est&aacute;ndar americana) (sin conexi&oacute;n)",
		"DBY (Biblia de Darby) (Desconectado)"
	],
	VOTDTitle: "Verso del d&iacute;a",
	description: "Heb12 Mobile es una aplicaci&oacute;n gratuita de c&oacute;digo abierto dise&ntilde;ada para hacer que la lectura de la Biblia sea f&aacute;cil y sin complicaciones. Si&eacute;ntase libre de contribuir al {Github repository}.",
	credits: [
		"Cr&eacute;ditos",
		"Programador principal - Pufflegamerz aka Petabyte Studios",
		"Openbibles - MasterOfTheTiger",
		"Iconos de material - Material.io",
		"API de NET formateada - Bible Labs",
		"@thiagobodruk - Archivos JSON de la Biblia sin conexi&oacute;n"
	],
	settings:"\
		<h2>Configuraci&oacute;n</h2>\
		<span class='textBesideSelect'>Idioma:</span>\
		<select id='languageSelect' onchange=\"setLanguage(this.value)\">\
			<option>English</option>\
			<option>Spanish</option>\
		</select>\
		<br>\
		<span class='textBesideSelect'>El tema:</span>\
		<select id='themeSelect' onchange=\"setTheme(this.value)\">\
			<option>Default</option>\
			<option>Dark</option>\
			<option>Dark Blue</option>\
			<option>Amethyst</option>\
		</select>\
		<br>\
		<p id=\"fontPreview\">The big brown fox jumps over the lazy dog.</p>\
		<span class='textBesideSelect'>Fuente:</span>\
		<select id='fontSelect' onchange=\"setFont(this.value)\">\
			<option>Times New Roman</option>\
			<option>Arial</option>\
			<option>Comfortaa</option>\
			<option>Helvetica</option>\
			<option>Courier New</option>\
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
		<p>Esto restablecer&aacute; todos los datos guardados. Cuando reinicie la aplicaci&oacute;n, se cerrar&aacute; para que pueda volver a iniciarla.</p>\
		<br>\
		<div class='button bg' onclick='updateConfigFile(\"def\"); interface.exec(\"other\", \"close\")'>\
			Reiniciar\
		</div>\
		"
}