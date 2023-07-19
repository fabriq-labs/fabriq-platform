---
sidebar_position: 1
sidebar_label: One-click Creation
---

# One-click Creation

To create the user and organization with a single click, follow these steps:

### 1. Update .env File

Before running the initialization process, ensure you have the necessary configuration in place. Refer to the `sample.env` file for the required environment variables. Copy the `sample.env` file and rename it as `.env`, then replace the placeholders with appropriate values for your setup.

```
FABRIQ_DB_NAME=database name
FABRIQ_DB_HOST=host
FABRIQ_DB_PORT=port
FABRIQ_DB_USER=username
FABRIQ_DB_PASSWORD=password
FABRIQ_ORG=org_name
FABRIQ_ORG_SLUG=org_slug
FABRIQ_EMAIL=email
FABRIQ_USER_NAME=user_name
```

### 2. Firebase Admin Key

Make sure your resource/scripts folder contains the `firebase-admin-key.json` file. This file is essential for authentication and authorization processes during the initialization. If you don't have this file, obtain it from your Firebase project and place it in the appropriate directory.

**_firebase-admin-key.json_**

```
{
  "type": "service_account",
  "project_id": "project_id",
  "private_key_id": "private_key_id",
  "private_key": "-----BEGIN PRIVATE KEY-----\nyour private key\n-----END PRIVATE KEY-----\n",
  "client_email": "client_email",
  "client_id": "client_id",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "client_x509_cert_url"
}

```

### 3: Initialization

Once you have updated the `.env` file and have the `firebase-admin-key.json` file in place, you are ready to proceed with the initialization process.
