<?php
namespace PROSSaude\Blocks;
use PROSSaude\Blocks\AssetHandler;
AssetHandler::enqueueFseScript(
	'bootstrap_js',
	"https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js",
	[],
	'5.3.3',
	[
		'crossorigin' => 'anonymous',
		'defer' => 'true',
		'integrity' => "sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz"
	]
);
AssetHandler::enqueueEditStyle(
	'bootstrap_css',
	"https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css",
	[],
	'5.3.3',
	'all',
	[
		"crossorigin" => "anonymous",
		"integrity" => "sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH"
	]
);