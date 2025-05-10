# 466 Study App
The study app is a studying platform designed to facilitate evidence-based studying habits in students. Whereas cramming is shown to have little effect on long-term retention of knowledge, engaging in spaced repetition of studying promotes deeper learning. Earning points that can be traded for in-app rewards provides positive reinforcements to students who study and encourages daily engagement with the material. Teachers can create classes and quizzes to provide their students with tailored resources, taking full advantage of these principles.

# Instructions
1. Create a clone of the repository on your device.
2. Follow the instructions in [MSSQL Database Setup](#mssql-database-setup) and [Compiling the Program](#compiling-the-program).
3. Follow one or both of the following scenarios:
    * Using the test data
        1. Once you have added the test data into your database, navigate to the "Login" page. From here, you may log in as "teacher", "student1", or "student2". The password for each of these accounts is simply "password".
        2. From the "teacher" account, you may manage your classes. On the "classes" list, two should appear. Open one of your choice and observe the listed quizzes and people across tabs. Also note that the teacher can remove a student from the class via the people list.
        3. Feel free to experiment with creating a new quiz--or, if you return to the "Classes" page, a new class.
        4. From either "student" account, you may access classes. Classes differ between the student accounts. Try taking some quizzes as a student, then visit the shop.
        5. The shop should be populated by rewards from the test data. Some of these are free and will allow you to test buying/equipping without having earned points, but if you earned enough from quizzes, feel free to play around with the paid rewards! There are rewards in each category.
    * Using custom data
        1. Begin by navigating to the "Login" page. From here, click to be redirected to the "Sign Up" page.
        2. Create an account with credentials of your choosing. To fully explore the app, an account of both types will be required. Begin with a teacher account.
        3. Navigate to the "Classes" page. Only a button with a "+" appears at this time. Click it and fill out the form to create a class.
        4. Go to your new class's page. From here, you are able to "Create New Quiz". Click it and create a quiz of your own. If you want to be able to take this quiz, be sure to set the date range to include now!
        5. For now, teacher accounts are able to take their own quizzes and recieve points for them. You may do so on this account if you like by clicking on its listing.
        6.  When you are finished exploring as a teacher, click "Logout". The "Login" option should reappear on the nav bar. Click it, then go to "Sign up now!".
        7. This time, create a student account. It cannot have the same username as your teacher account.
        8. On your student account, navigate to the "Classes" page. Again, only the "+" option appears. Clicking it as a student allows you to join a class. Enter the code of the class you created before, then click "Confirm Join".
        9. On the class's page, you should see your username as well as the teacher under the "People" tab. Unlike the teacher view, from the "All Quizzes" tab, you will not be able to create a quiz, but you can take the one you made as the teacher. Go ahead and take it if you didn't before.
        10. You may visit the shop, but if you did not use the test data, you will not see anything here (see the [Known Issues/Limitations section](#known-issueslimitations)). Consider using the test data for this purpose.
4. To run the tests associated with the app, use command `npm test` from the `study-app` folder.

# Known Issues/Limitations
The app currently relies on a local MSSQL database to run. To set one up, follow the instructions in the [MSSQL Database Setup section](#mssql-database-setup). If you opt not to use the provided test data, you may still benefit from using the queries that populate the rewards table, as there is no way to add this data from the front-end. Further, because BLOB storage is not currently a capability of the server, image assets are kept as static files, meaning any avatars or themes will need to match one of the corresponding reward names listed in `AvatarDisplay.jsx` otherwise they will appear blank. This consideration does not apply to titles.

There is minimal input validation on the form fields at this time, as the local database means abuse of these could only cause damage or loss of the individual's own data.

One smaller limitation is that, after a daily points cap is reached, any answers the user gives for subsequent quizzes will be logged even though the client does not give any indication of the submission. This may result in a user seeing an unfamiliar high score on the quiz's listing.

# Compiling the Program
1. You must have Node.js and npm installed to compile the app. Instructions can be found [here](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm).
2. To install all the packages associated with the app, you must run `npm install` from three separate folders: the root folder `466-study-app`, the `server` folder, and the `study-app` folder.
3. Ensure you have set up your server as described in the [MSSQL Database Setup section](#mssql-database-setup).
4. From the root folder `466-study-app`, type `npm run dev`. This is configured to start both the server and the client.

# MSSQL Database Setup
In order to use the app, it is necessary to set up a local SQL Server database for it to store data in.

## Installation
In order to run a local instance of SQL Server, you will need to install [SQL Server](https://www.microsoft.com/en-us/sql-server/sql-server-downloads). This application is supported natively on computers running Windows and Linux, and also has a Docker container option for systems that do not have native support. Follow the instructions given by the [installation wizard](https://learn.microsoft.com/en-us/sql/database-engine/install-windows/install-sql-server-from-the-installation-wizard-setup), and make note of the username and password that you set during installation.

## Database Management
There are two main options you can use to manage your local instance of SQL Server:

1. [SQL Server Management Studio](https://learn.microsoft.com/en-us/ssms/sql-server-management-studio-ssms)
    
    - This option is only supported for computers running Windows.

    - Follow [these instructions](https://learn.microsoft.com/en-us/sql/relational-databases/lesson-1-connecting-to-the-database-engine) to connect to your local instance of SQL Server.

2. [Azure Data Studio](https://learn.microsoft.com/en-us/azure-data-studio/download-azure-data-studio)

    - This option is supported for computers running Windows, macOS, and Linux.

    - Follow [these instructions](https://learn.microsoft.com/en-us/azure-data-studio/quickstart-sql-server) to connect to your local instance of SQL Server.

## Setting Up the Database
Once you have connected to your local database, there are premade scripts you can run to set up the database and, optionally, fill it with test data.

### Creating the Database (Required)
To create or reset the database, run the queries contained in the `SQL Scripts/Create studyapp Tables.sql` file.

### Adding Test Data (Optional)
If you would like to add test data that has been created by us, you may optionally run the queries contained in the `SQL Scripts/Add Test Data.sql` file. Of course, we also encourage you to play with the app and add your own users/classes/quizzes, but this test data showcases some of the core functionality. It should be noted that without adding the test data, there will be no rewards in the app, as these cannot be added through the frontend at this point.

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
Set the username and password to the username and password that you used during setup. Simply type the username and password as raw text after the equal signs on their respective lines, without any quotation marks.
