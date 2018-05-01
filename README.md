# payroll-app

This application is built on Node.js and Sails.js framework.

## Software prerequisites:
* node.js (and npm). Versions used while testing - node (8.11.1) and npm (5.6.0)
* This app connects to an AWS RDS instance of PostgreSQL server. If you would like to view the database, you will need a postgres client. DBeaver works well and it's free. 

## Software build:
* Go to root folder and run the following command. Note that this will take a while to complete. My mistake. Should have installed the light version of sails. Realized too late.

    npm install


## To run the app:

* The app runs on localhost:1337. To start the app run the following command in the root folder:

    node app

## About the code structure:

## MVC files:
* Model files are located in api/models.
* Controller files are located in api/controllers.
* Service files are located in api/services.
* View files are located in views/pages.

## Configuration:
* Database seed is defined in config/bootstrap.js. This seeds the JobGroupType table.
* PostgreSQL database connection is defined in config/datastores.js. Currently its connected to an AWS RDS instance to make setup easier for code reviewers.

## About the architecture:

### Model:
There are three tables in the model:
1. JobGroupType - This stores the hourly rate per job group
2. TimeReport - This provides an archive of all the CSV data uploaded. Each record has a processed flag which indicates if the record has been added to the PayReport
3. PayReport -  This table stores a running tally of the salaries for employees

### Workflow:
1. When a CSV file is uploaded by the user, this file is stored in the local drive of the application. Then it is parsed. 
2. Records from the CSV are stored in the TimeReport table.
3. When this is done, the app starts updating the PayReport table. 
4. All records that were recently added to the TimeReport table are retrieved (processed flag is not set). The records are collated based on employee ID.
5. For each employee ID, the pay report records are retrieved from the DB. In memory we process all the time report records for the employee and update the pay report records. Once all records for the employee are processed, pay report records in the DB are updated.
6. Before we exit the process, the time report records that we were working with are marked as processed.

#### Notes:
1. The UI does not refresh the result set. The "Refresh Results" button is provided.
2. There is a "Clear DB" button in the UI if you want to reset the data stored in the DB.

## What I am proud of:
- The use of promises in the processing logic. I think it makes the code a bit more readable. I don't have a ton of experience with promises. So it was fun (and sometimes aggravating) to get it working.
- The pay report calculation logic. I tried to reduce the I/O operations as much as possible. Most of the searching/iterating is happening in memory. The time reports get added up as deltas. When a new CSV is uploaded, the existing numbers are updated.
- I think the model, controller and services are clear and concise. Some of the services can be broken up into additional services. But I didn't want to go overboard.


