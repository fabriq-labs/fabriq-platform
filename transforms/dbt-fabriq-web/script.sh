#!/bin/bash
LOG_DIR="/yourpath/logs"
LOG_FILE="$LOG_DIR/$(date +%Y-%m-%d).log"
#your docket image
docker run --rm content-analytics-dbt:v1 > "$LOG_FILE" 2>&1