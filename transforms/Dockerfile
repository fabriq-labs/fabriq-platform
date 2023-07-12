# Use an official Python runtime as the base image
FROM python:3.9

# Set the working directory in the container
WORKDIR /app

# Copy the script and any necessary files to the container
COPY . .

# Install any necessary dependencies
RUN pip install dbt-core dbt-postgres dbt-redshift dbt-snowflake dbt-bigquery
RUN dbt deps

# Run the script when the container starts
CMD ["python", "run_dbt.py"]