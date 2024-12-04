<?php
namespace PROSSaude;
use Firebase\JWT\JWT;
use WP_REST_Request;
use WP_Error;
use PROSSaude\AuthService;
use PROSSaude\TokenService;
class PostController {
	public function registerRoutes(): bool {
		register_rest_route('test/v1', '/post', [
			'methods' => 'POST',
			'callback' => [$this->token_service, 'generateToken'],
			'permission_callback' => '__return_true'
		]);
		register_rest_route();
		register_rest_route();
	}
}