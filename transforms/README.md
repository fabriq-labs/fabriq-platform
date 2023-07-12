# Welcome to your new dbt project!

This repository serves as a starter project for working with dbt (data build tool). Follow the instructions below to get started.

## Installation

To set up the project, follow these steps:

1. Create a virtual environment:
   ```bash
   python3 -m venv venv
   ```

2. Activate the virtual environment:
   ```bash
   source venv/bin/activate
   ```

3. Install dbt using pip:
   ```bash
    pip install dbt-core dbt-postgres dbt-redshift dbt-snowflake dbt-bigquery
    
   ```

## Usage

Once the project is set up, you can use the following commands:

- Run dbt to build your project:
  ```bash
  dbt run
  ```
- Run dbt to build your project with profile:
  ```bash
  dbt run --profiles-dir=./profile/pg
  dbt run --profiles-dir=./profile/bq
  dbt run --profiles-dir=./profile/pg --models=model_folder
  ```

- Run dbt tests:
  ```bash
  dbt test
  ```

To install the package(s) required by your project, use the following command:
```bash
dbt deps
```

You can also generate documentation for your dbt project using the following commands:
```bash
dbt docs generate
dbt docs serve --port 8001
```

## Resources

For more information and resources on dbt, check out the following links:

- [dbt documentation](https://docs.getdbt.com/docs/introduction)
- [Discourse](https://discourse.getdbt.com/): A community forum for commonly asked questions and answers
- [Slack chat](https://community.getdbt.com/): Join the Slack community for live discussions and support
- [dbt events](https://events.getdbt.com): Find dbt events near you
- [dbt blog](https://blog.getdbt.com/): Stay updated with the latest news on dbt's development and best practices

Feel free to explore these resources to deepen your understanding and make the most out of your dbt project.

Happy coding!