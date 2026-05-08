<?php
//File get-approved.php
require_once '../config/origin.php';
require_once '../config/config.php';
header('Content-Type: application/json');

try {
    $pdo = getDB();
    
    // Fetch only approved reviews, most recent first
    $stmt = $pdo->prepare("
        SELECT 
            user_name AS name, 
            user_role AS role, 
            feedback_text AS text, 
            rating 
        FROM testimonials 
        WHERE status = 'approved' 
        ORDER BY created_at DESC 
        LIMIT 6
    ");
    
    $stmt->execute();
    $reviews = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Add initials dynamically for the UI
    foreach ($reviews as &$r) {
        $words = explode(" ", $r['name']);
        $r['initials'] = strtoupper(substr($words[0], 0, 1) . (isset($words[1]) ? substr($words[1], 0, 1) : ''));
    }

    echo json_encode($reviews);
} catch (PDOException $e) {
    echo json_encode([]);
}