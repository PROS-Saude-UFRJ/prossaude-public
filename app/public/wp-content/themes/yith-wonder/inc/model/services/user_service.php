<?php
namespace PROSSaude;
use WP_Error;
use WP_User;
use PROSSaude\UserRepository;
use PROSSaude\TokenRepository;
class UserService extends UserRepository {
	public static function dispatchUserProp(int $id, string $key, mixed $value): WP_Error|int {
		try {
			if (!is_user_logged_in() || !get_current_user_id()) throw new \Exception('User attempting to dispatch is not logged in.', 404);
			if (!TokenRepository::getToken(get_current_user_id())) throw new \Exception ('User token expired.', 403); 
			if (!current_user_can('edit_users')) throw new \Exception('User not authorized to edit other users.', 403);
			if (
				(($key === 'ID' || $key === 'user_status') && !is_int($value)) || 
				(in_array($key, [
					'user_email', 'user_login', 'user_pass', 'user_activation_key', 
					'user_nicename', 'display_name', 'first_name', 'last_name', 
					'description', 'user_url', 'user_registered'
				 ]) && !is_string($value)) ||
				(in_array($key, ['allcaps', 'caps']) && !(is_array($value) && every($value, fn($v) => is_bool($v)))) ||
				($key === 'roles' && !(is_array($value) && every($value, fn($v) => is_string($v))))
			) throw new \Exception('Value type inadequate.', 400);
			static::setUserProp($id, $key, $value);
		} catch (\Exception $e) {
			$msg = $e->getMessage();
			error_log('Failed to Dispatch User Property: '.$msg);
			return new WP_Error('user_dispatch_failed', 'Could not execute user dispatch.', ['status' => $e->getCode()]);
		}
	}
	public static function dispatchOwnUserProp(string $key, mixed $value): WP_Error|int {
		try {
			$id = get_current_user_id();
			if (!is_user_logged_in() || !$id) throw new \Exception('User attempting to dispatch is not logged in.', 404);
			if (!TokenRepository::getToken(get_current_user_id())) throw new \Exception ('User token expired.', 403);
			if (($key == 'ID' || $key == 'user_status' || $key == 'allcaps' || $key == 'caps' || $key == 'roles' ||
			$key == 'user_registered' || $key == 'user_activation_key') && !current_user_can('edit_user')) 
			throw new \Exception('Current user cannot edit the requested key', 403);
			static::setUserProp($id, $key, $value);
		} catch (\Exception $e) {
			$msg = $e->getMessage();
			error_log('Failed to Dispatch User Own Property: '.$msg);
			return new WP_Error('user_own_dispatch_failed', 'Could not execute user own dispatch.', ['status' => $e->getCode()]);
		}
	}
	public static function dispatchNewUser(array $userData): WP_Error|int {
		try {
			$username = isset($userData['user_login']) ? sanitize_user($userData['user_login'], true) : null;
			$email = isset($userData['user_email']) ? sanitize_email($userData['user_email']) : null;
			$password = isset($userData['user_pass']) ? trim($userData['user_pass']) : null;
			$nicename = isset($userData['user_nicename']) ? sanitize_title($userData['user_nicename']) : null;
			$displayName = isset($userData['display_name']) ? sanitize_text_field($userData['display_name']) : $username;
			$firstName = isset($userData['first_name']) ? sanitize_text_field($userData['first_name']) : '';
			$lastName = isset($userData['last_name']) ? sanitize_text_field($userData['last_name']) : '';
			$url = isset($userData['user_url']) ? esc_url(sanitize_url($userData['user_url'])) : '';
			$registered = isset($userData['user_registered']) ? str_replace('T', ' ', $userData['user_registered']) : current_time('mysql');
			$role = isset($userData['role']) && isset($wp_roles->roles[$userData['role']]) ? $userData['role'] : 'subscriber';
			if (username_exists($username)) throw new \Exception('Username already exists', 409);
			if (!$username || strlen($username) < 4 || strlen($username) > 50 || preg_match('/^\s+$/', $username))
				throw new \Exception('Username is malformed or invalid', 401);
			if (email_exists($email)) throw new \Exception('Email already exists', 409);
			if (!$email || !filter_var($email, FILTER_VALIDATE_EMAIL))
				throw new \Exception('Email is malformed or invalid', 401);
			if (!$password || !preg_match('/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[^\w\s])(?:(?!.*(.)\1{2}))(?!.*\s).{8,}$/', $password))
				throw new \Exception('Password is malformed or too weak', 401);
			static::setNewUser([
				'user_login' => $username,
				'user_email' => $email,
				'user_pass' => $password,
				'user_nicename' => $nicename ?: sanitize_title($username),
				'display_name' => $displayName,
				'first_name' => $firstName,
				'last_name' => $lastName,
				'user_url' => $url,
				'user_registered' => $registered,
				'role' => $role,
			]);
		} catch (\Exception $e) {
			
		}
	}
}