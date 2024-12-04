<?php
function enqueue_test(): void {
	if ((is_front_page() && is_home()) || is_page(12))
		wp_enqueue_script(
			'test',
			get_template_directory_uri().'/assets/js/src/modules/test.js',
			array(),
			'1.0.0',
			true
		);
}