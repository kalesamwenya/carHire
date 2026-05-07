<?php
// File: admins/list.php
require_once '../config/origin.php';
require_once '../config/config.php';

$pdo = getDB();

try {
    // JOIN users with the latest session entry from the sessions table
    $stmt = $pdo->prepare("
        SELECT 
            u.id, 
            u.name, 
            u.email, 
            u.role, 
            u.is_verified as status, 
            u.created_at,
            MAX(s.created_at) as last_login_date
        FROM users u
        LEFT JOIN sessions s ON u.id = s.user_id
        WHERE u.role = 'admin'
        GROUP BY u.id
        ORDER BY u.created_at DESC
    ");
    
    $stmt->execute();
    $users = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Format data to match your frontend logic
    $formattedUsers = array_map(function($user) {
        return [
            'id' => $user['id'],
            'name' => $user['name'],
            'email' => $user['email'],
            'role' => ucfirst($user['role']), 
            'status' => $user['status'] ? 'Active' : 'Pending',
            // Return the raw date; the frontend will handle "Time Ago" formatting
            'lastLogin' => $user['last_login_date'] ?? 'Never'
        ];
    }, $users);

    header('Content-Type: application/json');
    echo json_encode($formattedUsers);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["message" => "Database error: " . $e->getMessage()]);
}