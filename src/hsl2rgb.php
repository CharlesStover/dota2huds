<?php
/**
 * Color space conversion
 *  
 * (R,G,B) -> (H,S,L)
 * 
 * R,G,B ~ <0,255>
 * H ~ <0,360>
 * S,L ~ <0,1>
 * 
 * @param array|byte $rgb
 * @param byte $g
 * @param byte $b
 * @return array ($h,$s,$l)
 */
function rgb2hsl($rgb,$g=null,$b=null){
	
	if (is_array($rgb) && sizeof($rgb) == 3) list($r, $g, $b) = $rgb;
	else $r=$rgb;
	
	$clrMin = min($r, $g, $b);
	$clrMax = max($r, $g, $b);
	$deltaMax = $clrMax - $clrMin;
		
	$L = ($clrMax + $clrMin) / 510;
		
	if (0 == $deltaMax){
		$H = 0;
		$S = 0;
	}
	else{
		if (0.5 > $L){
			$S = $deltaMax / ($clrMax + $clrMin);
		}
		else{
			$S = $deltaMax / (510 - $clrMax - $clrMin);
		}

		if ($clrMax == $r) {
			$H = ($g - $b) / (6.0 * $deltaMax);
		}
		else if ($clrMax == $g) {
			$H = 1/3 + ($b - $r) / (6.0 * $deltaMax);
		}
		else {
			$H = 2 / 3 + ($r - $g) / (6.0 * $deltaMax);
		}

		if (0 > $H) $H += 1;
		if (1 < $H) $H -= 1;
	}
	
	$H=round($H*360);		
	return array($H, $S,$L);
}


/**
 * Color space conversion
 *  
 * (H,S,L) -> (R,G,B)
 * 
 * H ~ <0,360>
 * S,L ~ <0,1>
 * R,G,B ~ <0,255>
 * 
	 * @param array|int $hsl|$h
 * @param float $s
 * @param float $l
 * @return array ($r,$g,$b)
 */
function hsl2rgb($hsl, $s=null, $l=null) {
 	
	if (is_array($hsl) && sizeof($hsl) == 3) list($h, $s, $l) = $hsl;
	else $h=$hsl;
	
	
	if ($s == 0) {
		$r = $g = $b = round($l * 255);
	}
	else {
		if ($l <= 0.5) {
			$m2 = $l * ($s + 1);
		}
		else
		{
			$m2 = $l + $s - $l * $s;
		}
		$m1 = $l * 2 - $m2;
		$hue = $h / 360;
		
		$r = hsl2rgb_hue2rgb($m1, $m2, $hue + 1/3);
		$g = hsl2rgb_hue2rgb($m1, $m2, $hue);
		$b = hsl2rgb_hue2rgb($m1, $m2, $hue - 1/3);
	}
	return array($r, $g, $b);
}

function hsl2rgb_hue2rgb($m1, $m2, $hue) {
	if ($hue < 0) $hue += 1;
	else if ($hue > 1) $hue -= 1;

	if (6 * $hue < 1)
	$v = $m1 + ($m2 - $m1) * $hue * 6;
	else if (2 * $hue < 1)
	$v = $m2;
	else if (3 * $hue < 2)
	$v = $m1 + ($m2 - $m1) * (2/3 - $hue) * 6;
	else
	$v = $m1;

	return round(255 * $v);
}
?>