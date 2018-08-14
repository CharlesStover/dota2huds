<?php

header('Content-Language: en-us');
header('Content-Type: text/javascript; charset=utf-8');

include 'huds.php';

$items = array();
foreach ($huds as $id => $title) {
	$key = !preg_match('/^[\d\w]+$/', $id) ?
		'"' . $id . '"' :
		$id;
	if (is_array($title)) {
		foreach ($title as $style)
			array_push($items, $key . ': ["' . implode('", "', $title) . '"]');
	}
	else
		array_push($items, $key . ': "' . $title . '"');
}

ob_start('ob_gzhandler');
echo 'var HUDs = { ', implode(', ', $items), ' };';
ob_end_flush();

?>