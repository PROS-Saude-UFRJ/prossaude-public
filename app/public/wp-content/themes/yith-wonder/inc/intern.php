<?php
function add_login_tags(): void {
	if (is_page(6) || is_page('interno')) {
		$public = get_template_directory_uri().'/assets/js/src/modules/pro-saude-app-vite/app/public/';
		?>
		<meta name="generator" content="WordPress 6.6.2 + Vite 5.4.1 + TypeScript 5.5.3 + Webpack 5.94.0" />
		<link rel="canonical" href="http://prossaude-ufrj.local/interno/" />
		<meta name="description" content="Este é uma página para login no sistema do Projeto PROSSaúde — UFRJ" />
		<meta property="og:type" content="website" />
		<meta property="og:website:published_time" content="2024-07-02T18:00:00Z" />
		<meta property="og:site_name" content="PROSSaúde — UFRJ" />
		<meta property="og:url" content="http://prossaude-ufrj.local/interno/" />
		<meta property="og:title" content="Login — PROSSaúde — UFRJ" />
		<meta
			property="og:description"
			content="Acesse o link para fazer o login no sistema online do Projeto PROSSaúde — UFRJ" />
		<meta property="og:image" content="https://prossaude-client.netlify.app/img/PROS_Saude_Modelo1-Final.png" />
		<meta property="og:image:width" content="1200" />
		<meta property="og:image:height" content="400" />
		<meta property="og:image:alt" content="logo" />
		<link rel="icon" href="http://prossaude-ufrj.local/wp-content/uploads/2024/11/favicon_g-1.png" id="faviconpross" />
		<link rel="apple-touch-icon" href="<?php echo $public."apple-touch-icon-iphone-60x60-precomposed.png" ?>" />
		<link rel="apple-touch-icon" sizes="60x60" href="<?php echo $public."apple-touch-icon-ipad-76x76-precomposed.png" ?>" />
		<link rel="apple-touch-icon" sizes="114x114" href="<?php echo $public."apple-touch-icon-iphone-retina-120x120-precomposed.png" ?>" />
		<link rel="apple-touch-icon" sizes="144x144" href="<?php echo $public."apple-touch-icon-ipad-retina-152x152-precomposed.png" ?>" />
		<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-T3c6CoIi6uLrA9TneNEoa7RxnatzjcDSCmG1MXxSR1GAsXEV/Dwwykc2MPK8M2HN" crossorigin="anonymous" id="bootstrapLink" />
		<?php
	}
}
function enqueue_bundle(): void {
	if (is_page(22) || is_page('interno')) {
		$modules = get_template_directory().'/assets/js/src/modules/';
		wp_enqueue_script(
			'bootstrap-js', 
			'https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js', 
			array(), 
			null, 
			true
		);
		wp_script_add_data('bootstrap-js', 'defer', true);
		wp_script_add_data('bootstrap-js', 'crossorigin', 'anonymous');
		wp_script_add_data('bootstrap-js', 'integrity', "sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz");
		wp_enqueue_script('spinner_replacer', $modules.'spinnerReplacer.js', array(), null, true);
		$file = $modules.'pro-saude-app-vite/app/build/bundle.asset.php';
		if (!file_exists($file)) {
			error_log('Failed to load bundle asset');
			return;
		}
		$data = include($file);
		$app = get_template_directory_uri().'/assets/js/src/modules/pro-saude-app-vite/app/';
		wp_enqueue_script(
			'bundle',
			$app.'build/bundle.js',
			$data['dependencies'],
			$data['version'],
			true
		);
		$s = $app.'dist/src/styles/';
		$g = $s.'globals/';
    $gs = [
			'global_styles' => 'gStyle.css',
			'login_styles' => 'loginPageStyle.css',
			'react_styles' => 'reactSpinner.css'
		];
		$ss = [
				'ag_styles' => 'ag/aGPageStyle.css',
				'base_styles' => 'base/basePageStyle.css',
				'edfis_styles' => 'edfis/edFisNutPageStyle.css',
				'od_styles' => 'od/odPageStyle.css',
				'panel_styles' => 'panelPageStyle.css',
				'recover_styles' => 'recoverPageStyle.css'
		];
		foreach ($gs as $h => $f) wp_enqueue_style($h, $g.$f, null);
		foreach ($ss as $h=> $f) wp_enqueue_style($h, $s.$f, null);
	}
}
function spa_redirect(): void {
	if (preg_match('/^interno\/.+/', trim(parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH), '/'))) wp_redirect(home_url('/interno/'));
}