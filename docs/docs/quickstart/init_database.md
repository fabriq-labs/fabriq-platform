---
sidebar_position: 1
sidebar_label: Guide to Initializing a Database
---

# Guide to Initializing a Database

This document provides a comprehensive guide on how to initialize a database effectively. It covers essential aspects such as selecting the appropriate database management system, defining the schema, and setting up initial data. With step-by-step instructions and best practices, this document aims to help users ensure a smooth and efficient database initialization process.

Github URL:  [Click here](https://github.com/fabriq-labs/fabriq-platform/tree/master/) to clone the project if you don't have it already.

Install [psql](https://www.postgresql.org/download/) and [flyway](https://flywaydb.org/), then open terminal and run:
```shell
git clone https://github.com/fabriq-labs/fabriq-platform.git
cd fabriq-platform
./init.sh
```
When you see the following logs, it serves as a confirmation that your database scripts have been successfully imported:

![flyway_running](/img/flyway_running.png)

