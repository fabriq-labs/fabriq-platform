---
sidebar_position: 4
sidebar_label: Guide to Configuring Hasura
---

# Guide to Configuring Hasura

Hasura is an open-source engine that provides instant GraphQL APIs for your existing databases. It allows you to rapidly build and deploy GraphQL APIs without writing complex backend code.

This comprehensive guide is designed to help you swiftly set up and start using the Hasura GraphQL Engine along with a Postgres database, both running as Docker containers using Docker Compose. To begin the process, you can refer to the following link which provides detailed instructions on how to set up Hasura in a Docker environment: [Click here](https://hasura.io/docs/latest/getting-started/docker-simple/).


- You can obtain the Hasura metadata by accessing it   [here](https://github.com/fabriq-labs/fabriq-platform/blob/master/resources/hasura_metadata.json) 

After downloading the files, remember to update the database details in the following section:
```
"configuration": {
            "connection_info": {
              "database_url": "postgres://postgres:postgres@localhost:5432/meta_dev",
              "isolation_level": "read-committed",
              "use_prepared_statements": false
            }
          }
```

- After Hasura is online, go to the `Settings` tab in the Hasura admin console.

![Alt text](/img/hasura_settings.png)

- Click on the 'Import' button, select the respective metadata file, and upload it to import the metadata.

![Alt text](/img/hasura_import.png)