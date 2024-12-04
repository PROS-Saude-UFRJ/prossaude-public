<?php
namespace PROSSaude;
use Firebase\JWT\JWT;
use WP_Error;
use WP_REST_Request;
use WP_User;
use PROSSaude\AuthSerivce;
use PROSaude\TokenRepository;
class TokenService {
 /**
 * Retrieves user data in an array format.
 * @param WP_User    $user          The session's user.
 * @param int        $expiration    The expiration to be added.
 * @return WP_Error|array {
 *     @type string   $token        The encoded token.
 *     @type int      $expires_in   The experation added.
 * }
 */
	public static function generateToken(WP_User $user, int $expiration = 900): WP_Error|array {
		try {
			$at = time();
			$token = [
				'token' => JWT::encode([
					'iss' => get_bloginfo('url'),
					'iat' => $at,
					'nbf' => $at,
					'exp' => $at + $expiration,
					'data' => $user
				], JWT_AUTH_SECRET_KEY, 'HS256'),
				'expires_in' => $expiration
			];
			if (is_wp_error($token)) throw new \Exception($token->getMessage(), 400);
			TokenRepository::setToken($user->ID, $token);
			return $token;
		} catch (\Exception $e) {
			$msg = $e->getMessage();
			error_log('Token Generation Error: '.$msg);
			return new WP_Error('invalid_generation_credentials', $msg, ['status' => $e.getCode()]);
		}
	}
	public static function revokeToken(int $id, ?string $token, ?int $exp): WP_Error|bool {
		try {
			if (!$token) {
				$token = TokenRepository::getToken($id);
				if (!$token) throw new \Exception('token_not_found', 401);
			}
			if ($token && !$exp) {
				$decoded = JWT::decode($token, JWT_AUTH_SECRET_KEY, ['HS256']);
				if (!$decoded || !isset($decoded->exp)) throw new \Exception('token_malformed', 400);
				$exp = $decoded->exp;
			}
			$success = set_transient('revoked_token_'.hash('sha256', $token), true, $expiration - time());
			if ($sucess) return TokenRepository::deleteToken($id);
			return $sucess;
		} catch (\Exception $e) {
			error_log('Token Revoking Error: '.$e->getMessage());
			return new WP_Error('invalid_credentials', 'invalid username or password', ['status' => $e->getCode()]);
		}
	}
	public static function refreshToken(string $token): WP_Error|bool {
		try {
			$decoded = self::validateToken($token);
			if (is_wp_error($decoded)|| !isset($decoded->exp) || !isset($decoded->user)) throw new \Exception('invalid_decoded_token', 400);
			if (($decoded->$exp - time()) > (5 * MINUTE_IN_SECONDS)) throw new \Exception('token_not_ready_for_refresh', 400);
			$user = (array)$decoded->data->user;
			$id = $user->ID;
			$newToken = self::generateToken($id);
			if (is_wp_error($newToken)) throw new \Exception('invalid_refresh_token', 400);
			$deletion = TokenRepository::deleteToken($id);
			if (!$deletion) throw new \Exception('token_deletion_failed', 403);
			return TokenRepository::setToken($id, $newToken);
		} catch (\Exception $e) {
			$msg = $e->getMessage();
			error_log('Token Refresh Error: '.$msg);
			return new WP_Error('invalid_refresh_credentials', $msg, ['status' => $e.getCode()]);
		}
	}
	private static function validateToken(int $id, string $token): mixed {
		try {
			$storedToken = TokenRepository::getToken($id);
			if (!$storedToken) throw new \Exception('token_not_found', 401);
			if ($storedToken !== $token) throw new \Exception('token_mismatch', 400);
			$decoded = JWT::decode($token, JWT_AUTH_SECRET_KEY, ['HS256']);
			if (!$decoded || !isset($decoded->data->user)) throw new \Exception('token_malformed', 400);
			return $decoded;
		} catch (\Exception $e) {
			$msg = $e->getMessage();
			error_log('Token Validation Error: '.$msg);
			return new WP_Error('invalid_token', $msg, ['status' => $e.getCode()]);
		}
	}
}