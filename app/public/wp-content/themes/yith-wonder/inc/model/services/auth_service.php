<?php
namespace PROSSaude;
use WP_Error;
use WP_User;
class AuthService {
	public static function authenticate(string $name, string $pw): WP_Error|WP_User {
		try {
			$user = wp_authenticate($name, $pw);
			if (is_wp_error($user)) throw new \Exception($user->get_error_message(), 403);
			return $user;
		} catch (\Exception $e) {
			error_log('Authentication Error: '.$e->getMessage());
			return new WP_Error('invalid_credentials', 'invalid username or password', ['status' => $e->getCode()]);
		}
	}
}