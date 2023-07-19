---
sidebar_position: 2
sidebar_label: Organizations and user setup
---

# Organizations and user creation

## Org Creation

Before proceeding with the organization creation, ensure that you have the following prerequisites in place:

- Access to the system
- Database details (host, port, name, username, password)
- DB tool like DBeaver installed and configured

## Steps to Create an Organization

Follow these steps to create an organization:

1. Launch the DB tool (e.g., DBeaver) and connect to the PostgreSQL database server using the provided database details.

![DB](/img/db.png)

2. Once connected, open a new SQL editor or query console.
3. Run the following SQL query to create the organization:
   ```sql
   INSERT INTO public.organizations (updated_at, created_at, "name", slug, settings)
   VALUES (CURRENT_DATE, CURRENT_DATE, 'Organization Name', 'organization_slug', '{}');
   ```
4. In the DB tool, navigate to the appropriate database and find the organizations table.

## Create Groups
Once the organization is created, you can proceed with creating groups associated with the organization.

### Prerequisites

Before creating groups, ensure that you have the following information available:

- Organization ID: The ID of the organization created in the previous step.
- Group Type: The type of the group (e.g., built-in, custom).
- Group Name: The name of the group.
- Group Permissions: The permissions assigned to the group.

### Steps to Create Groups

Follow these steps to create groups for the organization:

1. Open the DB tool (e.g., DBeaver) and connect to the PostgreSQL database server.
2. Select the appropriate database that contains the organization and group tables.
3. Open a new SQL editor or query console.
4. Run the following SQL query to create a group:

   ```sql
   INSERT INTO public."groups" (org_id, "type", "name", permissions, created_at)
   VALUES (org_id, 'group_type', 'group_name', '{"permission_1", "permission_2"}', current_date);
   ```

Replace org_id with the ID of the organization, group_type with the type of the group, group_name with the name of the group, and desired permissions for the group.

- admin user
    ```sql
    INSERT INTO public."groups" (org_id, "type", "name", permissions, created_at)
    VALUES(org_id, 'builtin', 'admin', '{"admin","super_admin"}', current_date);
- normal user
    ```sql
    INSERT INTO public."groups" (org_id, "type", "name", permissions, created_at)
    VALUES(org_id, 'builtin', 'default', '{"create_dashboard","create_query","edit_dashboard","edit_query","view_query",
    "view_source","execute_query","list_users","schedule_query", "list_dashboards","list_alerts","list_data_sources"}', '2021-06-08');

## Create users

Once the organization and groups are created, you can proceed with creating users and assigning them to the respective groups.

### Steps to Create Users

1. Open the DB tool (e.g., DBeaver) and connect to the PostgreSQL database server.
2. Select the appropriate database that contains the organization, group, and user tables.
3. Open a new SQL editor or query console.
4. Generate an API key for the user using the following Python code snippet:
    ```python
    chars = "abcdefghijklmnopqrstuvwxyz" "ABCDEFGHIJKLMNOPQRSTUVWXYZ" "0123456789"
    rand = random.SystemRandom()
    return "".join(rand.choice(chars) for x in range(length))
5. Run the following SQL query to create a user:
    ```sql
    INSERT INTO public.users (updated_at, created_at, org_id, "name", email, profile_image_url, password_hash, "groups", api_key, disabled_at, details, home_db_slug)
    VALUES(current_date, current_date, org_id, 'name', 'test@test.com', NULL, NULL, '{8}', 'token which you get from generate_token function', NULL, '{"is_invitation_pending": false}', NULL);
6. Create the user with the same email in Firebase

![Authentication](/img/user_auth.png)

7. Import your firebase config information

    **_firebase-admin-key.json_**
    ```
    {
        "type": "xxx",
        "project_id": "xxx",
        "private_key_id": "xxx",
        "private_key": "-----BEGIN PRIVATE KEY-----\xxx\n-----END PRIVATE KEY-----\n",
        "client_email": "xxx",
        "client_id": "xxx",
        "auth_uri": "https://accounts.google.com/o/oauth2/auth",
        "token_uri": "https://oauth2.googleapis.com/token",
        "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
        "client_x509_cert_url": "xxx"
    }
    ```

8. Finally update claims for created user using following code snippet
    ```python
    user = auth.get_user_by_email("email")
    custom_claims = user.custom_claims

    obj = {
        "fabriq_org_slug": "org_slug",
        "fabriq_org_id": org_id,
        "fabriq_user_id": user_id,
        "fabriq_org_name": "org_name"
    }
    
    if custom_claims is not None:
        data = custom_claims.get("https://auth.metalimits.com/jwt/claims").get("fabriq_orgs")
        for objData in data:
            print("obj", objData['fabriq_org_slug'])
            if objData['fabriq_org_slug'] not in fabriq_org_slug:
                if objData['fabriq_org_slug'] == obj.get("fabriq_org_slug"):
                    isAvailable = True
                new_list.append(objData)
                fabriq_org_slug.add(objData['fabriq_org_slug'])

    custom_claims_filter = {
        "https://auth.metalimits.com/jwt/claims" : {
            "fabriq_orgs": new_list
        }
    }
    
    custom_claims = custom_claims_filter
    if custom_claims is None:
        fabriq_orgs = [obj]
        custom_claims = {
            "https://auth.metalimits.com/jwt/claims": {"fabriq_orgs": fabriq_orgs}}
    else:
        if isAvailable == False:
            claim_obj = custom_claims["https://auth.metalimits.com/jwt/claims"]
            orgs_list = claim_obj["fabriq_orgs"]
            orgs_list.append(obj)

            custom_claims = {
                "https://auth.metalimits.com/jwt/claims": {"fabriq_orgs": orgs_list}}

    auth.set_custom_user_claims(user.uid, custom_claims)
    result = auth.get_user_by_email('email')
    custom_claims = result.custom_claims
