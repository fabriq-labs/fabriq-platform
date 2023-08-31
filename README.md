# fabriq - End-to-End content analytics platform

fabriq is an open-source content analytics platform developed by fabriq-labs that is built on Modern Data Stack.  It generates and collects data generated during content production workflow and provides a single source of truth that can be viewed and acted upon.  


## ✨ Features

### For Developers:
-  **Data Schema**: fabriq comes with a pre-built data schema that serves as the foundation for rich analytics about content in multiple dimensions including authors, posts and readers.  This robust schema allows you to understand the audience engagement without any custom build. 
- **No-Code ETL Framework:** Seamlessly ingest data from operational systems without writing a line of code. This allows you to leverage data from these external sources and integrate it into your content workflows and analytics.
- **Composable Architecture:** Our setup follows the composable customer data model, ensuring flexibility.
- **DBT Recipes for Content Analytics:** Access a library of ready-to-use data transformation recipes tailored for content metrics.
- **GraphQL API Ready Data Points:** flexible and powerful GraphQL API that allows you to read the metrics and use them in downstream applications
- **Robust Customer Data Platform:** A comprehensive solution for all your customer data needs.

### For Business Users:
- **Rapid Deployment:** Establish a first-party data infrastructure swiftly to gather event-level behavioral data.
- **In-Depth Performance Metrics:** Avail granular performance indicators related to traffic, engagement, and revenue, all curated based on the best standards in the content industry.
- **Entity-Level Insights:** Measure performance across various entities such as authors, audience, articles, categories, and more.
- **Natural Language Querying:** Use simple language to ask questions and retrieve answers from the database, powered by your favourite LLM


## Why fabriq? 

Over the last twenty years, there has been a significant shift towards using advanced data engineering and AI principles for content creation and distribution. While this shift helps content creators make content that appeals to their audience leading to stronger connections, setting up this infrastructure required advanced technical expertise and only available to large media houses. fabriq is an opinionated framework that should make it significantly easier for creators. 

**Dive Deeper:** To delve into the inspiration behind Fabriq and gain insights into the changing dynamics of content analytics, [follow our comprehensive series](link-to-the-series).

## ⚙️ How it works? 

![Architecture](https://storage.googleapis.com/fabirq_static_asset/images/fabriq-architecture.png)

- **[Airbyte](https://airbyte.com)**: Data integration platform for importing data from a [variety of sources](https://github.com/fabriq-labs/content-frontend) ([more sources](https://github.com/airbytehq/airbyte/tree/master/airbyte-integrations/connectors))
- **[Hasura](https://hasura.io)**: GraphQL engine that makes your data accessible over a real-time GraphQL API
- **[dbt](https://www.getdbt.com)**: Data transformations to convert raw data into usable metrics
- **[PostgreSQL](https://www.postgresql.org)**: Stores all the your data in canonical representation
- **[Redash](https://www.docker.com)**: Redash is an open-source data visualization and dashboarding tool that allows you to connect to various data sources, query and transform data, and create interactive visualizations and dashboards ([more](https://github.com/getredash/redash))

## 🤗 Community support

For general help using fabriq, please refer to the [official documentation](https://docs.getfabriq.com)

- **[GitHub Issues](https://github.com/fabriq-labs/fabriq-platform/issues)**: Bug reports, suggestions, contributions

## 📜 Privacy Policy

[Privacy Policy](https://website.stg.getfabriq.com/privacy-policy).
