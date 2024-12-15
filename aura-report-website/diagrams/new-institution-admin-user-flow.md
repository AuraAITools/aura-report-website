### New Institution Admin user flow

> Mandatory actions to complete before being able to register students

1. register at least 1 outlet
2. create subjects
3. create levels
4. create classes
5. register students

## Register Outlets (optional, if no outlets, all outlet dropdowns are empty)

# Register outlet

> A new institution must at least register 1 outlet

```mermaid
sequenceDiagram
    actor admin_user
    participant website
    participant backend

    note right of admin_user: create outlet
    admin_user ->> website: which institution do i belong to?
    website ->> +backend: GET /institutions with JWT
    note right of website: role: institution_admin
    backend ->> -website: institution data (store in context or session storage)
    admin_user->>+website: create outlet
    website ->> +backend: POST /institutions/{id}/outlets
    note right of website: after: check userId can access institution data
    backend ->> -website: 201 CREATED
    website ->> -admin_user : outlet created
```

# Create Subjects

```mermaid
sequenceDiagram
    actor admin_user
    participant website
    participant backend

    note right of admin_user: create subjects
    admin_user ->> website: which institution do i belong to?
    website ->> +backend: GET /institutions with JWT
    note right of website: role: institution_admin
    backend ->> -website: institution data (store in context or session storage)
    admin_user ->> +website: create subject(s)
    website->> +backend: POST /institution/{id}/subjects
    note right of website: after: check userId can access institution data
    backend ->> -website: 201 CREATED
    website ->> admin_user: Subject(s) created
```

# Create Levels

```mermaid
sequenceDiagram
    actor admin_user
    participant website
    participant backend

    note right of admin_user: create levels
    admin_user ->> website: which institution do i belong to?
    website ->> +backend: GET /institutions with JWT
    note right of website: role: institution_admin
    backend ->> -website: institution data (store in context or session storage)
    website ->> +backend : GET /institutions/{id}/subjects
    note right of website: get available subjects for dropdown
    backend ->> -website: OK subjects[]

    admin_user ->> +website: create level(s)
    website ->> +backend: POST /institutions/{id}/levels
    note right of website: after: check userId can access institution data
    backend ->> -website: 201 CREATED
    website ->> -admin_user: created level(s)
```

# Create Classes

```mermaid
sequenceDiagram
    actor admin_user
    participant website
    participant backend

    note right of admin_user: create classes
    admin_user ->> website: which institution do i belong to?
    website ->> +backend: GET /institutions with JWT
    note right of website: role: institution_admin
    backend ->> -website: institution data (store in context or session storage)
    website ->> +backend : GET /institutions/{id}/levels
    note right of website: get available levels for dropdown <br/> this api should also get nested subjects
    backend ->> -website: OK levels[] & nested subjects[]

    admin_user ->> +website: create class(s)
    website ->> +backend: POST /institutions/{id}/classes
    note right of website: after: check userId can access institution data
    backend ->> -website: 201 CREATED
    website ->> -admin_user: created class(s)
```

# Create Students

```mermaid
sequenceDiagram
    participant aura-report-mobile
    actor client
    actor admin_user
    participant website
    participant backend
    participant keycloak


    client  ->> admin_user: I want a aura report dashboard
    admin_user ->> website: which institution do i belong to?
    website ->> +backend: GET /institutions with JWT
    note right of website: role: institution_admin
    backend ->> -website: institution data (store in context or session storage)

    %% Create Client Account
    note right of admin_user: create account
    admin_user ->> +website: create a user account for client
    website ->> +backend: POST /institutions/{id}/accounts
    note right of website: create client account with role client_admin
    backend ->> +keycloak: create account with role client_admin
    keycloak ->> keycloak: create account + send emails to client
    keycloak ->> backend: created
    backend ->> -website: created
    website ->> -admin_user: account created

    %% Add Students to Client Account
    note right of admin_user: add Students to Client Account
    admin_user ->> +website: add student(s)
    website ->> +backend: POST /institutions/{id}/students
    backend ->> -website: 201 CREATED
    website ->> -admin_user: created students

    %% Register Classes to Added Students
    note right of admin_user: Register Classes to Added students
    admin_user ->> website: register student to these classes
    website ->> +backend: PATCH /institution/{id}/students/{id}/classes/{id}/link
    backend ->> -website: 200 OK registered student to classes
    website ->> admin_user: registered student to classes
    note over admin_user: at this point client can access report mobile
    admin_user ->> client: please verify your email & reset password
    client ->> client: verify email & reset password

    %% TODO: complete flow for aura report mobile
    client ->> +aura-report-mobile: login
    aura-report-mobile ->> -client: ok
    client ->> aura-report-mobile: complete initial registration form
    aura-report-mobile ->> +backend: POST /complete-client-registration
    backend ->> -aura-report-mobile: finished registration
    note over aura-report-mobile: enable access to app
```

# Create Lessons

# Create Educators
