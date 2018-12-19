<?php

$location = './downloads/' . $_GET['filename'];
header('Content-Type: application/force-download');
header("Content-Disposition: attachment; filename='". $_GET['filename'] .".pdf'");
header('Content-Length: ' . filesize($location));
readfile($location);

?>
