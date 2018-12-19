<?php
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        header('Access-Control-Allow-Origin: *');
        header('Access-Control-Allow-Methods: POST, GET, DELETE, PUT, PATCH, OPTIONS');
        header('Access-Control-Allow-Headers: token, Content-Type');
        header('Access-Control-Max-Age: 1728000');
        header('Content-Length: 0');
        header('Content-Type: text/plain');
        die();
    }

header('Access-Control-Allow-Origin: *');


echo 'Loading pdfs...';

require __DIR__ . '/vendor/autoload.php';
use mikehaertl\wkhtmlto\Pdf;

$data = file_get_contents('php://input');
$jsondata = json_decode($data, true);
error_log(var_dump($jsondata));

//$pdf = new Pdf;
$pdf = new Pdf(array(
    // Explicitly tell wkhtmltopdf that we're using an X environment
    'use-xserver',
    'dpi' => 300,
    'page-size' => 'Letter',
    'orientation' => $jsondata['orientation'],
    'margin-left' => $jsondata['margins']['left'],
    'margin-right' => $jsondata['margins']['right'],
    'margin-top' => $jsondata['margins']['top'],
    'margin-bottom' => $jsondata['margins']['bottom'],

    // Enable built in Xvfb support in the command
    'commandOptions' => array(
        'enableXvfb' => true,

        // Optional: Set your path to xvfb-run. Default is just 'xvfb-run'.
        // 'xvfbRunBinary' => '/usr/bin/xvfb-run',

        // Optional: Set options for xfvb-run. The following defaults are used.
        // 'xvfbRunOptions' =>  '--server-args="-screen 0, 1024x768x24"',
    ),
));


// Add a HTML file, a HTML string or a page from a URL
$pdf->addPage("<html>" . $jsondata['content'] . "</html>");

$filename = str_replace(' ', '_', $jsondata['name']);

// Save the PDF
$pdf->saveAs('./downloads/' . $filename);

// ... or send to client for inline display
//$pdf->send();

// ... or send to client as file download
//$pdf->send('report.pdf');
//var_dump($pdf);

//echo $pdf->toString();
//error_log($pdf->toString());

//$location = './downloads/' . $jsondata['name'];
//header('Content-Type: application/pdf');
//header("Content-Disposition: attachment; filename='". $jsondata['name'] .".pdf'");
//header('Content-Length: ' . filesize($location));
//readfile($location);

echo json_encode( array('filename' => $filename) );

?>
