-- Chatbot keywords and answers
CREATE TABLE chatbot_keywords (
  id INT AUTO_INCREMENT PRIMARY KEY,
  intent VARCHAR(100) NOT NULL,
  keywords TEXT NOT NULL,
  answer TEXT NOT NULL,
  follow_up TEXT NULL,
  priority INT DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- Chatbot interaction statistics
CREATE TABLE IF NOT EXISTS chatbot_stats (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_agent VARCHAR(255),
  user_ip VARCHAR(45),
  question TEXT NOT NULL,
  matched_keyword VARCHAR(255),
  answer TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;