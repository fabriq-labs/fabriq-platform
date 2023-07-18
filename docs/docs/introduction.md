---
sidebar_position: 1
sidebar_label: Introduction
---

# Fabriq

Fabriq is open-source AI-enabled software that helps you understand and engage your audience through personalized actions and can connect to most of your software applications and get all your data to your Single Source of Truth.

<div align="center">

![Bar Chart](/img/overview_.png)

</div>

## ✨ Features

- **Rich Data Schema**: Fabriq provides a rich data schema that serves as the foundation for organizing and structuring your data within the platform. The data schema defines the types of data entities, their relationships, and the available fields and properties. This robust schema allows you to effectively model and manage your data in a structured and meaningful way.
- **Import from a variety of sources**: We provide the capability to import data from a variety of sources, including Salesforce, Google Analytics, and PostgreSQL, etc. This allows you to leverage data from these external sources and integrate it into your Fabriq workflows and analytics.
- **Flexible GraphQL API**: Fabriq offers a flexible and powerful GraphQL API that allows you to interact with the platform programmatically and access a wide range of features and functionalities. With the GraphQL API, you have the freedom to query, manipulate, and retrieve data from Fabriq in a highly customizable and efficient manner.
- **Extensibility and shareability**: Build and share custom metrics and dashboards.
- **Container-based deployment**: Run on your laptop, private or public cloud, with no external dependencies
- **Real-time Data Transformation**: Fabriq provides flexible data transformation capabilities to manipulate and enrich your real-time Snowplow event data. You can apply real-time transformations, such as filtering, aggregation, enrichment, and normalization, to derive additional insights or prepare the data for further analysis.
- **Real-time Analytics**: With Fabriq's real-time analytics capabilities, you can perform instant analysis on the streaming Snowplow event data. Fabriq offers various analytics features, such as real-time dashboards, visualizations, and AI-powered analytics, allowing you to monitor key metrics, detect anomalies, and uncover patterns in real-time.

## 🏁 Start your server

Requires Docker Desktop and git:
```
docker-compose up -d
```

## ⚙️ Components

![Architecture](/img/fabriq_2.drawio.png)

- **[Airbyte](https://airbyte.com)**: Data integration platform for importing data from a [variety of sources](https://github.com/fabriq-labs/content-frontend) ([more sources](https://github.com/airbytehq/airbyte/tree/master/airbyte-integrations/connectors))
- **[Hasura](https://hasura.io)**: GraphQL engine that makes your data accessible over a real-time GraphQL API
- **[dbt](https://www.getdbt.com)**: Data transformations to convert raw data into usable metrics
- **[PostgreSQL](https://www.postgresql.org)**: Stores all the your data in canonical representation
- **[Docker](https://www.docker.com)**: Container runtime to run the services
- **[Redash](https://www.docker.com)**: Redash is an open-source data visualization and dashboarding tool that allows you to connect to various data sources, query and transform data, and create interactive visualizations and dashboards ([more](https://github.com/getredash/redash))

## 🤗 Community support

For general help using Fabriq, please refer to the [official documentation](https://github.com/fabriq-labs). For additional help, you can use github issues:

- **[GitHub Issues](https://github.com/fabriq-labs/fabriq-platform/issues)**: Bug reports, suggestions, contributions

## 📜 Privacy Policy

[Privacy Policy](https://website.stg.getfabriq.com/privacy-policy).

