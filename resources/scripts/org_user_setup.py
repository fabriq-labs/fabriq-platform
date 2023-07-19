import os
from datetime import date
import psycopg2
import random
import firebase_admin
from firebase_admin import credentials, auth

# Path to the Firebase Admin SDK JSON file
firebase_admin_key_path = os.path.abspath("firebase-admin-key.json")

# Initialize the Firebase Admin SDK
firebase_admin.initialize_app(credentials.Certificate(firebase_admin_key_path))

# Find the .env file in the parent directories
env_file = os.path.abspath("../../../fabriq-platform/.env")

if not os.path.isfile(env_file):
    print("ERROR: .env file not found in the project directory or its parent directories.")
    exit(1)

# Load environment variables from .env file
with open(env_file) as f:
    for line in f:
        key, value = line.strip().split("=")
        os.environ[key] = value

# Retrieve environment variables
fabriq_db_name = os.getenv("FABRIQ_DB_NAME")
fabriq_db_host = os.getenv("FABRIQ_DB_HOST")
fabriq_db_port = os.getenv("FABRIQ_DB_PORT")
fabriq_db_user = os.getenv("FABRIQ_DB_USER")
fabriq_db_pass = os.getenv("FABRIQ_DB_PASSWORD")
fabriq_org = os.getenv("FABRIQ_ORG")
fabriq_org_slug = os.getenv("FABRIQ_ORG_SLUG")
fabriq_email = os.getenv("FABRIQ_EMAIL")
fabriq_user_name = os.getenv("FABRIQ_USER_NAME")


db_url = f"postgres://{fabriq_db_user}:{fabriq_db_pass}@{fabriq_db_host}:{fabriq_db_port}/{fabriq_db_name}"

def create_organization(org_name, org_slug, email, user_name):
    # Current date
    created_at = date.today().strftime("%Y-%m-%d")

    conn = psycopg2.connect(db_url)
    cursor = conn.cursor()

    # Query to insert organization
    query = """
        INSERT INTO public.organizations (updated_at, created_at, "name", slug, settings)
        VALUES (%s, %s, %s, %s, %s)
        RETURNING id;
    """
    values = (created_at, created_at, org_name, org_slug, '{}')

    try:
        cursor.execute(query, values)
        org_id = cursor.fetchone()[0]
        conn.commit()
        print("Organization created successfully!")
        create_group(org_id, "builtin", "admin", email, user_name, org_slug, org_name)
    except Exception as e:
        conn.rollback()
        print(f"Error executing query: {str(e)}")
    finally:
        cursor.close()
        conn.close()

def create_group(org_id, group_type, group_name, email, user_name, org_slug, org_name):
    # Current date
    created_at = date.today().strftime("%Y-%m-%d")

    conn = psycopg2.connect(db_url)
    cursor = conn.cursor()

    # Query to insert group
    query = """
        INSERT INTO public."groups" (org_id, "type", "name", permissions, created_at)
        VALUES (%s, %s, %s, %s, %s)
        RETURNING id;
    """
    values = (org_id, group_type, group_name, '{"admin","super_admin"}', created_at)

    try:
        cursor.execute(query, values)
        group_id = cursor.fetchone()[0]
        conn.commit()
        print("Group created successfully!")
        create_user(org_id, group_id, user_name, email, org_slug, org_name)
    except Exception as e:
        conn.rollback()
        print(f"Error executing query: {str(e)}")
    finally:
        cursor.close()
        conn.close()

def generate_token(length):
    chars = "abcdefghijklmnopqrstuvwxyz" "ABCDEFGHIJKLMNOPQRSTUVWXYZ" "0123456789"
    rand = random.SystemRandom()
    return "".join(rand.choice(chars) for x in range(length))

def create_user_firebase(email, org_slug, org_id, user_id, org_name, name):
    custom_claims = {}
    custom_claims["https://fabriq/jwt/claims"] = [{'fabriq_org_slug': org_slug, 'fabriq_org_id': org_id,
                                                               "fabriq_user_id": user_id, "fabriq_org_name": org_name}]
    user = auth.create_user(
        email=email,
        email_verified=True,
        password='test@123',
        display_name=name,
        disabled=False)
    print('Successfully created a new user in Firebase: {0}'.format(user.uid))

    auth.set_custom_user_claims(user.uid, custom_claims)

def create_user(org_id, group_id, user_name, user_email, org_slug, org_name):
    created_at = date.today().strftime("%Y-%m-%d")

    conn = psycopg2.connect(db_url)
    cursor = conn.cursor()

    api_key = generate_token(40)

    # Query to insert user
    query = """
        INSERT INTO public.users
        (updated_at, created_at, org_id, "name", email, profile_image_url, password_hash, "groups", api_key, disabled_at, details, home_db_slug)
        VALUES (%s, %s, %s, %s, %s, NULL, NULL, %s, %s, NULL, '{"is_invitation_pending": false}', NULL)
        RETURNING id;
    """
    values = (created_at, created_at, org_id, user_name, user_email, '{' + str(group_id) + '}', api_key)

    try:
        cursor.execute(query, values)
        conn.commit()
        inserted_row = cursor.fetchone()  # Fetch the result row containing the id
        if inserted_row:
            user_id = inserted_row[0]
            print("User inserted successfully with ID:", user_id)
            create_user_firebase(user_email, org_slug, org_id, user_id, org_name, user_name)
            print("User created successfully!")
        else:
            print("Failed to fetch the inserted user ID.")
    except Exception as e:
        conn.rollback()
        print(f"Error executing query: {str(e)}")
    finally:
        cursor.close()
        conn.close()

# Call the functions
create_organization(fabriq_org, fabriq_org_slug, fabriq_email, fabriq_user_name)
