### New Institution Admin user flow

> Mandatory actions to complete before being able to register students

0. create a institution
1. register at least 1 outlet
2. create subjects
3. create levels
4. create classes
5. register students

## Register Outlets (optional, if no outlets, all outlet dropdowns are empty)

# Onboarding institution flow

This action can only currently be done by a technical user. the technical user needs to have the `aura-admin` role to access the `create institution api`. the access token for with aura-admin role can be retrieved as a `service-account` of the `aura-application-client` via the `client-credential` flow

Note:

1. Creating a blank account refers to creating a keycloak user that is not enabled and also persisting the account entity in DB; no roles are given yet. the tenant-id (which is the institution_id) is also added the the keycloak user's `ext_attr.tenant_ids` field. This will allow the access token of the token to store the state of the user's allowed tenants. `This is useful because it will remove the need for api calls to the api server to check which institution the user is`

```mermaid
sequenceDiagram
   participant website
   actor customer_user
   actor technical_user
   participant keycloak
   participant report-ms

   note right of technical_user: retrieve service account token
   technical_user ->> +keycloak: POST https://{KEYCLOAK_HOST}/realms/aura/protocol/openid-connect/token
   keycloak ->> -technical_user: access token with role `aura-admin`

   technical_user ->> +report-ms: POST {{server_url}}/api/v1/institutions + SA access token
   note right of report-ms: 1. create institution <br> 2. create institution admin, client, educator roles in format <br>{institution_id}-institution-admin <br>outlet admin roles creation is deferred to outlet creation time
   report-ms ->> -technical_user: Created Institution

   note right of technical_user: create institution admins for institution
   technical_user ->> +report-ms: POST {{server_url}}/api/v1/institutions/{{institution_id}}/accounts/institution-admins
   note right of report-ms: 1. Create blank account <br> 2. add institution-admin role to blank account <br> 3. add institution-admin entity to DB <br> 4. send email to customer_user to `verify` and `reset password` for created account
   report-ms ->> -technical_user: created institution admin
   customer_user ->> customer_user: verify and reset password
   customer_user ->> website: login to website
   website ->> customer_user: initial page

```

# Register an outlet

> A new institution must at least register 1 outlet

```mermaid
sequenceDiagram
    actor outlet_admin
    actor institution_admin
    participant website
    participant report-ms

    institution_admin ->> +website: go to /outlets page
    website ->> -institution_admin: create outlet form UI
    note right of institution_admin: create outlet in institution
    institution_admin ->> +website: POST {{website_url}}/api/institutions/{{institution_id}}/outlets
    website ->> +report-ms: POST {{server_url}}/api/v1/institutions/{{institution_id}}/outlets
    note right of report-ms: 1. Create outlet DB entity <br> 2. Create outlet admin role in format {institution-id}_{outlet-id}_outlet-admin
    report-ms ->> -website: created outlet
    website ->> -institution_admin: created outlet
    note right of institution_admin: Create a outlet-admin
    institution_admin ->> +website: create a outlet-admin
    website ->> +report-ms: POST {{server_url}}/api/v1/institutions/{{institution_id}}/outlets/{{outlet_id}}/accounts/outlet-admins
    note right of report-ms: 1. Create Blank Account <br> 2. add specific outlet's outlet-admin role to account <br> persist outlet-admin entity to DB <br> 4. send email to `verify` and `reset password` to outlet admin email
    report-ms ->> -website: created outlet admin
    website ->> -institution_admin: created outlet admin
    outlet_admin ->> outlet_admin: verify and reset password
    outlet_admin ->> +website: login to website
    website ->> -outlet_admin: website page

```

# Create Subjects (institution level)

Subjects are institution level entities and are shared across outlets. The same applies for accounts

```mermaid
sequenceDiagram
    actor institution_admin
    participant website
    participant report-ms

    institution_admin ->> +website : go to /subjects page for create subject form UI
    website ->> -institution_admin: subjects page UI + create subject form UI
    note right of institution_admin: fill in form to create a subject
    institution_admin ->> +website: create new subject
    website ->> +report-ms: POST {{server_url}}/api/v1/institutions/{{institution_id}}/subjects
    report-ms ->> -website: created subject
    website ->> -institution_admin: created subject

```

# Create Levels (institution level)

Levels are institution level entities and are shared across outlets. The same applies for accounts

```mermaid
sequenceDiagram
    actor institution_admin
    participant website
    participant report-ms

    institution_admin ->> +website : go to /levels page for create level form UI
    website ->> -institution_admin: levels page UI + create level form UI
    note right of institution_admin: fill in form to create a level
    institution_admin ->> +website: create new level
    website ->> +report-ms: POST {{server_url}}/api/v1/institutions/{{institution_id}}/levels
    report-ms ->> -website: created level
    website ->> -institution_admin: created level

```

# Create Students (Institution level + outlet level)

Note: This flow is pretty similar for educators.

Students exist on a institution level. but can be bound to multiple outlets of that institution. Prior to creating a student, the `admin (outlet_admin or institution_admin)` must first create a `client account`. Then the `admin` can create `students` to add to the `client account`. the student can then be bound different `outlets`. Note that students are not bound to this outlet just because they are registered here. the students will be bound to an outlet only after they register for a course in that outlet

```mermaid
sequenceDiagram
    participant report_mobile
    actor client
    actor admin_user
    participant website
    participant report-ms
    participant keycloak


    client  ->> admin_user: I want a aura report dashboard
    %% Create Students Client Account
    note right of admin_user: create a students client account
    admin_user ->> +website: create a students client account
    website ->> +report-ms: POST {{server_url}}/api/v1/institutions/{{institution_id}}/accounts/students-client-account
    note right of report-ms: 1. create blank account <br> 2. add `report-mobile` role to students client account <br> 3. Create student client account entity in DB 4. send email to client to verify and reset password
    report-ms -> -website: created Students Client Account
    website ->> -admin_user: created Students client account

    %% Create and add Students into Students Client Account
    note right of admin_user: add students to client account
    admin_user ->> +website: add students to client account
    website ->> +report-ms: POST {{server_url}}/api/v1/institutions/{{institution_id}}/accounts/{{account_id}}/students
    note right of report-ms: 1. create student entity in DB <br> 2. link student entity to account
    report-ms ->> -website: created and linked student entity to account
    website ->> -admin_user: created and linked student entity to account
    client ->> client: verify and reset password on email
    client ->> +report_mobile: login report mobile
    report_mobile ->> -client: show home

```

# Create Classes/Courses (Outlet level entities)

Classes exist on the outlet level and not the institution level. a institution_admin can create courses for every outlet. a outlet_admin can only create courses for his own outlet. both will be referred as admin_user in this diagram

```mermaid
sequenceDiagram
    actor admin_user
    participant website
    participant report-ms


    note right of admin_user: create classes for a outlet
    admin_user ->> +website: get me the /courses page with the create course form
    website ->> -admin_user: /courses page
    admin_user ->> +website: create course for outlet id
    website ->> +report-ms: POST {{server_url}}/api/v1/institutions/{{institution_id}}/outlets/{{outlet_id}}/courses
    note right of report-ms: 1. create course entity and bind to <br> mandatory entities: <br> 1. level <br> 2. subject <br> optional entities <br> 1. students <br> 2. educators. <br> If student is registered to a course, add student to outlet too
    report-ms ->> report-ms: create first 5 lessons of course
    report-ms ->> -website: created course
    website ->> admin_user: created course

```

# Create Lessons

# Create Educators
