USE master;
GO
ALTER DATABASE studyapp SET single_user WITH ROLLBACK IMMEDIATE;
DROP DATABASE studyapp;
