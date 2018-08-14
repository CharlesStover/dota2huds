<?php

include '../../../shared/classes/SiteMap.php';

$sitemap = new SiteMap('http://dota2.gamingmedley.com/hud_skins/');
$sitemap->url('', 'index.php', 'monthly', 1.0);

include 'huds.php';
$hud_skins = array_keys($huds);
$count_hud_skins = count($hud_skins);

for ($x = 0; $x < $count_hud_skins; $x++)
	$sitemap->url(
		$hud_skins[$x],
		array(
			$hud_skins[$x] . '/icon.png',
			$hud_skins[$x] . '/scoreboard/daynight.png'
		),
		'yearly',
		0.5
	);

?>