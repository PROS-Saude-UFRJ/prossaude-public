<?php
namespace PROSSaude;
use WP_REST_Request;
use WP_Error;
use PROSSaude\AuthService;
use PROSSaude\TokenService;
class AuthController {
	public static function login(WP_REST_Request $req): WP_Error|array {
		try {
			$user = AuthService::authenticate(sanitize_text_field($req['username']), sanitize_text_field($req['password']));
			if (is_wp_error($user)) throw new \Exception($user->get_error_message(), 403);
			$token = TokenService::generateToken($user);
			if (!$token) throw new \Exception('token_not_set', 403);
			self::monitor($user->ID);
			wp_redirect(home_url(add_query_arg(NULL, NULL)));
		} catch (\Exception $e) {
			$msg = $e->getMessage();
			error_log('Login Error: '.$msg);
			return new WP_Error('invalid_login', $msg, ['status' => $e->getCode()]);
		}
	}
	private static function monitor(int $id): void {
		while (is_user_logged_in()) {
			sleep(30);
			$res = TokenService::refreshToken($id);
			if (is_wp_error($res) || !$res) {
				self::logout($id);
				return;
			}
		}
	}
  public static function logout(int $id): WP_Error|bool {
		try {
			$token = TokenRepository::getToken($id);
			if (!$token) throw new \Exception('token_not_found', 403);
			$decoded = JWT::decode($token, JWT_AUTH_SECRET_KEY, ['HS256']);
			if (!$decoded || !isset($decoded->exp)) throw new \Exception('token_malformed', 403);
			$exp = $decoded->exp;
			$success = TokenService::revokeToken($id, $token, $exp);
			if (!$sucess) throw new \Exception('failed_to_revoke', 403);
			wp_redirect(wp_login_url());
			exit;
		} catch (\Exception $e) {
			$msg = $e->getMessage();
			error_log('Logout Error: '.$msg);
			wp_die('Failed to log out. Please try again.', 'Logout Error');
			return new WP_Error('invalid_logout', $msg, ['status' => $e->getCode()]);
		}
	}
}