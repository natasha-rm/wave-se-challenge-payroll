# payroll-app

This application is build on Node.js and Sails.js framework.

## Software prerequisites:
* node.js (and npm). Versions used while testing - node (8.11.1) and npm (5.6.0)
* This app connects to an AWS RDS instance of PostgreSQL server. If you would like to view the database, you will need a postgres client. DBeaver works well and it's free. 

## Software build:
* Go to root folder and run the following command:

    npm install


## To run the app:

The app runs on localhost:1337. To start the app run the following command in the root folder:

* node app

## About the code structure:

## MVC files:
Model files are located in api/models.
Controller files are located in api/controllers.
Service files are located in api/services.
View files are located in views/pages.

## Configuration:
Database seed is defined in config/bootstrap.js. This seeds the JobGroupType table.
PostgreSQL database connection is defined in config/datastores.js. Currently its connected to an AWS RDS instance to make setup easier for code reviewers.

## About the architecture:



## What I am proud of:


