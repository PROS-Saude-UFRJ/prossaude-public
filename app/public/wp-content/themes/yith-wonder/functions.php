<?php
/**
 * Functions and definitions
 *
 * @link https://developer.wordpress.org/themes/basics/theme-functions/
 *
 * @package yith-wonder
 * @since 1.0.0
 */

namespace PROSSaude;

if (!defined('YITH_WONDER_VERSION')) define('YITH_WONDER_VERSION', wp_get_theme()->get('Version'));
require_once get_theme_file_path('inc/scripts.php');
add_action('customize_register', '__return_true');
require_once get_theme_file_path('inc/register-block-pattern-categories.php');
require_once get_theme_file_path('inc/register-block-styles.php');
require_once get_theme_file_path('inc/register-block-variations.php');
if (class_exists('woocommerce')) require_once get_theme_file_path('inc/woocommerce.php');
require_once get_theme_file_path('inc/backward-compatibility.php');
require_once get_theme_file_path('inc/registered-block-patterns-override.php');
require_once get_template_directory().'/inc/intern.php';
require_once get_template_directory().'/inc/landing.php';
add_action('wp_head', 'add_login_tags');
add_action('wp_enqueue_scripts', 'enqueue_test');
add_action('wp_enqueue_scripts', 'enqueue_bundle');
add_action('template_redirect', 'spa_redirect');
function every(array $array, callable $callback): bool {
	foreach ($array as $value) if (!$callback($value)) return false;
	return true;
}
require_once get_template_directory().'/inc/blocks/block_handler.php';
require_once get_template_directory().'/inc/blocks/register.php';
require_once get_template_directory().'/inc/blocks/asset_handler.php';
require_once get_template_directory().'/inc/blocks/assets.php';

