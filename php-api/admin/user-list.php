<?php
// File: admin/users_list.php
require_once '../config/origin.php';
require_once '../config/config.php';

header('Content-Type: application/json');

$pdo = getDB();

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    try {
        $stmt = $pdo->prepare("
            SELECT 
                -- Base User Data
                u.id, u.name, u.email, u.role, u.image, u.phone, 
                u.is_active, u.is_verified, u.created_at,
                
                -- Partner Data (joined from partners_about)
                pa.business_name, pa.tax_id, pa.id_number, pa.kyc_status,
                pa.city, pa.id_front_path, pa.id_back_path, 
                pa.bank_name, pa.account_number, pa.bio AS partner_bio,
                
                -- Customer Data (joined from users_about)
                ua.bio AS customer_bio, ua.location, ua.occupation, ua.website
                
            FROM users u
            LEFT JOIN partner_about pa ON u.id = pa.user_id
            LEFT JOIN users_about ua ON u.id = ua.user_id
            ORDER BY u.created_at DESC
        ");
        
        $stmt->execute();
        $results = $stmt->fetchAll(PDO::FETCH_ASSOC);

        echo json_encode([
            "success" => true, 
            "data" => $results
        ]);

    } catch (PDOException $e) {
        echo json_encode([
            "success" => false, 
            "message" => "Database Error: " . $e->getMessage()
        ]);
    }
}