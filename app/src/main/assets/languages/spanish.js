var spanish = {
next: "Siguiente",
previous: "Anterior",
version: "Versi&oacute;n [version] [connection]",
translationTitle: "Traducci&oacute;n Actual",
translations: [
"BBE (Biblia en B&aacute;sico Ingl&eacute;s) (Desconectado)",
"KJV (King James Versi&oacute;n) (Desconectado)",
"KJV 2000 (King James Versi&oacute;n 2000) (Desconectado)",
"NET (New English Translation) (En l&iacute;nea)",
"ASV (American Standard Versi&oacute;n) (Desconectado)",
"DBY (Darby Biblia) (Desconectado)"
],
VOTDTitle: "Verse of the Day",
description: "Heb12 Mobile es una aplicaci&oacute;n gratuita de c&oacute;digo abierto creado para hacer que la lectura de la Biblia sea f&aacute;cil y sin complicaciones. Si&eacute;ntase libre de contribuir a la <a href='https://github.com/heb12/heb12-mobile'>repositorio de Github</a>.",
credits: [
"Credits",
"Lead Programmer - Pufflegamerz / Petabyte Studios",
"Openbibles - MasterOfTheTiger",
"Iconos materiales - Material.io",
"NET API formateada - Bible Labs",
"@thiagobodruk - Offline Bible JSON files",
"childofgod@theres.life - traducci&oacute;n al alem&aacute;n"
],
settings:"\
<h2>Ajustes:</h2>\
<span class='textBesideSelect'>Idioma:</span>\
<select id='languageSelect' onchange=\"setLanguage(this.options[this.selectedIndex].getAttribute('eng'))\">\
<option eng='english'>Ingl&eacute;s</option>\
\
<option eng='german'>Alem&aacute;n</option>\
</select>\
<br>\
<span class='textBesideSelect'>Tema:</span>\
<select id='themeSelect' onchange=\"setTheme(this.options[this.selectedIndex].getAttribute('eng'))\">\
<option eng='default'>Regulario</option>\
<option eng='dark'>Oscuro</option>\
<option eng='darkblue'>Azul Oscuro</option>\
<option eng='amethyst'>Amatista</option>\
</select>\
<br>\
<div id='fontPreviewBox'>\
<p id=\"fontPreview\">The big brown fox jumps over the lazy dog.</p>\
</div>\
<span class='textBesideSelect'>Fuente:</span>\
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
<p>Esto restablecer&aacute; todos sus datos guardados. Cuando reinicie la aplicaci&oacute;n, se cerrar&aacute; para que pueda volver a iniciarla.</p>\
<br>\
<div class='button bg' onclick='updateConfigFile(\"def\"); interface.exec(\"other\", \"close\")'>\
Reset\
</div>\
",
english: "Ingl&eacute;s",
french: "Franc&eacute;s",
offline: "To download translations, you must be connected to the internet."
}