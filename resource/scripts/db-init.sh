#!/bin/bash

set -eo pipefail

env_file="../../../fabriq-platform/.env"
# Export environment variables from .env file
export $(cat "$env_file" | xargs)

fabriq_db_name=${FABRIQ_DB_NAME}
fabriq_db_host=${FABRIQ_DB_HOST}
fabriq_db_port=${FABRIQ_DB_PORT}
fabriq_db_user=${FABRIQ_DB_USER}
fabriq_db_pass=${FABRIQ_DB_PASSWORD}
create_database() {
  db_name=$1
  db_host=$2
  db_port=$3
  db_user=$4
  db_pass=$5
  db_url="postgres://$db_user:$db_pass@$db_host:$db_port"


  if [ "$( psql "$db_url" -tAc "SELECT 1 FROM pg_database WHERE datname='$db_name'" )" = '1' ]
  then
      echo "Database $db_name already exists"
  else
      echo "Creating database $db_name"
      PGPASSWORD=$db_pass createdb -h "$db_host" -U "$db_user" -p "$db_port" "$db_name"
  fi
}

create_database "$fabriq_db_name" "$fabriq_db_host" "$fabriq_db_port" "$fabriq_db_user" "$fabriq_db_pass"

echo "Applying Flyway migrations"
flyway \
  -locations="filesystem:../db/migrations" \
  -url="jdbc:postgresql://$fabriq_db_host:$fabriq_db_port/$fabriq_db_name" \
  -user="$fabriq_db_user" \
  -password="$fabriq_db_pass" \
  migrate
