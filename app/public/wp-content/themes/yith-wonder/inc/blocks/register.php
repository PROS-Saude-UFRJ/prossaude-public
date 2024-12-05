<?php
namespace PROSSaude\Blocks;
use PROSSaude\Blocks\BlockHandler;
add_filter('block_categories_all', function ($categories) {
	array_unshift($categories, [
		'slug' => 'bootstrap_ui',
		'title' => 'Bootstrap',
		'icon' => null,
	]);
	return $categories;
}, 10, 2);
add_action('admin_init', function() {
	$css_content = wp_remote_get(includes_url('css/dashicons.css'));
	if (is_wp_error($css_content)) {
		error_log('Failed to get css_content');
		return;
	}
	preg_match_all('/\.dashicons-([a-z0-9-]+):before/', wp_remote_retrieve_body($css_content), $matches);
	if (empty($matches[1])) error_log('No dashicons found in dashicons css');
});
add_action('init', fn() => 
	BlockHandler::registerBootstrapBlock('bootstrap/control', [
		'title' => 'Campo de Controle',
		'icon' => 'button',
		'description' => 'Campo básico de entradas controladas para formulários.',
		'script_path' => 'FormControl.js',
		'script_handle' => 'form_control_script',
		'style_path' => 'formControl.css',
		'style_handle' => 'form_control_style',
		'keywords' => ['input', 'entrada', 'campo', 'controle', 'form', 'formulário'],
		'client_script_path' => 'forms/control/index.js',
		'client_script_prefix' => 'form-control',
	]), 10
);
add_action('init', fn() =>
	BlockHandler::registerBootstrapBlock('bootstrap/faudio', [
		'title' => 'Campo de Áudio',
		'icon' => 'media-audio',
		'description' => 'Campo básico de entrada de áudio.',
		'script_path' => 'FormAudioFile.js',
		'script_handle' => 'form_audio_file_script',
		'style_path' => 'formAudio.css',
		'style_handle' => 'form_audio_style',
		'keywords' => ['input', 'entrada', 'campo', 'áudio', 'audio', 'form', 'formulário'],
		'client_script_path' => 'forms/fileAudio/index.js',
		'client_script_prefix' => 'form-audio-file',
	]), 11
);
add_action('init', fn() =>
	BlockHandler::registerBootstrapBlock('bootstrap/fimage', [
		'title' => 'Campo de Imagem',
		'icon' => 'media-interactive',
		'description' => 'Campo básico de entrada de imagem.',
		'script_path' => 'FormImageFile.js',
		'script_handle' => 'form_image_file_script',
		'style_path' => 'formImage.css',
		'style_handle' => 'form_image_style',
		'keywords' => ['input', 'entrada', 'campo', 'imagem', 'image', 'form', 'formulário'],
		'client_script_path' => 'forms/fileImage/index.js',
		'client_script_prefix' => 'form-image-file',
	]), 12
);
add_action('init', fn() =>
	BlockHandler::registerBootstrapBlock('bootstrap/fpdf', [
		'title' => 'Campo de PDF',
		'icon' => 'media-document',
		'description' => 'Campo básico de entrada de PDF.',
		'script_path' => 'FormPDFFile.js',
		'script_handle' => 'form_pdf_file_script',
		'style_path' => 'formPdf.css',
		'style_handle' => 'form_pdf_style',
		'keywords' => ['input', 'entrada', 'campo', 'form', 'formulário', 'pdf'],
		'client_script_path' => 'forms/filePdf/index.js',
		'client_script_prefix' => 'form-pdf-file'
	]), 13
);
add_action('init', fn() => 
	BlockHandler::registerBootstrapBlock('bootstrap/fvideo', 
	[
		'title' => 'Campo de Vídeo',
		'icon' => 'media-video',
		'description' => 'Campo básico de entrada de Vídeo.',
		'script_path' => 'FormVideoFile.js',
		'script_handle' => 'form_video_file_script',
		'style_path' => 'formVideo.css',
		'style_handle' => 'form_video_style',
		'keywords' => ['input', 'entrada', 'campo', 'form', 'formulário', 'video', 'vídeo'],
		'client_script_path' => 'forms/fileVideo/index.js',
		'client_script_prefix' => 'form-video-file'
	]), 14
);
add_action('init', fn() =>
	BlockHandler::registerBootstrapBlock('bootstrap/date',
	[
		'title' => 'Campo de Data',
		'icon' => 'calendar-alt',
		'description' => 'Campo básico de entrada de Data.',
		'script_path' => 'FormDate.js',
		'script_handle' => 'form_date_script',
		'style_path' => 'formDate.css',
		'style_handle' => 'form_date_style',
		'keywords' => ['input', 'entrada', 'campo', 'form', 'formulário', 'date', 'calendário'],
		'client_script_path' => 'forms/date/index.js',
		'client_script_prefix' => 'form-date'
	]), 15
);
add_action('init', fn() =>
	BlockHandler::registerBootstrapBlock('bootstrap/maxdate', [
		'title' => 'Campo de Data Ocorrida',
		'icon' => 'welcome-widgets-menus',
		'description' => 'Campo de entrada de Data ocorrida.',
		'script_path' => 'FormMaxDate.js',
		'script_handle' => 'form_date_max_script',
		'style_path' => 'formDate.css',
		'style_handle' => 'form_date_style',
		'keywords' => ['input', 'entrada', 'campo', 'form', 'formulário', 'date', 'calendário', 'ocorrido'],
		'client_script_path' => 'forms/dateMaxToday/index.js',
		'client_script_prefix' => 'form-max-date'
	]), 16
);
add_action('init', fn() =>
	BlockHandler::registerBootstrapBlock('bootstrap/mindate', [
		'title' => 'Campo de Data a Ocorrer',
		'icon' => 'calendar',
		'description' => 'Campo de entrade de Data a ocorrer.',
		'script_path' => 'FormMinDate.js',
		'script_handle' => 'form_date_min_script',
		'style_path' => 'formDate.css',
		'style_handle' => 'form_date_style',
		'keywords' => ['input', 'entrada', 'campo', 'form', 'formulário', 'date', 'calendário', 'ocorrer'],
		'client_script_path' => 'forms/dateMinToday/index.js',
		'client_script_prefix' => 'form-min-date'
	]), 17
);
add_action('init', fn() =>
	BlockHandler::registerBootstrapBlock('bootstrap/datehour', [
		'title' => 'Campo de Data com Horário Simples',
		'icon' => 'tide',
		'description' => 'Campo de entrada de Data com Horário.',
		'script_path' => 'FormDateHour.js',
		'script_handle' => 'form_date_hour_script',
		'style_path' => 'formDate.css',
		'style_handle' => 'form_date_style',
		'keywords' => [
			'input', 'entrada', 'campo', 'form', 'formulário',
			'date', 'hour', 'horário'
		],
		'client_script_path' => 'forms/dateHour/index.js',
		'client_script_prefix' => 'form-date-hour'
	]), 18
);
add_action('init', fn() =>
	BlockHandler::registerBootstrapBlock('bootstrap/datahourmax', [
		'title' => "Campo de Data com Horário Simples já Ocorrido",
		'icon' => 'backup',
		'description' => 'Campo de entrada de Data com Horário já Ocorrido.',
		'script_path' => 'FormDateHourMax.js',
		'script_handle' => 'form_date_hour_max_script',
		'style_path' => 'formDate.css',
		'style_handle' => 'form_date_style',
		'keywords' => [
			'input', 'entrada', 'campo', 'form', 'formulário',
			'date', 'hour', 'horário', 'máximo', 'max'
		],
		'client_script_path' => 'forms/dateHourMax/index.js',
		'client_script_prefix' => 'form-date-hour-max'
	]), 19
);
add_action('init', fn() =>
	BlockHandler::registerBootstrapBlock('bootstrap/datehourmin', [
		'title' => 'Campo de Data com Horário a Ocorrer',
		'icon' => 'schedule',
		'description' => 'Campo de entrada de Data com Horário a Ocorrer.',
		'script_path' => 'FormDateHourMin.js',
		'script_handle' => 'form_date_hour_min_script',
		'style_path' => 'formDate.css',
		'style_handle' => 'form_date_style',
		'keywords' => [
			'input', 'entrada', 'campo', 'form', 'formulário',
			'date', 'hour', 'horário', 'mínimo', 'min'
		],
		'client_script_path' => 'forms/dateHourMin/index.js',
		'client_script_prefix' => 'form-date-hour-min'
	]), 20
);
add_action('init', fn() => 
	BlockHandler::registerBootstrapBlock('bootstrap/email', [
		'title' => 'Campo de E-mail',
		'icon' => 'email-alt',
		'description' => 'Campo de entrada de E-amil.',
		'script_path' => 'FormEmail.js',
		'script_handle' => 'form_email_script',
		'style_path' => 'formControl.css',
		'style_handle' => 'form_control_style',
		'keywords' => [
			'input', 'entrada', 'campo', 'form', 'formulário',
			'email', 'e-mail'
		],
		'client_script_path' => 'forms/email/index.js',
		'client_script_prefix' => 'form-email',
	]), 21
);
add_action('init', fn() => 
	BlockHandler::registerBootstrapBlock('bootstrap/number', [
		'title' => 'Campo de Número',
		'icon' => 'editor-ol',
		'description' => 'Campo de entrada de Número.',
		'script_path' => 'FormNumber.js',
		'script_handle' => 'form_number_script',
		'style_path' => 'formControl.css',
		'style_handle' => 'form_control_style',
		'keywords' => [
			'input', 'entrada', 'campo', 'form', 'formulário',
			'number', 'número'
		],
		'client_script_path' => 'forms/number/index.js',
		'client_script_prefix' => 'form-number'
	]), 22
);
add_action('init', fn() =>
	BlockHandler::registerBootstrapBlock('bootstrap/search', [
		'title' => 'Campo de Pesquisa',
		'icon' => 'search',
		'description' => 'Campo de entrada de Pesquisa.',
		'script_path' => 'FormSearch.js',
		'script_handle' => 'form_search_script',
		'style_path' => 'formControl.css',
		'style_handle' => 'form_control_style',
		'keywords' => [
			'input', 'entrada', 'campo', 'form', 'formulário',
			'search', 'pesquisa'
		],
		'client_script_path' => 'forms/search/index.js',
		'client_script_prefix' => 'form-search'
	]), 23
);
add_action('init', fn() => 
	BlockHandler::registerBootstrapBlock('bootstrap/url', [
		'title' => 'Campo de URL',
		'icon' => 'admin-links',
		'description' => 'Campo de entrada de URL.',
		'script_path' => 'FormURL.js',
		'script_handle' => 'form_url_script',
		'style_path' => 'formControl.css',
		'style_handle' => 'form_control_style',
		'keywords' => [
			'input', 'entrada', 'campo', 'form', 'formulário',
			'url', 'uri', 'link', 'hyperlink'
		],
		'client_script_path' => 'forms/url/index.js',
		'client_script_prefix' => 'form-url'
	]), 24
);
add_action('init', fn() =>
	BlockHandler::registerBootstrapBlock('bootstrap/time', [
		'title' => 'Campo de Horário',
		'icon' => 'sticky',
		'description' => 'Campo de entrada de Horário.',
		'script_path' => 'FormTime.js',
		'script_handle' => 'form_time_script',
		'style_path' => 'formControl.css',
		'style_handle' => 'form_control_style',
		'keywords' => [
			'input', 'entrada', 'campo', 'form', 'formulário',
			'horário', 'hour', 'time', 'tempo'
		],
		'client_script_path' => 'forms/time/index.js',
		'client_script_prefix' => 'form-time'
	]), 25
);
add_action('init', fn() =>
	BlockHandler::registerBootstrapBlock('bootstrap/month', [
		'title' => 'Campo de Mês',
		'icon' => 'excerpt-view',
		'description' => 'Campo de entrada de Mês.',
		'script_path' => 'FormMonth.js',
		'script_handle' => 'form_month_script',
		'style_path' => 'formControl.css',
		'style_handle' => 'form_control_style',
		'keywords' => [
			'input', 'entrada', 'campo', 'form', 'formulário',
			'mês', 'month'
		],
		'client_script_path' => 'forms/dateMonth/index.js',
		'client_script_prefix' => 'form-month'
	]), 26
);
add_action('init', fn() =>
	BlockHandler::registerBootstrapBlock('bootstrap/week', [
		'title' => 'Campo de Semana',
		'icon' => 'tagcloud',
		'description' => 'Campo de entrada de Semana.',
		'script_path' => 'FormWeek.js',
		'script_handle' => 'form_week_script',
		'style_path' => 'formControl.css',
		'style_handle' => 'form_control_style',
		'keywords' => [
			'input', 'entrada', 'campo', 'form', 'formulário',
			'semana', 'week'
		],
		'client_script_path' => 'forms/dateWeek/index.js',
		'client_script_prefix' => 'form-month'
	]), 27
);
add_action('init', fn() => 
	BlockHandler::registerBootstrapBlock('bootstrap/color', [
		'title' => 'Campo de Cor',
		'icon' => 'admin-appearance',
		'description' => 'Campo de entrada de Cor.',
		'script_path' => 'FormColor.js',
		'script_handle' => 'form_color_script',
		'style_path' => 'formControl.css',
		'style_handle' => 'form_control_style',
		'keywords' => [
			'input', 'entrada', 'campo', 'form', 'formulário',
			'color', 'cor', 'picker'
		],
		'client_script_path' => 'forms/color/index.js',
		'client_script_prefix' => 'form-color'
	]), 28
);
add_action('init', fn() =>
	BlockHandler::registerBootstrapBlock('boostrap/text', [
		'title' => 'Campo de Texto Longo',
		'icon' => 'text-page',
		'description' => 'Campo para a entrada de Textos longos.',
		'script_path' => 'FormText.js',
		'script_handle' => 'form_text_script',
		'style_path' => 'formControl.css',
		'style_handle' => 'form_control_style',
		'keywords' => [
			'input', 'entrada', 'campo', 'form', 'formulário',
			'texto', 'text'
		],
		'client_script_path' => 'forms/text/index.js',
		'client_script_prefix' => 'form-text-area'
	]), 29
);


