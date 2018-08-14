<?php

$custom = array_key_exists('custom', $_GET) &&
	preg_match('/^[\-\.\/\d\w]+$/', $_GET['custom']) ?
	$_GET['custom'] :
	false;

$hud = array_key_exists('hud', $_GET) &&
	preg_match('/^[\-\d\s\w]+$/', $_GET['hud']) &&
	is_dir($_GET['hud']) ?
	$_GET['hud'] :
	false;

// get outta here
if (!$custom && !$hud)
	exit();

header('Content-Language: en-us');
header('Content-Type: text/css; charset=utf-8');

ob_start('ob_gzhandler');

$elements = array(
	'#background-4-3' => 'inventory/background_4_3.png',
	'#background-wide' => 'inventory/background_wide.png',
	'#center-left' => 'actionpanel/center_left.png',
	'#center-left-wide' => 'actionpanel/center_left_wide.png',
	'#center-right' => 'actionpanel/center_right.png',
	'#day-night' => 'scoreboard/daynight.png',
	'#light-4-3' => 'actionpanel/light_4_3.png',
	'#light-16-9' => 'actionpanel/light_16_9.png',
	'#light-16-10' => 'actionpanel/light_16_10.png',
	'#light-right-4-3' => array('inventory/light_4_3.png', 'inventory/light_right_4_3.png'),
	'#light-right-16-9' => array('inventory/light_16_9.png', 'inventory/light_right_16_9.png'),
	'#light-right-16-10' => array('inventory/light_16_10.png', 'inventory/light_right_16_10.png'),
	'#minimapborder' => 'actionpanel/minimapborder.png',
	'#portrait' => 'actionpanel/portrait.png',
	'#portrait-bg' => 'icon.png',
	'#portrait-wide' => 'actionpanel/portrait_wide.png',
	'#rocks-4-3' => 'inventory/rocks_4_3.png',
	'#rocks-16-9' => 'inventory/rocks_16_9.png',
	'#rocks-16-10' => 'inventory/rocks_16_10.png',
	'#spacer' => 'inventory/spacer.png',
	'#spacer-16-9' => 'actionpanel/spacer_16_9.png',
	'#spacer-16-10' => 'actionpanel/spacer_16_10.png',
	'#stash-lower' => 'inventory/stash_lower.png',
	'#stash-lower:hover' => 'inventory/stash_active_lower.png',
	'#stash-upper' => 'inventory/stash_upper.png',
	'#topbar' => 'scoreboard/topbar.png'
);

// Alternative Styles
if (
	array_key_exists('style', $_GET) &&
	preg_match('/^\d+$/', $_GET['style'])
) {
	foreach ($elements as $id => $url) {
		if (is_array($url)) {
			foreach ($url as $u)
				array_unshift($elements[$id], preg_replace('/^(\w+)/', '$1/style' . $_GET['style'], $u));
		}
		else
			$elements[$id] = array(preg_replace('/^(\w+)/', '$1/style' . $_GET['style'], $elements[$id]), $elements[$id]);
	}
}

// Custom HUD
if ($custom) {
	foreach ($elements as $id => $url) {
		if (!is_array($url))
			$url = array($url);
		foreach ($url as $i => $u)
			$url[$i] = 'url("http://' . $custom . '/' . $u . '")';
		echo $id, ' { background-image: ', implode(', ', $url), '; }', "\n";
	}
}

// HUD
else if ($hud) {

	foreach ($elements as $id => $url) {

		// Find which file names this HUD uses.
		if (is_array($url)) {
			foreach ($url as $u) {
				if (file_exists($hud . '/' . $u)) {
					$elements[$id] = $u;
					break;
				}
			}

			// Remove unused images.
			if (is_array($elements[$id]))
				unset($elements[$id]);
		}

		// Remove unused images.
		else if (!file_exists($hud . '/' . $url))
			unset($elements[$id]);
	}

	if (!array_key_exists('#day-night', $elements))
		$elements['#day-night'] = '../default/scoreboard/daynight.png';
	if (!array_key_exists('#topbar', $elements))
		$elements['#topbar'] = '../default/scoreboard/topbar.png';

	foreach ($elements as $id => $url)
		echo $id, ' { background-image: url("', $url, '"); }', "\n";

}

ob_end_flush();

?>