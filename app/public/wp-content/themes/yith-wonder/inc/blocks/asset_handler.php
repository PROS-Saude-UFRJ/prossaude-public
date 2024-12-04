<?php
namespace PROSSaude\Blocks;
use WP_Error;
class AssetHandler {
	public static function testUrl(string $url): bool {
		if (!str_starts_with($url, 'http')) return false;
		$ch = curl_init($url);
		foreach ([CURLOPT_NOBODY => true, CURLOPT_RETURNTRANSFER => true, CURLOPT_TIMEOUT => 10] as $k => $v) curl_setopt($ch, $k, $v);
		curl_exec($ch);
		$code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
		curl_close($ch);
		return $code >= 200 && $code < 400;
	} 
	public static function enqueueFseScript(string $handle, string $url, array $deps = [], string|null $v = null, array $args = []): void {
		add_action('enqueue_block_editor_assets', fn() => self::enqueueAssetScript($handle, $url, $deps, $v, $args));
	}
	public static function enqueueBlockScript(string $handle, string $url, array $deps = [], string|null $v = null, array $args = []): void {
		add_action('enqueue_block_assets', fn() => self::enqueueAssetScript($handle, $url, $deps, $v, $args));
	}
	private static function enqueueAssetScript(string $handle, string $url, array $deps = [], string|null $v = null, array $args = []): WP_Error|bool {
		try {
			if (!str_starts_with($url, 'http') && !file_exists(get_template_directory().$url) && !file_exists($url)) throw new \Exception('Could not find internal file in '.$url, 404);
			elseif (!self::testUrl($url)) throw new \Exception('Could not find external file in '.$url, 404);
			wp_enqueue_script($handle, $url, $deps, $v, true);
			$keys = ['type', 'async', 'defer', 'crossorigin', 'integrity', 'nomodule', 'referrerpolicy'];
			if (array_key_exists('async', $args) && array_key_exists('defer', $args)) unset($args['async']);
			if (array_key_exists('type', $args) && array_key_exists('nomodule') && ($args['type'] === 'module')) unset($args['nomodule']);
			foreach($args as $k => $value) {
				if (!in_array($k, $keys, true)) continue;
				if ($k !== 'async' && $k !== 'defer' && $k !== 'nomodule' && $k !== 'integrity') $value = sanitize_text_field($value);
				elseif (($k == 'async' || $k == 'defer' || $k == 'nomodule') && !($value == 'true' || $value == 'false' || $value == '')) continue;
				elseif ($k == 'crossorigin' && !in_array($value, ['anonymous', 'use-credentials'], true)) continue;
				elseif ($k == 'referrerpolicy' && !in_array($value, ['no-referrer', 'no-referrer-when-downgrade', 
				'origin', 'origin-when-cross-origin', 'same-origin', 'strict-origin', 'strict-origin-when-cross-origin'], true)) continue;
				wp_script_add_data($handle, $k, $value);
			}
			return true;
		} catch (\Exception $e) {
			$msg = $e->getMessage();
			error_log('Failed to enqueue block editor asset '.$handle);
			return new WP_Error('failed_block_asset_enqueue', $msg, ['status' => $e->getCode()]);
		}
	}
	public static function enqueueEditStyle(
		string $handle, 
		string $href, 
		array $deps = [], 
		string $v = null, 
		string $media = "all", 
		array $args = []
	): void {
		add_action('admin_enqueue_scripts', fn() => self::enqueueAssetStyle($handle, $href, $deps, $v, $media, $args));
	}
	private static function enqueueAssetStyle(		
		string $handle, 
		string $href, 
		array $deps = [], 
		string $v = null, 
		string $media = "all", 
		array $args = []
	): WP_Error|bool {
		try {
			if (!str_starts_with($href, 'http') && !file_exists(get_template_directory().$href) && !file_exists($href)) throw new \Exception('Could not find internal file in '.$href, 404);
			elseif (!self::testUrl($href)) throw new \Exception('Could not find external file in '.$href, 404);
			$screen = function_exists('get_current_screen') ? get_current_screen() : null;
			if (!$screen || $screen->id !== 'site-editor') return false;
			wp_enqueue_style(
				$handle,
				$href,
				$deps,
				$v,
				$media
			);
			$keys = ['crossorigin', 'referrerpolicy', 'disabled', 'title', 'integrity'];
			foreach($args as $k => $value) {
				if (!in_array($k, $keys, true)) continue;
				if ($k !== 'disabled' && $k !== 'integrity') $value = sanitize_text_field($value);
				if ($k == 'crossorigin' && !in_array($value, ['anonymous', 'use-credentials'], true)) continue;
				elseif ($k == 'referrerpolicy' && !in_array($value, ['no-referrer', 'no-referrer-when-downgrade', 
				'origin', 'origin-when-cross-origin', 'same-origin', 'strict-origin', 'strict-origin-when-cross-origin'], true)) continue;
				elseif ($k == 'disabled' && !in_array($value, ['true', 'false', ''])) continue;
				wp_style_add_data($handle, $k, $value);			
			}
			return true;
		} catch (\Exception $e) {
			$msg = $e->getMessage();
			error_log('Failed to enqueue asset style '.$handle);
			return new WP_Error('failed_asset_style_enqueue', $msg, ['status' => $e->getCode()]);
		}
	}
}