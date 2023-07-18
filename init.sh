#!/bin/bash

# Export environment variables from .env file
export $(cat .env | xargs)
./resources/scripts/db-init.sh