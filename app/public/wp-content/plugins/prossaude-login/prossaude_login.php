<?php
/*
Plugin Name: PROSSaúde Login
Description: Customizes the WordPress login page.
Version: 1.0
Author: Equipe de TI, PROSSaúde
*/
add_action('login_head', function(): void {
	$plugin_url = plugin_dir_url(__FILE__);
	echo "
	<script 
			id='pw-switcher' 
			async
			crossorigin='anonymous'
			type='module'
			fetchpriority='high'
			src='".esc_url($plugin_url."index.js")."'
	></script>
	<link
			id='login-plugin-stylesheet'
			rel='stylesheet'
			type='text/css'
			crossorigin='anonymous' 
			href='".esc_url($plugin_url."index.css")."' 
			fetchpriority='low'
			media='all'
	/>";
});
