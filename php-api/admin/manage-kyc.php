<?php
// File: admin/manage-kyc.php
require_once '../config/origin.php';
require_once '../config/config.php';

header('Content-Type: application/json');

$pdo = getDB();

// GET: Fetch all partners with their KYC status and document paths
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    try {
        $stmt = $pdo->prepare("
            SELECT 
                u.id, u.name, u.email, 
                pa.business_name, pa.kyc_status, pa.id_number,
                pa.id_front_path, pa.id_back_path, pa.created_at
            FROM users u
            JOIN partner_about pa ON u.id = pa.user_id
            WHERE u.role = 'partner'
            ORDER BY FIELD(pa.kyc_status, 'pending', 'rejected', 'verified'), pa.created_at DESC
        ");
        $stmt->execute();
        $partners = $stmt->fetchAll(PDO::FETCH_ASSOC);

        echo json_encode(["success" => true, "data" => $partners]);
    } catch (PDOException $e) {
        echo json_encode(["success" => false, "message" => $e->getMessage()]);
    }
}

// POST: Approve or Reject KYC
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    $partnerId = $data['user_id'];
    $newStatus = $data['status']; // 'verified' or 'rejected'

    try {
        $stmt = $pdo->prepare("UPDATE partner_about SET kyc_status = ? WHERE user_id = ?");
        $stmt->execute([$newStatus, $partnerId]);

        echo json_encode(["success" => true, "message" => "Partner marked as $newStatus"]);
    } catch (PDOException $e) {
        echo json_encode(["success" => false, "message" => $e->getMessage()]);
    }
}