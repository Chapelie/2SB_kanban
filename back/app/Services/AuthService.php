<?php
namespace App\Services;

use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use App\Repositories\AuthRepository;

class AuthService
{
    protected $authRepository;

    public function __construct(AuthRepository $authRepository)
    {
        $this->authRepository = $authRepository;
    }

    public function authenticate(array $credentials): array
    {
        $user = $this->authRepository->findByEmail($credentials['email']);

        if (!$user || !Hash::check($credentials['password'], $user->password)) {
            return ['success' => false, 'message' => 'Identifiants invalides'];
        }
        $token = $user->createToken('auth_token')->plainTextToken;
        return ['success' => true, 'token' => $token, 'user' => $user];
    }
    public function register(array $data): array
    {
        $user = $this->authRepository->createUser($data);
        $token = $user->createToken('auth_token')->plainTextToken;
        return ['token' => $token, 'user' => $user];
    }

    public function logout($user): void
    {
        $user->currentAccessToken()->delete();
    }

    public function me($user): User
    {
        return $user;
    }

}

