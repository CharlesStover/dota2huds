<?php

exit();

function rgbToHsl( $r, $g, $b ) {
	$oldR = $r;
	$oldG = $g;
	$oldB = $b;

	$r /= 255;
	$g /= 255;
	$b /= 255;

    $max = max( $r, $g, $b );
	$min = min( $r, $g, $b );

	$h;
	$s;
	$l = ( $max + $min ) / 2;
	$d = $max - $min;

    	if( $d == 0 ){
        	$h = $s = 0; // achromatic
    	} else {
        	$s = $d / ( 1 - abs( 2 * $l - 1 ) );

		switch( $max ){
	            case $r:
	            	$h = 60 * fmod( ( ( $g - $b ) / $d ), 6 ); 
                        if ($b > $g) {
	                    $h += 360;
	                }
	                break;

	            case $g: 
	            	$h = 60 * ( ( $b - $r ) / $d + 2 ); 
	            	break;

	            case $b: 
	            	$h = 60 * ( ( $r - $g ) / $d + 4 ); 
	            	break;
	        }			        	        
	}

	return array( round( $h, 2 ), round( $s, 2 ), round( $l, 2 ) );
}

foreach (new DirectoryIterator('.') as $file) {

	if (
		$file->isFile() &&
		preg_match('/\.png$/', $file->getFilename())
	) {
		$preview = imagecreatefrompng($file->getFilename());
		$previewsize = getimagesize($file->getFilename());
		$average = array(0, 0, 0);
		$total = 0;
		for ($x = 0; $x < $previewsize[0]; $x++) {
			for ($y = 0; $y < $previewsize[1]; $y++) {
				$color = imagecolorat($preview, $x, $y);
				if ($color != 0) {
					$rgb = array(
						($color >> 16) & 0xFF,
						($color >> 8) & 0xFF,
						$color & 0xFF
					);
					if (
						$rgb[0] > 64 ||
						$rgb[1] > 64 ||
						$rgb[2] > 64
					) {
						$average[0] += $rgb[0];
						$average[1] += $rgb[1];
						$average[2] += $rgb[2];
						$total++;
					}
				}
			}
		}
		imagedestroy($preview);
		$average[0] /= $total;
		$average[1] /= $total;
		$average[2] /= $total;
		$average = array_map('round', $average);
		file_put_contents($file->getFilename() . '.rgb', implode(',', $average));
		$hsl = rgbToHsl($average[0], $average[1], $average[2]);
		file_put_contents($file->getFilename() . '.hue', $hsl[0]);
		echo $file->getFilename(), '<br />';
	}

}

?>