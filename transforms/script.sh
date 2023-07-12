#!/bin/bash
LOG_DIR="/home/naveen/repo/fabriq/dbt/event-analytics/logs/cronlogs"
LOG_FILE="$LOG_DIR/$(date +%Y-%m-%d).log"

docker run --rm content-analytics-dbt:v1 > "$LOG_FILE" 2>&1