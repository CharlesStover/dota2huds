<?php

include 'huds.php';

// If we're viewing the HUD gallery,
if (preg_match('/\/hud\_skins\/(?:index\.\w+)?$/', $_SERVER['REQUEST_URI'])) {
	define('CUSTOM', false);
	define('GALLERY', true);
	define('HUD', false);
	define('HUD_NAME', false);
	define('HUD_URL', false);
	define('STYLE', false);
}

// If we're viewing an exact HUD,
else {
	define('GALLERY', false);

	// Get the HUD ID
	preg_match('/\/([\+\-\d\w]+)\/(?:index\.html)?(?:\?.*)?$/', $_SERVER['REQUEST_URI'], $hud);

	// Validate it.
	$hud[1] = array_key_exists(1, $hud) ? str_replace('+', ' ', $hud[1]) : false;

	if (is_dir($hud[1])) {
		define('CUSTOM', false);
		define('HUD', $hud[1]);
		unset($hud);

		// Get HUD name
		$hud_name = $huds[HUD];

		// If HUD has styles/multiple names,
		if (is_array($hud_name)) {

			// Are we viewing an alternate style?
			define(
				'STYLE',
				array_key_exists('style', $_GET) &&
				preg_match('/^\d+$/', $_GET['style']) &&
				(
					is_dir(HUD . '/actionpanel/style' . $_GET['style']) ||
					is_dir(HUD . '/inventory/style' . $_GET['style']) ||
					is_dir(HUD . '/scoreboard/style' . $_GET['style'])
				) ?
				$_GET['style'] :
				0
			);

			define('HUD_NAME', $hud_name[0] . ' (' . $hud_name[STYLE + 1] . ')');
			define('HUD_URL', 'http://dota2.gamingmedley.com/hud_skins/' . HUD . '/' . (STYLE ? '?style=' . STYLE : ''));
		}

		// No styles for this HUD!
		else {
			define('HUD_NAME', HUD == 'default' ? 'Default' : $hud_name);
			define('HUD_URL', 'http://dota2.gamingmedley.com/hud_skins/' . HUD . '/');
			define('STYLE', false);
		}
		unset($hud_name);
	}

	// Custom HUDs
	else if (
		array_key_exists('hud', $_GET) &&
		preg_match('/^[\-\.\/\d\w]+$/', $_GET['hud'])
	) {
		define('CUSTOM', true);
		define('HUD', $_GET['hud']);
		define('HUD_NAME', 'Custom HUD');
		define('HUD_URL', 'http://dota2.gamingmedley.com/hud_skins/?hud=' . HUD);
		define(
			'STYLE',
			array_key_exists('style', $_GET) &&
			preg_match('/^\d+$/', $_GET['style']) ?
			$_GET['style'] :
			0
		);
	}

	// Not root, and not a valid HUD ID? Shut 'er down!
	else {
		header('HTTP/1.0 404 Not Found');
		exit();
	}
}

header('Content-Language: en-us');
header('Content-Type: text/html; charset=utf-8');

ob_start('ob_gzhandler');

?><!DOCTYPE html>
<html lang="en">
	<head>
		<title><?php echo GALLERY ? 'Dota 2 HUD Gallery' : HUD_NAME; ?></title>
		<meta charset="utf-8" />
		<meta name="viewport" content="width=device-width, initial-scale=1.0" />
		<link href="<?php echo GALLERY ? 'favicon.png' : 'icon.png'; ?>" rel="icon" type="image/png" />
<?php

// If we're viewing the gallery, get the global HUD style.
if (GALLERY) {

?>
		<link href="global.css" media="screen" rel="stylesheet" type="text/css" />
		<link href="default/style.css" id="default" media="screen" rel="stylesheet" title="Default" type="text/css" />
<?php

}

// If we're viewing a specific HUD, get the global HUD style from the parent directory.
else {

	// Custom HUD
	if (CUSTOM) {

?>
		<link href="global.css" media="screen" rel="stylesheet" type="text/css" />
		<link href="hud.css.php?custom=<?php echo HUD; if (STYLE) echo '&amp;style=', STYLE; ?>" media="screen" rel="stylesheet" type="text/css" />
<?php

	}
	else {

?>
		<link href="../global.css" media="screen" rel="stylesheet" type="text/css" />
		<link href="style<?php if (STYLE) echo STYLE; ?>.css" media="screen" rel="stylesheet" type="text/css" />
<?php

	}
}

