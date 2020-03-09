var german = {
next: "N&auml;chstes",
previous: "Vorherige",
version: "Version [version] [connection]",
translationTitle: "Aktuelle &Uuml;bersetzung",
translations: [
"BBE (Bible in Basic English) (Offline)",
"KJV (King James Version) (Offline)",
"KJV 2000 (King James Version 2000) (Offline)",
"NET (New English Translation) (Online)",
"ASV (American Standard Version) (Offline)",
"DBY (Darby Bible) (Offline)"
],
VOTDTitle: "Vers des Tages",
description: "Heb12 Mobile ist eine kostenlose Open-Source-App, die das Lesen der Bibel einfach und unkompliziert macht.. Du kannst gerne zum <a href='#' onclick='javascript:interface.exec(\"browser\", \"https://github.com/heb12/heb12-mobile\")'>Github-Repository beitragen.</a>.",
credits: [
"Credits",
"Hauptprogrammierer - Pufflegamerz aka Petabyte Studios",
"Openbibles - MasterOfTheTiger",
"Material-Icons - Material.io",
"Formatiert NET API - Bible Labs",
"@thiagobodruk - Offline Bibel JSON Dateien",
"childofgod@theres.life - Deutsche &Uuml;bersetzung"
],
settings:"\
<h2>Einstellungen</h2>\
<span class='textBesideSelect'>Sprache:</span>\
<select id='languageSelect' onchange=\"setLanguage(this.options[this.selectedIndex].getAttribute('eng'))\">\
<option eng='english'>Englisch</option>\
<option eng='german'>Deutsch</option>\
<option eng='spanish'>Spanisch</option>\
</select>\
<br>\
<span class='textBesideSelect'>Theme:</span>\
<select id='themeSelect' onchange=\"setTheme(this.options[this.selectedIndex].getAttribute('eng'))\">\
<option eng='default'>Standard</option>\
<option eng='dark'>Dunkel</option>\
<option eng='darkblue'>Dunkel Blau</option>\
<option eng='amethyst'>Amethyst</option>\
</select>\
<br>\
<div id='fontPreviewBox'>\
<p id=\"fontPreview\">The big brown fox jumps over the lazy dog.</p>\
</div>\
<span class='textBesideSelect'>Schriftart:</span>\
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
<p>Dadurch werden alle gespeicherten Daten zur&uuml;ckgesetzt. Wenn die App zur&uuml;ckgesetzt wird, wird siese geschlossen, so dass die App neu gestartet werden kann..</p>\
<br>\
<div class='button bg' onclick='updateConfigFile(\"def\"); interface.exec(\"other\", \"close\")'>\
Zur&uuml;cksetzen\
</div>\
",
english: "Englisch",
french: "Franz&ouml;sisch",
offline: "Um &Uuml;bersetzungen herunterladen zu k&ouml;nnen, musst du mit dem Internet verbunden sein.."
}