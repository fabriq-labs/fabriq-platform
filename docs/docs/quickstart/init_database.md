---
sidebar_position: 3
sidebar_label: Initializing a Database
---
# Initializing a Database

This comprehensive guide is designed to provide guidance on how to effectively initialize a database. It covers essential aspects such as selecting the appropriate database management system, defining the schema, and setting up initial data. With step-by-step instructions and best practices, this document aims to help users ensure a smooth and efficient database initialization process.

## Prerequisites

Before initializing the database, ensure you have installed the necessary tools: [psql](https://www.postgresql.org/download/) and [flyway](https://flywaydb.org/).

## Database Initialization

To begin, you'll need to clone the project from the Github repository. If you don't have it already, you can do so by executing the following commands in your terminal:

Before running this script, it will create the organization, group, and user in the database and Firebase. Make sure the folder contains the necessary files. For more information, [refer here](../quickstart/org_setup/one_click).

```shell
git clone https://github.com/fabriq-labs/fabriq-platform.git
cd fabriq-platform
./init.sh
```
During the initialization, the script will run various tasks, including setting up the schema and importing initial data into the database.

## Verification

To verify that the database scripts have been successfully imported, look for the following logs:

![flyway_running](/img/flyway.png)

If you see these logs, it serves as confirmation that your database has been successfully initialized.

Congratulations! You have now successfully initialized your database, and it is ready for use with the project.

For more details on the database structure and how to interact with it, please refer to the project's documentation and codebase on [GitHub](https://github.com/fabriq-labs/fabriq-platform).

