---
sidebar_position: 4
sidebar_label: Guide to Start Fabriq
---

# Guide to Start Fabriq

Fabriq is open-source AI-enabled software that helps you understand and engage your audience through personalized actions and can connect to most of your software applications and get all your data to your Single Source of Truth.


Github URL:  [Click here](https://github.com/fabriq-labs/fabriq-platform/tree/master/) to clone the project if you don't have it already.

To ensure a smooth setup process, please follow these steps:
1. Start by initializing the database as described in the attached [documentation](./init_database).
2. Next, create organization and user details in both the database and Firebase. The provided documentation links offer comprehensive instructions to guide you through the process.

For detailed guidelines and step-by-step instructions, please refer to the following documentation links: 

- [Guide to Initializing a Database](./init_database)
- [Firebase Setup](./setup_firebase_project.md)
- [Organizations and user creation](./org_setup.md)


Once you have successfully completed the above steps, you are now ready to run a `Fabriq` app via Docker

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