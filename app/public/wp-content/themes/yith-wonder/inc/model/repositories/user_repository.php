<?php
namespace PROSSaude;
use WP_Error;
use WP_User;
class UserRepository {
	public static function getUserByEmail(string $email): WP_Error|WP_User {
		$user = get_user_by('email', $email);
		if (!$user) {
			error_log('Email '.$user.' was not found');
			return new WP_Error('email_not_found', 'The request user email was not found.', [status => 404]);
		}
		return $user;
	}
	public static function getUserByLogin(string $login): WP_Error|WP_user {
		$user = get_user_by('login', $login);
		if (!$user) {
			error_log('Login '.$email.' was not found');
			return new WP_Error('login_not_found', 'The request user login was not found.', [status => 404]);
		}
	}
	public static function getUserBySlug(string $slug): WP_Error|WP_user {
		$user = get_user_by('slug', $slug);
		if (!$user) {
			error_log('Slug '.$slug.' was not found');
			return new WP_Error('slug_not_found', 'The request user slug was not found.', [status => 404]);
		}
	}
	protected static function setUserProp(int $id, string $key, mixed $value): WP_Error|int {
		try {
			$user = get_userdata($id);
			if (!$user) throw new \Exception('Could not find user data', 404);
			$value = trim($value);
			switch ($key) {
				case 'user_email':
					$value = sanitize_email($value);
					if (!filter_var($value, FILTER_VALIDATE_EMAIL)) throw new \Exception('Email malformed', 401);
					if (email_exists($value)) throw new \Exception('Email already in use', 409);
					break;
				case 'user_nicename':
					$value = sanitize_title($value);
					if (strlen($value) < 4 || strlen($value) > 100 || preg_match('/^\s$/', $value))
						throw new \Exception('Nicename malformed', 401);
					break;
				case 'first_name':
				case 'last_name':
					$value = sanitize_text_field($value);
					if (strlen($value) < 4 || strlen($value) > 50 || preg_match('/\d/', $value))
						throw new \Exception('Name malformed', 401);
					break;
				case 'display_name':
					$value = sanitize_text_field($value);
					if (strlen($value) < 4 || strlen($value) > 100 || preg_match('/\d/', $value))
							throw new \Exception('Display name malformed', 401);
					break;
				case 'user_login':
					$value = sanitize_user($value);
					if (strlen($value) < 4 || strlen($value) > 50 || preg_match('/^\s$/', $value))
						throw new \Exception('Login malformed', 401);
					if (username_exists($value)) throw new \Exception('Username already in use', $value);
					break;
				case 'user_url':
					$value = esc_url(sanitize_url($value));
					if (filter_var($value, FILTER_VALIDATE_URL) === false)
						throw new \Exception('URL malformed', 401);
					break;
				case 'user_registered':
					$value = str_replace("T", " ", $value);
					if (!preg_match('/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])\s([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/', $value))
						throw new \Exception('Date malformed', 401);
					break;
				case 'activation_key':
					$value = wp_generate_password(20, true, true);
					break;
				case 'roles':
					if (!isset($wp_roles->roles[$value]))
						throw new \Exception('Undefined role', 401);
					break;
				case 'user_pass':
					if (!preg_match('/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[^\w\s])(?:(?!.*(.)\1{2}))(?!.*\s).{8,}$/', $value))
						throw new \Exception('Password malformed', 401);
					break;
				default:
					throw new \Exception('Invalid property key', 400);
			}
			$res = wp_update_user([
				'ID' => $id,
				$key => $value
			]);
			return $res;
		} catch (\Exception $e) {
			$msg = $e.getMessage();
			error_log('Id '.$id.' did not return an user.');
			return new WP_Error('failed_set_user_prop', $msg, ['status' => $e.getCode()]);
		}
	}
	protected static function setNewUser(array $userInsertData): WP_Error|int {
		try {
			$userId = wp_insert_user($userInsertData);
			if (is_wp_error($userId)) throw new \Exception($userId->get_error_message(), 500);
			return $userId;
		} catch (\Exception $e) {
			error_log('User registration setup failed: ' . $e->getMessage());
      return new WP_Error('registration_setup_error', $e->getMessage(), ['status' => $e->getCode()]);
		}
	}
}