var x, y;
window.onload = function() {
	setInterval(function() {
		document.getElementById('main').style.backgroundPosition = x + "px " + y + "px";
	},1);
}

function getMouse(event) {
	x = event.clientX/60 - 25;
	y = event.clientY/20 - 100;
}