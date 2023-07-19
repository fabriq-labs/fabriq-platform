#!/bin/bash
set -eo pipefail
# Set relative path to the .env file
env_file="../../../fabriq-platform/.env"

# Export environment variables from .env file
export $(cat "$env_file" | xargs)

fabriq_db_name=${FABRIQ_DB_NAME}
fabriq_db_host=${FABRIQ_DB_HOST}
fabriq_db_port=${FABRIQ_DB_PORT}
fabriq_db_user=${FABRIQ_DB_USER}
fabriq_db_pass=${FABRIQ_DB_PASSWORD}

hasura_admin_secret=${HASURA_GRAPHQL_ADMIN_SECRET}

echo "Build Database URL For $fabriq_db_name"

HASURA_ENDPOINT=${GRAPHQL_URL}  # your Hasura endpoint
DATABASE_URL="postgres://$fabriq_db_user:$fabriq_db_pass@$fabriq_db_host:$fabriq_db_port/$fabriq_db_name" 
METADATA_FILE="../../resources/hasura_metadata.json"  # Path to your hasura_metadata.json file

echo "Append database details in the metadata Inprogress"
# Update metadata.json with database_url
sed -i "s|\"database_url\": \".*\"|\"database_url\": \"$DATABASE_URL\"|" $METADATA_FILE

echo "Append database details in the metadata Successfull"

echo "Import Metadata to hasura $HASURA_ENDPOINT"
# cat $METADATA_FILE
curl -X POST "$HASURA_ENDPOINT/v1/metadata" \
     -H 'Content-Type: application/json' \
     -H "X-Hasura-Admin-Secret: $hasura_admin_secret" \
     -d '{"type":"replace_metadata", "args":'"$(cat $METADATA_FILE)"'}'

echo "Import Metadata Successfull"