<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Services\AuthService;
use Illuminate\Support\Facades\Hash;

/**
 * @OA\Post(
 *     path="/api/login",
 *     tags={"Authentification"},
 *     summary="Connexion utilisateur",
 *     @OA\RequestBody(
 *         required=true,
 *         @OA\JsonContent(
 *             required={"email", "password"},
 *             @OA\Property(property="email", type="string", example="admin@example.com"),
 *             @OA\Property(property="password", type="string", example="123456")
 *         )
 *     ),
 *     @OA\Response(response=200, description="Connexion réussie"),
 *     @OA\Response(response=401, description="Échec de l’authentification")
 * )
 */
class AuthController extends Controller
{
    protected $authService;

    public function __construct(AuthService $authService)
    {
        $this->authService = $authService;
    }

    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required|string'
        ]);

        $response = $this->authService->authenticate($request->only('email', 'password'));

        if (!$response['success']) {
            return response()->json(['message' => $response['message']], 401);
        }

        return response()->json([
            'token' => $response['token'],
            'user' => $response['user']
        ]);
    }
    /**
     * @OA\Post(
     *     path="/api/register",
     *     tags={"Authentification"},
     *     summary="Enregistrer un nouvel utilisateur",
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"name", "email", "password"},
     *             @OA\Property(property="name", type="string", example="Jean Dupont"),
     *             @OA\Property(property="email", type="string", example="jean@example.com"),
     *             @OA\Property(property="password", type="string", example="123456"),
     *             @OA\Property(property="role", type="string", example="user"),
     *             @OA\Property(property="location", type="string", example="Paris"),
     *             @OA\Property(property="avatar", type="string", example="https://exemple.com/avatar.jpg")
     *         )
     *     ),
     *     @OA\Response(response=201, description="Utilisateur enregistré")
     * )
     */
    public function register(Request $request)
    {
        $request->validate([
            'name' => 'required|string',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:6',
            'location' => 'nullable|string',
            'avatar' => 'nullable|string'
        ]);

        $data = $request->only(['name', 'email', 'password', 'location', 'avatar']);
        $data['role'] = 'user';
        $response = $this->authService->register($data);

        return response()->json($response, 201);
    }

    /**
     * @OA\Post(
     *     path="/api/logout",
     *     tags={"Authentification"},
     *     summary="Déconnexion de l'utilisateur",
     *     security={{"sanctum":{}}},
     *     @OA\Response(response=200, description="Déconnexion réussie")
     * )
     */
    public function logout(Request $request)
    {
        $this->authService->logout($request->user());
        return response()->json(['message' => 'Déconnecté avec succès']);
    }

    /**
     * @OA\Get(
     *     path="/api/me",
     *     tags={"Authentification"},
     *     summary="Données de l'utilisateur connecté",
     *     security={{"sanctum":{}}},
     *     @OA\Response(response=200, description="Informations utilisateur")
     * )
     */
    public function me(Request $request)
    {
        $user = $this->authService->me($request->user());
        return response()->json($user);
    }

}
