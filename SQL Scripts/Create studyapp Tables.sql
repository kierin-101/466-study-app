IF NOT EXISTS(SELECT name FROM sys.databases WHERE name = 'studyapp')
BEGIN
    CREATE DATABASE studyapp;
END

USE studyapp;

-- Uncomment the following lines if you need to recreate or clear out the entire database. --
DROP TABLE IF EXISTS PointsHistory;
DROP TABLE IF EXISTS UserAnswers;
DROP TABLE IF EXISTS Answers;
DROP TABLE IF EXISTS Questions;
DROP TABLE IF EXISTS Quizzes;
DROP TABLE IF EXISTS UserClasses;
DROP TABLE IF EXISTS Classes;
DROP TABLE IF EXISTS UserRewards;
DROP TABLE IF EXISTS Rewards
DROP TABLE IF EXISTS Users;

CREATE TABLE Users (
    [user_id] INT IDENTITY(1, 1) PRIMARY KEY,
    [username] NVARCHAR(100) NOT NULL,
    [password_sha256] CHAR(64) NOT NULL,
    [points] INT NOT NULL,
    [is_teacher] BIT NOT NULL,
);

CREATE TABLE Rewards (
    [reward_id] INT IDENTITY(1, 1) PRIMARY KEY,
    [reward_name] NVARCHAR(100) NOT NULL,
    [reward_type_id] INT NOT NULL,
    [description] NVARCHAR(1000),
    [point_cost] INT NOT NULL,
);

CREATE TABLE UserRewards (
    [user_reward_id] INT IDENTITY(1, 1) PRIMARY KEY,
    [acquisition_date] DATE NOT NULL,
    [active] BIT NOT NULL,
    [user_id] INT NOT NULL,
    [reward_id] INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES Users(user_id),
    FOREIGN KEY (reward_id) REFERENCES Rewards(reward_id),
);

CREATE TABLE Classes (
    [class_id] INT IDENTITY(1, 1) PRIMARY KEY,
    [class_name] NVARCHAR(100) NOT NULL,
    [subject] NVARCHAR(100) NOT NULL,
    [daily_point_cap] INT NOT NULL,
);

CREATE TABLE UserClasses (
    [user_class_id] INT IDENTITY(1, 1) PRIMARY KEY,
    [user_id] INT NOT NULL,
    [class_id] INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES Users(user_id),
    FOREIGN KEY (class_id) REFERENCES Classes(class_id),
);

CREATE TABLE Quizzes (
    [quiz_id] INT IDENTITY(1, 1) PRIMARY KEY,
    [title] NVARCHAR(100) NOT NULL,
    [description] NVARCHAR(1000),
    [release_timestamp] DATETIME NOT NULL,
    [due_timestamp] DATETIME NOT NULL,
    [target_score] DECIMAL,
    [class_id] INT NOT NULL,
    FOREIGN KEY (class_id) REFERENCES Classes(class_id),
);

CREATE TABLE Questions (
    [question_id] INT IDENTITY(1, 1) PRIMARY KEY,
    [question_text] NVARCHAR(1000) NOT NULL,
    [multiple_select] BIT NOT NULL,
    [quiz_id] INT NOT NULL,
    FOREIGN KEY (quiz_id) REFERENCES Quizzes(quiz_id),
);

CREATE TABLE Answers (
    [answer_id] INT IDENTITY(1, 1) PRIMARY KEY,
    [answer_text] NVARCHAR(1000) NOT NULL,
    [is_correct] BIT NOT NULL,
    [points_rewarded] INT NOT NULL,
    [question_id] INT NOT NULL,
    FOREIGN KEY (question_id) REFERENCES Questions(question_id),
);

CREATE TABLE UserAnswers (
    [user_answer_id] INT IDENTITY(1, 1) PRIMARY KEY,
    [attempt] INT NOT NULL,
    [user_id] INT NOT NULL,
    [answer_id] INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES Users(user_id),
    FOREIGN KEY (answer_id) REFERENCES Answers(answer_id),
);

CREATE TABLE PointsHistory (
    [transaction_id] int IDENTITY(1, 1) PRIMARY KEY,
    [points_delta] int NOT NULL,
    [transaction_timestamp] DATETIME NOT NULL,
    [description] NVARCHAR(1000),
    [user_id] INT NOT NULL,
    [quiz_id] INT,
    FOREIGN KEY (user_id) REFERENCES Users(user_id),
    FOREIGN KEY (quiz_id) REFERENCES Quizzes(quiz_id),
);
