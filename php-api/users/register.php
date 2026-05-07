<?php
// FILE: users/register.php

// --- ADVANCED ERROR CAPTURE ---
// This captures Fatal Errors that try/catch blocks usually miss
register_shutdown_function(function() {
    $error = error_get_last();
    if ($error !== NULL && ($error['type'] === E_ERROR || $error['type'] === E_PARSE || $error['type'] === E_COMPILE_ERROR)) {
        http_response_code(500);
        echo json_encode([
            "message" => "FATAL PHP ERROR",
            "debug_info" => $error['message'],
            "file" => $error['file'],
            "line" => $error['line']
        ]);
        exit;
    }
});

// Load files with absolute paths to avoid "File not found" 500 errors
require_once __DIR__ . '/../config/origin.php';
require_once __DIR__ . '/../config/config.php';
require_once __DIR__ . '/../config/EmailHelper.php';

$json = file_get_contents('php://input');
$data = json_decode($json);

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    try {
        // 1. Validate Input
        if (empty($data->name) || empty($data->email) || empty($data->password)) {
            http_response_code(400);
            echo json_encode(["message" => "Required fields are missing."]);
            exit;
        }

        // 2. Sanitize
        $name = strip_tags($data->name);
        $email = filter_var($data->email, FILTER_SANITIZE_EMAIL);
        $hashedPassword = password_hash($data->password, PASSWORD_BCRYPT);
        $dbRole = (($data->role ?? 'customer') === 'partner') ? 'partner' : 'user';
        $residency = $data->residency ?? 'Local';
        $token = bin2hex(random_bytes(32)); 
        $expires = date('Y-m-d H:i:s', strtotime('+7 days'));
        
        // 3. Database Execution
        $pdo = getDB();
        if (!$pdo) throw new Exception("Database connection returned null.");

        $pdo->beginTransaction();

        $stmt = $pdo->prepare("
            INSERT INTO users (
                name, email, password, role, residency, 
                verification_token, token_expires, is_verified, created_at
            ) 
            VALUES (?, ?, ?, ?, ?, ?, ?, 0, NOW())
        ");
        
        $stmt->execute([$name, $email, $hashedPassword, $dbRole, $residency, $token, $expires]);

        // 4. Email Trigger
        // If this fails, it's usually because PHPMailer files are missing
        $emailSent = EmailHelper::sendWelcomeEmail($email, $name, $token, ($dbRole === 'partner'));
        
        if (!$emailSent) {
            // Optional: You can choose to fail the registration if the email fails
            // throw new Exception("User saved but verification email failed to send.");
        }

        $pdo->commit();

        http_response_code(201);
        echo json_encode([
            "status" => "success",
            "message" => "Welcome to CityDrive! Please check your email to verify."
        ]);

    } catch (PDOException $e) {
        if (isset($pdo) && $pdo->inTransaction()) { $pdo->rollBack(); }
        http_response_code(500);
        echo json_encode([
            "message" => "Database Error",
            "debug_info" => $e->getMessage(),
            "code" => $e->getCode()
        ]);
    } catch (Exception $e) {
        if (isset($pdo) && $pdo->inTransaction()) { $pdo->rollBack(); }
        http_response_code(500);
        echo json_encode([
            "message" => "Application Error",
            "debug_info" => $e->getMessage(),
            "file" => $e->getFile(),
            "line" => $e->getLine()
        ]);
    }
}