<?php
namespace PROSSaude;
class TokenRepository {
	public static function setToken(int $id, string $token): bool {
		return update_user_meta($id, 'auth_token', $token);
	}
	public static function getToken(int $id): ?string {
		return get_user_meta($id, 'auth_token', true) ?: null;
	}
	public static function deleteToken(int $id): bool {
		return delete_user_meta($id, 'auth_token');
	}
}