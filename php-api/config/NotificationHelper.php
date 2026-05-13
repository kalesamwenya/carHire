<?php

class NotificationHelper {

    public static function create(
        $pdo,
        $title,
        $message,
        $type = 'info',
        $referenceId = null,
        $referenceType = null,
        $partnerId = null,
        $userId = null
    ) {

        try {

            $stmt = $pdo->prepare("
                INSERT INTO notifications (
                    title,
                    message,
                    type,
                    reference_id,
                    reference_type,
                    partner_id,
                    user_id,
                    created_at
                )
                VALUES (
                    :title,
                    :message,
                    :type,
                    :reference_id,
                    :reference_type,
                    :partner_id,
                    :user_id,
                    NOW()
                )
            ");

            $stmt->execute([
                ':title' => $title,
                ':message' => $message,
                ':type' => $type,
                ':reference_id' => $referenceId,
                ':reference_type' => $referenceType,
                ':partner_id' => $partnerId,
                ':user_id' => $userId
            ]);

            return true;

        } catch (Exception $e) {
            error_log("Notification Error: " . $e->getMessage());
            return false;
        }
    }
}