add_action('init', fn() => 
	BlockHandler::registerBootstrapBlock('bootstrap/range', [
		'title' => 'Campo de Variação',
		'icon' => 'image-flip-horizontal',
		'description' => 'Campo de Variação Horizontal.',
		'script_handle' > 'form_range_script',
		'script_path' => 'FormRange.js',
		'style_handle' => 'form_control_style',
		'style_path' => 'formControl.css',
		'keywords' => ['input', 'entrada', 'campo', 'form', 'formulário', 'range', 'variação'],
		'client_script_path' => 'forms/range/index.js',
		'client_script_prefix' => 'form-range'
	]), 32
);
add_action('init', fn() => 
	BlockHandler::registerBootstrapBlock('bootstrap/rangevertical', [
		'title' => 'Campo de Variação Vertical',
		'icon' => 'image-flip-vertical',
		'description' => 'Campo de Variação Vertical.',
		'script_handle' > 'form_range_vertical_script',
		'script_path' => 'FormRangeVertical.js',
		'style_handle' => 'form_control_style',
		'style_path' => 'formControl.css',
		'keywords' => ['input', 'entrada', 'campo', 'form', 'formulário', 'range', 'variação'],
		'client_script_path' => 'forms/rangeVertical/index.js',
		'client_script_prefix' => 'form-range-vertical'
	]), 33
);
add_action('init', fn() =>
	BlockHandler::registerBootstrapBlock('bootstrap/switch', [
		'title' => 'Alternador',
		'icon' => 'dashboard',
		'description' => 'Campo de controle para alternar variáveis',
		'script_handle' => 'form_switch',
		'script_path' => 'FormSwitch.js',
		'style_handle' => 'form_control_style',
		'style_path' => 'formControl.css',
		'keywords' => ['form', 'formulário', 'alternador', 'switch', 'check'],
		'client_script_path' => 'forms/switch/index.js',
		'client_script_prefix' => 'form-switch'
	]), 34
);
