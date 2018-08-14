<?php

// File
if (array_key_exists('REQUEST_URI', $_SERVER)) {
	$file = substr($_SERVER['REQUEST_URI'], strlen(dirname($_SERVER['PHP_SELF'])) + 1);
	$file = explode('?', $file);
	$file = array_shift($file);
	$file = str_replace(array('+', '%20'), ' ', $file);

	if (file_exists($file)) {

		$if_modified_since = array_key_exists('HTTP_IF_MODIFIED_SINCE', $_SERVER) ? strtotime($_SERVER['HTTP_IF_MODIFIED_SINCE']) : 0;

		// gzip
		// optipng seems to compress it so much that gzip does practically nothing.
		/*
		if (
			array_key_exists('HTTP_ACCEPT_ENCODING', $_SERVER) &&
			strpos($_SERVER['HTTP_ACCEPT_ENCODING'], 'gzip') !== false
		) {

			// Create .gz if it doesn't exist.
			if (!file_exists($file . '.gz'))
				file_put_contents(
					$file . '.gz',
					gzencode(file_get_contents($file), 9)
				);

			// Send the smaller of the two.
			if (filesize($file . '.gz') < filesize($file)) {
				header('Content-Encoding: gzip');
				header('Vary: Accept-Encoding');
				$file .= '.gz';
			}

		}*/

		// PNG
		header('Content-Type: image/png');

		// Cache
		header('Cache-Control: public, max-age=315360000');
		header('Expires: ' . gmdate('D, d M Y H:i:s', time() + 315360000) . ' GMT');
		header('Max-Age: 315360000');

		// Not modified since last cached,
		$filemtime = filemtime($file);
		if ($if_modified_since == $filemtime) {
			header('Last-Modified: ' . gmdate('D, d M Y H:i:s', $filemtime) . ' GMT', true, 304);
			exit();
		}
		else {
			header('Content-Length: ' . filesize($file));
			header('Last-Modified: ' . gmdate('D, d M Y H:i:s', $filemtime) . ' GMT', true, 200);
			echo file_get_contents($file);
		}
	}
}

?>