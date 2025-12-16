<?php
// Shared session utilities for role-protected pages.
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

if (!function_exists('destroySession')) {
    function destroySession(): void
    {
        $_SESSION = [];

        if (ini_get('session.use_cookies')) {
            $params = session_get_cookie_params();
            setcookie(
                session_name(),
                '',
                time() - 42000,
                $params['path'],
                $params['domain'],
                $params['secure'],
                $params['httponly']
            );
        }

        session_destroy();
    }
}

if (!function_exists('requireRole')) {
    /**
     * Ensure a user is logged in with the expected role; otherwise, end the
     * session and redirect to the login page.
     */
    function requireRole(string $expectedRole): void
    {
        if (!isset($_SESSION['id'], $_SESSION['role']) || $_SESSION['role'] !== $expectedRole) {
            destroySession();
            header('Location: /index.php');
            exit();
        }
    }
}

