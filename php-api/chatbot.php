<?php
require_once 'config/origin.php';
require_once 'config/config.php';

header('Content-Type: application/json');

// Helper function to ensure we always return JSON even on failure
function sendResponse($code, $data) {
    http_response_code($code);
    echo json_encode($data);
    exit;
}

try {
    $pdo = getDB();
    if (!$pdo) {
        throw new Exception("Database connection failed.");
    }
} catch (Exception $e) {
    sendResponse(500, ['error' => 'Database Error: ' . $e->getMessage()]);
}

// Handle input
$data = json_decode(file_get_contents('php://input'), true);
$question = trim($_POST['message'] ?? $data['message'] ?? '');

function normalize($text) {
    $text = strtolower($text);
    return preg_replace('/[^\p{L}\p{N}\s]/u', '', $text);
}

/* ---------------- SMART FALLBACK BRAIN ---------------- */
function smartFallback($q) {
    $q = strtolower($q);
    
    // Quick keyword mapping
    $fallbacks = [
        'visit' => ["reply" => "We would love to welcome you at Life Reach Church 🙌", "intent" => "visit", "actions" => ["primary" => ["label" => "Plan Your Visit", "url" => "/visit"]]],
        'where' => ["reply" => "We are located at Zamise Theatre Hall in Kamwala, Lusaka 📍", "intent" => "location", "actions" => ["primary" => ["label" => "Get Directions", "url" => "/location"]]],
        'give' => ["reply" => "Thank you for your heart to give 🙌", "intent" => "giving", "actions" => ["primary" => ["label" => "Give Now", "url" => "/give"]]],
        'contact' => ["reply" => "We are here for you 😊 Feel free to reach out anytime.", "intent" => "contact", "actions" => ["primary" => ["label" => "Contact Us", "url" => "/contact"]]]
    ];

    foreach ($fallbacks as $key => $val) {
        if (strpos($q, $key) !== false) return $val;
    }

    return [
        "reply" => "Hmm 🤔 I’m not fully sure, but you can ask about visiting, giving, or location.",
        "intent" => "fallback",
        "actions" => null
    ];
}

/* ---------------- MAIN ENGINE ---------------- */
$reply = "I'm sorry, I didn't quite catch that.";
$intent = "unknown";
$actions = null;

if ($question) {
    $normalized = normalize($question);
    
    try {
        $stmt = $pdo->query("SELECT * FROM chatbot_keywords ORDER BY priority DESC");
        $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        $bestScore = 0;

        foreach ($rows as $row) {
            $keywords = array_map('trim', explode(',', strtolower($row['keywords'] ?? '')));
            $score = 0;

            foreach ($keywords as $kw) {
                if (!$kw) continue;
                if (strpos($normalized, $kw) !== false) $score += 5;
                
                similar_text($normalized, $kw, $percent);
                if ($percent > 70) $score += 2;
            }

            if ($score > $bestScore) {
                $bestScore = $score;
                $intent = $row['intent'];
                $reply = $row['answer'];
                if (!empty($row['follow_up'])) $reply .= " " . $row['follow_up'];
                $actions = json_decode($row['action_links'] ?? '[]', true);
            }
        }

        if ($bestScore < 2) {
            $fallback = smartFallback($question);
            $reply = $fallback['reply'];
            $intent = $fallback['intent'];
            $actions = $fallback['actions'];
        }
    } catch (PDOException $e) {
        sendResponse(500, ['error' => 'Query Failed: ' . $e->getMessage()]);
    }
}

/* ---------------- RESPONSE ---------------- */
sendResponse(200, [
    'reply' => $reply,
    'intent' => $intent,
    'actions' => $actions
]);