?>
	</head>
	<body>
		<div id="top">

			<!-- scoreboard -->
			<div id="topbar"></div>
			<div id="icon-preview-top"></div>
			<div id="day-night"></div>
		</div>
		<div id="bottom">
			<div id="minimap"></div>

			<!-- actionpanel -->
			<div id="center-left"></div>
			<div id="center-left-wide"></div>
			<div id="center-right"></div>
			<div id="minimapborder"></div>
			<div id="spacer-16-9"></div>
			<div id="spacer-16-10"></div>
			<div id="portrait-bg"></div>
			<div id="portrait"></div>
			<div id="portrait-wide"></div>
			<div id="light-4-3"></div>
			<div id="light-16-9"></div>
			<div id="light-16-10"></div>

			<!-- inventory -->
			<div id="spacer"></div>
			<div id="background-4-3"></div>
			<div id="background-wide"></div>
			<div id="rocks-4-3"></div>
			<div id="rocks-16-9"></div>
			<div id="rocks-16-10"></div>
			<div id="light-right-4-3"></div>
			<div id="light-right-16-9"></div>
			<div id="light-right-16-10"></div>

			<!-- overlay -->
			<div id="icon-preview-bottom"></div>
			<div id="stash-upper"></div>
			<div id="stash-lower"></div>
		</div>
		<script src="<?php if (!GALLERY && !CUSTOM) echo '../'; ?>resize.js" type="text/javascript"></script>
<?php

if (GALLERY) {

?>
		<div class="gallery" id="middle">
			<div class="bg links">
				<strong><span id="ar-4-3">4:3</span><span id="ar-16-9">16:9</span><span id="ar-16-10">16:10</span></strong>
				<a href="http://steamcommunity.com/market/search?category_570_Hero%5B%5D=any&amp;category_570_Slot%5B%5D=any&amp;category_570_Type%5B%5D=tag_hud_skin&amp;appid=570" id="market" rel="nofollow" target="_blank">market</a>
				<a href="default/" id="permalink">permalink</a>
			</div>
			<div class="bg links">
				<a href="http://www.charlesstover.com/donate" target="_blank" title="Buy me a beer?">donate</a>
				<a href="http://www.reddit.com/r/DotA2/comments/2qswki/i_spent_longer_than_im_willing_to_admit_making_a/" rel="nofollow" title="Leave a suggestion on /r/Dota2.">feedback</a>
				<!--<a href="../loading_screens/" title="Dota 2 Loading Screen Gallery">loading screens</a>-->
			</div>
		</div>
		<script src="huds.js" type="text/javascript"></script>
		<script src="gallery.js" type="text/javascript"></script>
<?php

}

else {

?>
		<div class="hud" id="middle">
			<a class="twitter-share-button" data-count="none" data-dnt="true" data-text="<?php echo HUD_NAME; ?>" data-url="<?php echo HUD_URL; ?>" href="https://twitter.com/share" rel="nofollow" title="Or don't. I'm a button, not a cop.">Tweet</a>
			<div>
				<label id="url">url: &nbsp; &nbsp;<input size="42" type="text" value="<?php echo HUD_URL; ?>" /></label> <span class="copied" id="url-copied"></span><br />
				<label id="bbcode">bbcode: <input size="42" type="text" value="[url=<?php echo HUD_URL; ?>[<?php echo HUD_NAME; ?>[/url]" /></label> <span class="copied" id="bbcode-copied"></span><br />
				<label id="reddit">reddit: <input size="42" type="text" value="[<?php echo HUD_NAME; ?>](<?php echo HUD_URL; ?>)" /></label> <span class="copied" id="reddit-copied"></span><br />
			</div>
			<div class="bg links">
				<strong><span id="ar-4-3">4:3</span><span id="ar-16-9">16:9</span><span id="ar-16-10">16:10</span></strong>
				<a href="http://www.charlesstover.com/donate" target="_blank" title="Buy me a beer?">donate</a>
				<a href="<?php if (!CUSTOM) echo '.'; ?>./" title="Dota 2 HUD Gallery">gallery</a>
<?php

	if (!CUSTOM) {

?>
				<a href="http://steamcommunity.com/market/search?category_570_Hero%5B%5D=any&amp;category_570_Slot%5B%5D=any&amp;category_570_Type%5B%5D=tag_hud_skin&amp;appid=570&amp;q=<?php echo rawurlencode(preg_replace('/ \(.+\)$/', '', HUD_NAME)); ?>" id="market" target="_blank">market</a>
<?php

	}

?>
			</div>
		</div>
		<script src="<?php if (!CUSTOM) echo '.'; ?>./../resources/zeroclipboard-2.1.6/ZeroClipboard.min.js" type="text/javascript"></script>
		<script src="<?php if (!CUSTOM) echo '.'; ?>./share.js" type="text/javascript"></script>
<?php

}

?>
		<script src="http://i.charlesstover.com/google-analytics/UA-62492911-2.js" type="text/javascript"></script>
	</body>
</html>
<?php

ob_end_flush();

?>