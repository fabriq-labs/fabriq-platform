#!/bin/bash

# Export environment variables from .env file
export $(cat .env | xargs)

# Run db-init.sh from the current directory
./resources/scripts/db-init.sh

# Change to the 'resources/scripts' directory
cd resources/scripts

# Step 1: Create Python environment
python3 -m venv .venv

# Step 2: Activate the Python environment
source .venv/bin/activate

# Step 3: Install requirements from requirement.txt
pip install -r requirements.txt

# Step 4: Run org_user_setup.py
python org_user_setup.py

# Return back to the original directory (optional, depending on your needs)
cd ../../
