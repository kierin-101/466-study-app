USE studyapp;

INSERT INTO dbo.Users (username, password_sha256, points, is_teacher) VALUES ('teacher', '$2b$10$m8cGMhzD0Hu.s5pD57WN2e8OwvRteLnfwP09sP93zieJTXkGT4d4y', 0, 1);
INSERT INTO dbo.Users (username, password_sha256, points, is_teacher) VALUES ('student1', '$2b$10$ep4Nm41pAYMjn5fduO3mke/BzBhfEFLap3.XemAVyOTehQYhFfEgy', 0, 0);
INSERT INTO dbo.Users (username, password_sha256, points, is_teacher) VALUES ('student2', '$2b$10$ep4Nm41pAYMjn5fduO3mke/BzBhfEFLap3.XemAVyOTehQYhFfEgy', 0, 0);

INSERT INTO dbo.Classes (class_name, subject, daily_point_cap) VALUES ('CSCE 466', 'Computer Science', 100);

INSERT INTO dbo.UserClasses (user_id, class_id) VALUES (1, 1);
INSERT INTO dbo.UserClasses (user_id, class_id) VALUES (2, 1);
INSERT INTO dbo.UserClasses (user_id, class_id) VALUES (3, 1);

INSERT INTO dbo.Quizzes (title, description, release_timestamp, due_timestamp, target_score, class_id) VALUES ('Sample Exam', NULL, '20250504 3:00:00 PM', '20260510 5:00:00 PM', 0, 1);

INSERT INTO dbo.Questions (question_text, multiple_select, quiz_id) VALUES ('TRUE or FALSE: Architecture is a phase in software development.', 0, 1);
INSERT INTO dbo.Questions (question_text, multiple_select, quiz_id) VALUES ('Select two options below. In software product line engineering, there are two parts to the process, __________ engineering and __________ engineering.', 1, 1);
INSERT INTO dbo.Questions (question_text, multiple_select, quiz_id) VALUES ('In feature modeling, __________ features define the scope for an exclusive-or choice of features.', 0, 1);
INSERT INTO dbo.Questions (question_text, multiple_select, quiz_id) VALUES ('TRUE or FALSE: Alloy is a software modeling language.', 0, 1);

INSERT INTO dbo.Answers (answer_text, is_correct, points_rewarded, question_id) VALUES ('True', 0, 0, 1);
INSERT INTO dbo.Answers (answer_text, is_correct, points_rewarded, question_id) VALUES ('False', 1, 10, 1);
INSERT INTO dbo.Answers (answer_text, is_correct, points_rewarded, question_id) VALUES ('domain', 1, 10, 2);
INSERT INTO dbo.Answers (answer_text, is_correct, points_rewarded, question_id) VALUES ('system', 0, 0, 2);
INSERT INTO dbo.Answers (answer_text, is_correct, points_rewarded, question_id) VALUES ('application', 1, 10, 2);
INSERT INTO dbo.Answers (answer_text, is_correct, points_rewarded, question_id) VALUES ('software', 0, 0, 2);
INSERT INTO dbo.Answers (answer_text, is_correct, points_rewarded, question_id) VALUES ('mandatory', 0, 0, 3);
INSERT INTO dbo.Answers (answer_text, is_correct, points_rewarded, question_id) VALUES ('or', 0, 0, 3);
INSERT INTO dbo.Answers (answer_text, is_correct, points_rewarded, question_id) VALUES ('optional', 0, 0, 3);
INSERT INTO dbo.Answers (answer_text, is_correct, points_rewarded, question_id) VALUES ('alternative', 1, 10, 3);
INSERT INTO dbo.Answers (answer_text, is_correct, points_rewarded, question_id) VALUES ('True', 1, 10, 4);
INSERT INTO dbo.Answers (answer_text, is_correct, points_rewarded, question_id) VALUES ('False', 0, 0, 4);

INSERT INTO dbo.Quizzes (title, description, release_timestamp, due_timestamp, target_score, class_id) VALUES ('Closed Quiz', 'This quiz has already closed, and cannot be taken.', '20240510 3:00:00 PM', '20240510 5:00:00 PM', 0, 1);

INSERT INTO dbo.Questions (question_text, multiple_select, quiz_id) VALUES ('Can you take this quiz?', 0, 2);

