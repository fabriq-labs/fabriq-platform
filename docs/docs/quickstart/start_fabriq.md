---
sidebar_position: 1
sidebar_label: Guide to Start Fabriq
---

# Guide to Start Fabriq

This guide will show you how to start with Fabriq step by step.

### 1. Clone the Project

To begin, clone the Fabriq Github repository by using the following command:

```shell
git clone https://github.com/fabriq-labs/fabriq-platform.git
```
If you don't have the project already, you can access it [here](https://github.com/fabriq-labs/fabriq-platform/tree/master/).
### 2. Firebase setup
Create the Firebase project by following the steps detailed [here](./setup_firebase_project.md).
### 3. Database Initialization
Next, initialize the database by following the instructions provided [here](./init_database).
### 4. Organizationa and user creation setup
If you have completed the Database Initialization step, the initial user and organization have already been created in both the database and Firebase. In that case, you can skip this part and proceed to the next section.

However, if you haven't done the Database Initialization yet, follow the steps below to manually create an [organization and user](./org_setup).
### 5. Start the server
Once the initial setups are completed, you can proceed to set up a Fabriq app. First, create a [.env](https://github.com/fabriq-labs/fabriq-platform/blob/master/sample.env) file using the sample.env as a template and update it with the necessary details. Now you are ready to run a Fabriq app.

```shell
git clone https://github.com/fabriq-labs/fabriq-platform.git
cd fabriq-platform
docker-compose up -d
```

After the successful execution of the `docker-compose up -d` command, the following components are now running:

- The server component is up and running.
- The worker component is up and running.
- The ELT-wrapper component is up and running.
- Hasura is up and running.
- OpenAI is up and running.

![flyway_running](/img/fabriq_running.png)

This indicates that all the necessary components of the system are active and ready for use.