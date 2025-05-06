# 466 Study App

# MSSQL Database Setup
In order to use the app, it is necessary to set up a local SQL Server database for it to store data in.

## Installation
In order to run a local instance of SQL Server, you will need to install [SQL Server](https://www.microsoft.com/en-us/sql-server/sql-server-downloads). This application is supported natively on computers running Windows and Linux, and also has a Docker container option for systems that do not have native support. Follow the instructions given by the [installation wizard](https://learn.microsoft.com/en-us/sql/database-engine/install-windows/install-sql-server-from-the-installation-wizard-setup), and make note of the username and password that you set during installation.

## Database Management
There are two main options you can use to manage your local instance of SQL Server:

1. [SQL Server Management Studio](https://learn.microsoft.com/en-us/ssms/sql-server-management-studio-ssms)
    
    This option is only supported for computers running Windows.

    Follow [these instructions](https://learn.microsoft.com/en-us/sql/relational-databases/lesson-1-connecting-to-the-database-engine) to connect to your local instance of SQL Server.

2. [Azure Data Studio](https://learn.microsoft.com/en-us/azure-data-studio/download-azure-data-studio)

    This option is supported for computers running Windows, macOS, and Linux.

    Follow [these instructions](https://learn.microsoft.com/en-us/azure-data-studio/quickstart-sql-server) to connect to your local instance of SQL Server.

## Setting Up the Database
Once you have connected to your local database, there are premade scripts you can run to set up the database and, optionally, fill it with test data.

### Creating the Database
To create or reset the database, run the queries contained in the `SQL Scripts/Create studyapp Tables.sql` file.

### Adding Test Data
If you would like to add test data that has been created by us, you may optionally run the queries contained in the `SQL Scripts/Add Test Data.sql` file. Of course, we also encourage you to play with the app and add your own users/classes/quizzes, but this test data showcases some of the core functionality.

### Deleting the Database
If you would like to delete the database entirely, run the queries contained in `SQL Scripts/Drop studyapp Database.sql`. Note that the `SQL Scripts/Create studyapp Tables.sql` will clear out the data in the tables before recreating them by default, so this script should only be necessary if there is an issue with running the `SQL Scripts/Create studyapp Tables.sql` script or if you would like to remove the database from your system.

## Connecting the Application to the Database
Once the database is set up, you must create a configuration file in order for the application to be able to connect to it.

In the `server` directory, create a new file, `.env`. Place the following text in this file:
```
DB_USER=
DB_PASSWORD=
DB_SERVER=localhost
DB_NAME=studyapp
DB_PORT=1433
PORT=5000
```
Set the username and password to the username and password that you used during setup.
