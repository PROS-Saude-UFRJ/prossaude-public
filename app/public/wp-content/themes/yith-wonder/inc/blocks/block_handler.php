<?php
namespace PROSSaude\Blocks;
class BlockHandler {
	static private function modularize(string $n): void {
		if (wp_script_is($n, 'registered')) {
			wp_script_add_data($n, 'type', 'module');
			wp_script_add_data($n, 'crossorigin', 'anonymous');
		} else error_log("Script $n is not registered, unable to modularize.");
	}
	static public function registerBlockFiles(
	string $f, 
	string $f_name, 
	string $s, 
	string $s_name
	): bool {
		try {
			if (!wp_script_is($f_name, 'registered')) {
				if (!file_exists(get_template_directory().$f)) throw new \Exception('Path for script '.get_template_directory().$f.' not found', 404);
				wp_register_script(
					$f_name, 
					get_template_directory_uri().$f,
					['wp-blocks', 'wp-element', 'wp-editor', 'react', 'react-dom'],
					filemtime(get_template_directory().$f),
					true
				);
				self::modularize($f_name);
			}
			if (!wp_style_is($s_name, 'registered')) {
				if (!file_exists(get_template_directory().$s)) throw new \Exception('Path for style '.get_template_directory().$s.' not found', 404);
				wp_register_style(
					$s_name,
					get_template_directory_uri().$s,
					[],
					filemtime(get_template_directory().$s)
				);
			}
			return true;
		} catch (\Exception $e) {
			error_log('Failed to register script for '.$f_name.': '.$e->getMessage());
			return false;
		}
	}
	static public function enqueueClientScript(string $n, string $path, string $prefix): void {
		try {
			if (!file_exists(get_template_directory().$path)) throw new \Exception('File not found', 404);
			wp_enqueue_script(
				$n,
				get_template_directory_uri().$path,
				[],
				filemtime(get_template_directory().$path),
				true
			);
			error_log('Render Callback enqueued for '.$n);
			self::modularize($n);
			wp_localize_script($n, $prefix.'ScriptData', [
				'ajax_url' => admin_url('admin-ajax.php'),
				'nonce'    => wp_create_nonce($prefix.'_nonce_action'),
			]);
			error_log('Render Callback modularized for '.$n);
		} catch (\Exception $e) {
			error_log('Failed to enqueue client script for '.$prefix);
		}
	}
	/**
	 * Registers a Bootstrap-based WordPress block with the specified options.
	 *
	 * @param string $name    The name of the block (e.g., 'bootstrap/block-name').
	 * @param array $options  An associative array of block configuration options:
	 * 
	 * - **script_path** (string): Path to the block's JavaScript file.
	 * - **script_handle** (string): Handle to register the block's script.
	 * - **style_path** (string): Path to the block's CSS file.
	 * - **style_handle** (string): Handle to register the block's style.
	 * - **title** (string): Display title of the block in the editor.
	 * - **icon** (string): Icon name for the block (default: `comments`).
	 * - **description** (string): A brief description of the block.
	 * - **keywords** (array): Keywords to help search for the block in the editor (default: `['bootstrap']`).
	 * - **multiple** (bool): Whether multiple instances of the block are allowed (default: `true`).
	 * - **client_script_path** (string): Path to the dynamic client script for rendering on the frontend.
	 * - **script_prefix** (string): Prefix for localized data attached to the client script.
	 * 
	 * @return void
	 *
	 * @throws Exception Logs errors if block files cannot be registered or if required files are missing.
	 */
	static public function registerBootstrapBlock(string $name, array $options): void {
		try {
			$f = '/build/'.($options['script_path'] ?? '');
			if (empty($options['script_handle']) || empty($options['script_path'])) {
				error_log('Missing script definitions when registering '.$name.': Handle '.($options['script_handle'] ?? 'NULL').' Path '.($options['script_path'] ?? 'NULL'));
				return;
			}
			$f_name = $options['script_handle'];
			$s = '/assets/css/dist/'.($options['style_path'] ?? '');
			$s_name = $options['style_handle'];
			if (!file_exists(get_template_directory().$f))
				error_log("Script file not found: ".get_template_directory().$f);
			if (!file_exists(get_template_directory().$s))
				error_log("Style file not found: ".get_template_directory().$s);
			$success = self::registerBlockFiles($f, $f_name, $s, $s_name);
			$keywords = ['bootstrap'];
			if (!empty($options['keywords']) && is_array($options['keywords']))
				foreach($options['keywords'] as $w) is_string($w) && array_push($keywords, $w);
			if ($success) {
				register_block_type($name, [
					'title' => __($options['title'] ?? 'Null', 'yith-wonder'),
					'icon' => __($options['icon'] ?? 'comments', 'yith-wonder'),
					'category' => 'bootstrap_ui',
					'description' => __($options['description'] ?? '', 'yith-wonder'),
					'textdomain' => 'yith-wonder',
					'editor_script' => $f_name,
					'editor_style' => $s_name,
					'style' => $s_name,
					'keywords' => $keywords,
					'supports' => [
							'align' => $options['align'] ?? true,
							'spacing' => [
									'margin' => $options['margin'] ?? true,
									'padding' => $options['padding'] ?? true,
							],
							'typography' => [
									'fontSize' => $options['fontSize'] ?? true,
									'lineHeight' => $options['lineHeight'] ?? true,
							],
							'color' => $options['color'] ?? true,
							'customClassName' => $options['customClassName'] ?? false,
							'html' => $options['html'] ?? false,
							'multiple' => $options['multiple'] ?? true,
					],
					'render_callback' => function ($attributes, $content) use ($f_name, $options) {
						error_log('NOME '.$f_name);
						error_log('Attributes '.print_r($attributes, true));
						ob_start();
						?>
						<span class="renderWrapper">
							<?php 
							if (!empty($content)) echo wp_kses_post($content);
							else {
								error_log('Content for '.$f_name.' was empty');
								echo '<div class="error-div">Failed to load clientside content!</div>';
							}
							?>
							<span class="formControlWatcher" style="display: none;"></span>
						</span>
						<?php
						file_exists(get_template_directory().($options['client_script_path'] ?? ''))
							? add_action('wp_enqueue_scripts', fn() => self::enqueueClientScript(
								$f_name,
								'/assets/js/dist/components/bootstrap/'.($options['client_script_path'] ?? ''),
								$options['client_script_prefix'] ?? ''
								))
							: error_log('Failed to enqueue watcher script for "/assets/js/dist/components/bootstrap/"'.($options['client_script_path']).'\n');
						return ob_get_clean();
					},
				]);
			} else error_log('Failed to register '.$f);
		} catch (\Exception $e) {
			error_log('Error executing Block'.$f_name.'Registering for Bootstrap Element '.$e->getMessage());
		}
	}
}