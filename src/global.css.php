<?php

header('Content-Language: en-us');
header('Content-Type: text/css; charset=utf-8');

ob_start('ob_gzhandler');

$css = file_get_contents('global.css');

// calc(px * %)
preg_match_all('/calc\((\d+)px \* (\-?\d+\.\d+)\)/', $css, $matches);
$count = count($matches[0]);
for ($x = 0; $x < $count; $x++)
	$css = str_replace($matches[0][$x], round($matches[1][$x] * $matches[2][$x]) . 'px', $css);

// calc(px - px)
preg_match_all('/calc\((\d+)px \- (\d+)px\)/', $css, $matches);
$count = count($matches[0]);
for ($x = 0; $x < $count; $x++)
	$css = str_replace($matches[0][$x], ($matches[1][$x] - $matches[2][$x]) . 'px', $css);

// strip comments
$css = preg_replace('/\/\*.+?\*\/\s+/s', '', $css);

// strip whitespace
$css = str_replace(array("\t", "\r", "\n"), '', $css);

echo $css;

ob_end_flush();

?>