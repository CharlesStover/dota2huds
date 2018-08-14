<?php

include 'huds.php';



// Get HUD data.
$hues = array();
$rgbs = array();
foreach (new DirectoryIterator('previews') as $file) {
	if (
		$file->isFile() &&
		file_exists($file->getPathname() . '.hue') &&
		file_exists($file->getPathname() . '.rgb')
	) {
		$hues[$file->getFilename()] = file_get_contents($file->getPathname() . '.hue');
		$rgbs[$file->getFilename()] = file_get_contents($file->getPathname() . '.rgb');
	}
}



// Sort HUDs by hue.
asort($hues);



// Generate content.

include 'hsl2rgb.php';
function increment($c) {
	return round($c + (255 - $c) / 4);
}
$css = '';
$html = '';
foreach ($hues as $image => $hue) {
	$hud = preg_replace('/\..+$/', '', $image);
	if (array_key_exists($hud, $huds)) {
		$hud_id = str_replace(' ', '-', $hud);
		$hud_url = str_replace(' ', '+', $hud);
		$title = $hud == 'default' ? 'Default' : (is_array($huds[$hud]) ? $huds[$hud][0] : $huds[$hud]);

		// a, a:hover
		$rgb = explode(',', $rgbs[$image]);

		ob_start();

		$hsl = rgb2hsl($rgb);
		$hover_bg = hsl2rgb($hsl[0], $hsl[1], $hsl[2] + (1 - $hsl[2]) / 3);
		$hover_fg = hsl2rgb($hsl[0], $hsl[1] + (1 - $hsl[1]) / 3, $hsl[2] + (1 - $hsl[2]) / 3);

?>
#<?php echo $hud_id; ?> { background-color: rgb(<?php echo $rgbs[$image]; ?>); background-image: url("previews/<?php echo $image; ?>"); }
#<?php echo $hud_id; ?>:hover { background-color: rgb(<?php echo implode(',', $hover_bg); ?>); border-color: rgb(<?php echo implode(',', hsl2rgb($hsl[0], $hsl[1], $hsl[2] / 2)); ?>); }
#<?php echo $hud_id; ?> span { color: rgb(<?php echo increment($rgb[0]), ',', increment($rgb[1]), ',', increment($rgb[2]); ?>); }
#<?php echo $hud_id; ?>:hover span { color: rgb(<?php echo implode(',', $hover_fg); ?>); }
<?php
		$css .= str_replace("\n", ' ', ob_get_contents());
		ob_end_clean();

		// <a> <img/> </a>
		$html .=
			'<a href="' . $hud_url . '/" id="' . $hud_id . '" title="' . $title . '">' .
				'<span>' . $title . '</span>' .
			'</a>';
	}
}



/*************\
|*           *|
|*  CONTENT  *|
|*           *|
\*************/

header('Content-Language: en-us');
header('Content-Type: text/html; charset=utf-8');

ob_start('ob_gzhandler');

?><!DOCTYPE html>
<html lang="en-US">
	<head>
		<title>Dota 2 HUD Gallery</title>
		<meta charset="utf-8" />
		<meta name="viewport" content="width=device-width, initial-scale=1" />
		<link href="//fonts.googleapis.com/css?family=Roboto+Condensed:300,700" media="all" rel="stylesheet" type="text/css"/>
		<style type="text/css">
			a {
				background-position: 24px 0;
				background-repeat: no-repeat;
				border-color: #000000;
				border-style: solid;
				border-width: 1px 0;
				box-sizing: content-box;
				display: block;
				height: 24px;
				margin: 0 auto;
				overflow: hidden;
				padding: 0 48px 0 24px;
				position: relative;
				width: 976px;
			}
				a span {
					background-color: #000000;
					display: block;
					font-family: "Roboto Condensed", sans-serif;
					font-weight: 300;
					height: 100%;
					left: 824px;
					line-height: 24px;
					overflow: hidden;
					position: absolute;
					text-align: center;
					top: 0;
					width: 224px;
				}
			body {
				background-color: #000000;
				font-size: 16px;
				margin: 0;
				padding: 24px 0 224px 0;
			}
			img {
				border-width: 0;
			}
			<?php echo $css; ?>
		</style>
	</head>
	<body>
		<div id="list"><?php echo $html; ?></div>
		<script type="text/javascript">

var as = document.getElementsByTagName("a"),
	collapse = function(e) {
		e = typeof(e) == "string" ? document.getElementById(e) : e;
		var h = e.style.height ? parseInt(e.style.height, 10) : 24,
			id = e.getAttribute("id");
		if (h > 24) {
			e.style.height = (h - 8) + "px";
			if (id in timeouts)
				clearTimeout(timeouts[id]);
			timeouts[id] = setTimeout('collapse("' + id + '");', 1);
		}
	},
	expand = function(e) {
		e = typeof(e) == "string" ? document.getElementById(e) : e;
		var h = e.style.height ? parseInt(e.style.height, 10) : 24,
			id = e.getAttribute("id");
		if (h < 224) {
			e.style.height = (h + 8) + "px";
			if (id in timeouts)
				clearTimeout(timeouts[id]);
			timeouts[id] = setTimeout('expand("' + id + '");', 1);
		}
	},
	list = document.getElementById("list"),
	timeouts = {},
	x;
for (x = 0; x < as.length; x++) {
	as.item(x).addEventListener("mouseout",
		function() {
			collapse(this);
		}
	);
	as.item(x).addEventListener(
		"mouseover",
		function() {
			collapse(list.lastChild);
			expand(this);
		}
	);
}

list.addEventListener(
	"mouseout",
	function() {
		expand(list.lastChild);
	}
);

expand(list.lastChild);

		</script>
	</body>
</html>
<?php

ob_end_flush();

?>