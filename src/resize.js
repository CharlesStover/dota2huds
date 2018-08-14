var bottom = document.getElementById("bottom"),
	toptop = document.getElementById("top");
var resize = function() {
		var ratio = document.body.clientWidth / document.body.clientHeight;
		var z = Math.floor(document.body.clientWidth / (ratio <= 4/3 ? 2134 : 2560) * 10000) / 10000;
		/*bottom.style.zoom = z;
		toptop.style.zoom = z;*/
		bottom.style.mozTransform = "scale(" + z + ")";
		bottom.style.msTransform = "scale(" + z + ")";
		bottom.style.oTransform = "scale(" + z + ")";
		bottom.style.transform = "scale(" + z + ")";
		bottom.style.webkitTransform = "scale(" + z + ")";
		toptop.style.mozTransform = "scale(" + z + ")";
		toptop.style.msTransform = "scale(" + z + ")";
		toptop.style.oTransform = "scale(" + z + ")";
		toptop.style.transform = "scale(" + z + ")";
		toptop.style.webkitTransform = "scale(" + z + ")";
	};
resize();
window.addEventListener("resize", resize);