INSERT INTO dbo.Answers (answer_text, is_correct, points_rewarded, question_id) VALUES ('Yes', 0, 0, 5);
INSERT INTO dbo.Answers (answer_text, is_correct, points_rewarded, question_id) VALUES ('No', 1, 1, 5);
INSERT INTO dbo.Answers (answer_text, is_correct, points_rewarded, question_id) VALUES ('Maybe', 0, 0, 5);

INSERT INTO dbo.Quizzes (title, description, release_timestamp, due_timestamp, target_score, class_id) VALUES ('Future Quiz', 'This quiz opens in the future, and cannot yet bet taken.', '21250510 3:00:00 PM', '21250510 5:00:00 PM', 0, 1);

INSERT INTO dbo.Questions (question_text, multiple_select, quiz_id) VALUES ('Is software architecture the same in the future?', 0, 3);

INSERT INTO dbo.Answers (answer_text, is_correct, points_rewarded, question_id) VALUES ('Yes', 0, 0, 6);
INSERT INTO dbo.Answers (answer_text, is_correct, points_rewarded, question_id) VALUES ('No', 0, 0, 6);
INSERT INTO dbo.Answers (answer_text, is_correct, points_rewarded, question_id) VALUES ('Maybe', 1, 1, 6);

INSERT INTO dbo.Classes (class_name, subject, daily_point_cap) VALUES ('CSCE 487', 'Computer Science', 100);

INSERT INTO dbo.UserClasses (user_id, class_id) VALUES (1, 2);
INSERT INTO dbo.UserClasses (user_id, class_id) VALUES (2, 2);

INSERT INTO dbo.Quizzes (title, description, release_timestamp, due_timestamp, target_score, class_id) VALUES ('Senior Design Showcase Quiz', NULL, '20240501 3:00:00 PM', '20260510 5:00:00 PM', 0, 2);

INSERT INTO dbo.Questions (question_text, multiple_select, quiz_id) VALUES ('When is the 2025 Senior Design showcase?', 0, 4);

INSERT INTO dbo.Answers (answer_text, is_correct, points_rewarded, question_id) VALUES ('Friday, May 2', 1, 1, 7);
INSERT INTO dbo.Answers (answer_text, is_correct, points_rewarded, question_id) VALUES ('Friday, May 9', 0, 0, 7);
INSERT INTO dbo.Answers (answer_text, is_correct, points_rewarded, question_id) VALUES ('Monday, May 12', 0, 0, 7);
INSERT INTO dbo.Answers (answer_text, is_correct, points_rewarded, question_id) VALUES ('Wednesday, May 14', 0, 0, 7);

INSERT INTO dbo.Rewards (reward_name, reward_type_id, description, point_cost) VALUES ('Inchworm Avatar', 1, 'An avatar for all users.', 0);
INSERT INTO dbo.Rewards (reward_name, reward_type_id, description, point_cost) VALUES ('Axolotl Avatar', 1, 'An eager axolotl avatar.', 200);
INSERT INTO dbo.Rewards (reward_name, reward_type_id, description, point_cost) VALUES ('Cat Avatar', 1, 'An exasperated cat avatar.', 250);

INSERT INTO dbo.Rewards (reward_name, reward_type_id, description, point_cost) VALUES ('Aspiring Academic', 2, 'A free title.', 0);
INSERT INTO dbo.Rewards (reward_name, reward_type_id, description, point_cost) VALUES ('110%', 2, 'A title for users giving 110% of their effort.', 110);
INSERT INTO dbo.Rewards (reward_name, reward_type_id, description, point_cost) VALUES ('Quality Quizzer', 2, 'A title for users with a growing amount of studying experience.', 200);
INSERT INTO dbo.Rewards (reward_name, reward_type_id, description, point_cost) VALUES ('Collector of Knowledge', 2, 'A title for users with an impressive amount of studying experience.', 500);

INSERT INTO dbo.Rewards (reward_name, reward_type_id, description, point_cost) VALUES ('Books Theme', 3, 'A theme for the readers.', 300);
INSERT INTO dbo.Rewards (reward_name, reward_type_id, description, point_cost) VALUES ('Cactus Theme', 3, 'A theme for the plant enthusiasts.', 400);
