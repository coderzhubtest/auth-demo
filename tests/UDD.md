# Unit Design Document (UDD)
## API Endpoint Test Cases

**Project:** User Authentication & Profile Management System  
**Version:** 1.0  
**Date:** April 19, 2026  
**Technology Stack:** FastAPI, Python, JWT Authentication  

---

## Table of Contents
1. [Test Overview](#test-overview)
2. [Test Cases - Registration Endpoint](#test-cases---registration-endpoint)
3. [Test Cases - Login Endpoint](#test-cases---login-endpoint)
4. [Test Cases - Get User Profile Endpoint](#test-cases---get-user-profile-endpoint)
5. [Test Cases - Update User Profile Endpoint](#test-cases---update-user-profile-endpoint)
6. [Test Cases - Logout Endpoint](#test-cases---logout-endpoint)
7. [Test Execution Summary](#test-execution-summary)

---

## Test Overview

### Scope
This document covers unit tests for the FastAPI backend endpoints without UI interaction. Tests focus on API request/response validation, error handling, and data persistence.

### Test Environment
- **API Base URL:** `http://localhost:8000`
- **Database:** JSON file-based (`data/users.json`)
- **Testing Tool:** Pytest or similar (manual execution with curl/Postman)
- **Authentication:** Bearer token (JWT)

### Test Data Setup
- Test user email: `testuser@example.com`
- Test user password: `SecurePassword123`
- Test user full_name: `Test User`
- Admin/existing user can be pre-populated in database

---

## Test Cases - Registration Endpoint

### Endpoint: `POST /api/auth/register`

---

### TC-REG-001: Successful User Registration

| Field | Value |
|-------|-------|
| **Test Case ID** | TC-REG-001 |
| **Title** | Successful new user registration with valid data |
| **Endpoint** | `POST /api/auth/register` |
| **Priority** | P1 (Critical) |
| **Status** | Ready for Testing |

#### Description
Test that a new user can successfully register with valid email, password, and full name.

#### Input Data
```json
{
  "email": "newuser@example.com",
  "password": "ValidPassword123!",
  "full_name": "New Test User"
}
```

#### Expected Output
**Status Code:** `201 Created`

```json
{
  "user_id": "uuid-format-string",
  "email": "newuser@example.com",
  "full_name": "New Test User",
  "created_at": "2026-04-19T10:30:00.000000",
  "updated_at": "2026-04-19T10:30:00.000000"
}
```

#### Pass Criteria
- ✅ Response status code is 201
- ✅ Response body contains user_id (UUID format)
- ✅ Response contains email matching input
- ✅ Response contains full_name matching input
- ✅ Response contains created_at and updated_at timestamps
- ✅ Password is NOT included in response
- ✅ User is persisted in database
- ✅ Password is hashed in database (not plain text)

#### Fail Criteria
- ❌ Status code is not 201
- ❌ Response doesn't contain required fields
- ❌ Password is visible in response
- ❌ User not found in database after registration

---

### TC-REG-002: Registration with Duplicate Email

| Field | Value |
|-------|-------|
| **Test Case ID** | TC-REG-002 |
| **Title** | Registration fails when email already exists |
| **Endpoint** | `POST /api/auth/register` |
| **Priority** | P1 (Critical) |
| **Status** | Ready for Testing |

#### Precondition
- User with email `existing@example.com` already exists in database

#### Description
Test that registration fails when attempting to register with an email that's already registered.

#### Input Data
```json
{
  "email": "existing@example.com",
  "password": "ValidPassword123!",
  "full_name": "Existing User"
}
```

#### Expected Output
**Status Code:** `400 Bad Request`

```json
{
  "detail": "Email already registered"
}
```

#### Pass Criteria
- ✅ Response status code is 400 Bad Request
- ✅ Response detail message is "Email already registered"
- ✅ No duplicate user is created
- ✅ Existing user data remains unchanged

#### Fail Criteria
- ❌ Status code is not 400
- ❌ Error message is different or missing
- ❌ Duplicate user is created in database
- ❌ Response doesn't contain detail field

---

### TC-REG-003: Registration with Invalid Email Format

| Field | Value |
|-------|-------|
| **Test Case ID** | TC-REG-003 |
| **Title** | Registration fails with invalid email format |
| **Endpoint** | `POST /api/auth/register` |
| **Priority** | P2 (High) |
| **Status** | Ready for Testing |

#### Description
Test that registration fails when email format is invalid.

#### Input Data
```json
{
  "email": "invalid-email-format",
  "password": "ValidPassword123!",
  "full_name": "Test User"
}
```

#### Expected Output
**Status Code:** `422 Unprocessable Entity`

```json
{
  "detail": [
    {
      "loc": ["body", "email"],
      "msg": "invalid email format",
      "type": "value_error.email"
    }
  ]
}
```

#### Pass Criteria
- ✅ Response status code is 422 Unprocessable Entity
- ✅ Error details include email field
- ✅ User is NOT created in database

#### Fail Criteria
- ❌ Status code is not 422
- ❌ User is created with invalid email

---

### TC-REG-004: Registration with Missing Required Fields

| Field | Value |
|-------|-------|
| **Test Case ID** | TC-REG-004 |
| **Title** | Registration fails when required fields are missing |
| **Endpoint** | `POST /api/auth/register` |
| **Priority** | P2 (High) |
| **Status** | Ready for Testing |

#### Description
Test that registration fails when any required field is missing.

#### Input Data
```json
{
  "email": "newuser@example.com",
  "full_name": "Test User"
}
```
(Missing password field)

#### Expected Output
**Status Code:** `422 Unprocessable Entity`

```json
{
  "detail": [
    {
      "loc": ["body", "password"],
      "msg": "field required",
      "type": "value_error.missing"
    }
  ]
}
```

#### Pass Criteria
- ✅ Response status code is 422 Unprocessable Entity
- ✅ Error indicates which field is missing
- ✅ User is NOT created in database

#### Fail Criteria
- ❌ Status code is not 422
- ❌ User is created despite missing field

---

### TC-REG-005: Registration with Empty Password

| Field | Value |
|-------|-------|
| **Test Case ID** | TC-REG-005 |
| **Title** | Registration fails with empty password |
| **Endpoint** | `POST /api/auth/register` |
| **Priority** | P2 (High) |
| **Status** | Ready for Testing |

#### Description
Test that registration fails when password is empty string.

#### Input Data
```json
{
  "email": "newuser@example.com",
  "password": "",
  "full_name": "Test User"
}
```

#### Expected Output
**Status Code:** `422 Unprocessable Entity` or `400 Bad Request`

#### Pass Criteria
- ✅ Registration is rejected
- ✅ Error message indicates empty password
- ✅ User is NOT created in database

#### Fail Criteria
- ❌ Registration succeeds with empty password
- ❌ User created with empty password

---

---

## Test Cases - Login Endpoint

### Endpoint: `POST /api/auth/login`

---

### TC-LOGIN-001: Successful Login with Valid Credentials

| Field | Value |
|-------|-------|
| **Test Case ID** | TC-LOGIN-001 |
| **Title** | Successful login with valid email and password |
| **Endpoint** | `POST /api/auth/login` |
| **Priority** | P1 (Critical) |
| **Status** | Ready for Testing |

#### Precondition
- User with email `testuser@example.com` and password `TestPassword123!` exists in database
- Password is properly hashed with bcrypt

#### Description
Test that a user can successfully login with correct credentials and receive a valid JWT token.

#### Input Data
```json
{
  "email": "testuser@example.com",
  "password": "TestPassword123!"
}
```

#### Expected Output
**Status Code:** `200 OK`

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "user_id": "550e8400-e29b-41d4-a716-446655440000"
}
```

#### Pass Criteria
- ✅ Response status code is 200 OK
- ✅ Response contains access_token (non-empty JWT string)
- ✅ Response token_type is "bearer"
- ✅ Response contains valid user_id (UUID format)
- ✅ JWT token is valid and can be decoded
- ✅ JWT token contains email in "sub" claim
- ✅ JWT token has expiration claim with future timestamp

#### Fail Criteria
- ❌ Status code is not 200
- ❌ access_token is missing or empty
- ❌ JWT token is malformed or invalid
- ❌ User_id is missing or invalid format

---

### TC-LOGIN-002: Login with Incorrect Password

| Field | Value |
|-------|-------|
| **Test Case ID** | TC-LOGIN-002 |
| **Title** | Login fails with incorrect password |
| **Endpoint** | `POST /api/auth/login` |
| **Priority** | P1 (Critical) |
| **Status** | Ready for Testing |

#### Precondition
- User with email `testuser@example.com` exists in database

#### Description
Test that login fails when password is incorrect.

#### Input Data
```json
{
  "email": "testuser@example.com",
  "password": "WrongPassword123!"
}
```

#### Expected Output
**Status Code:** `401 Unauthorized`

```json
{
  "detail": "Invalid email or password"
}
```

#### Pass Criteria
- ✅ Response status code is 401 Unauthorized
- ✅ Response detail is "Invalid email or password"
- ✅ No token is returned
- ✅ Error message doesn't reveal whether email exists

#### Fail Criteria
- ❌ Status code is not 401
- ❌ Token is returned despite wrong password
- ❌ Error message reveals email doesn't exist

---

### TC-LOGIN-003: Login with Non-existent Email

| Field | Value |
|-------|-------|
| **Test Case ID** | TC-LOGIN-003 |
| **Title** | Login fails with non-existent email |
| **Endpoint** | `POST /api/auth/login` |
| **Priority** | P1 (Critical) |
| **Status** | Ready for Testing |

#### Description
Test that login fails when email doesn't exist in database.

#### Input Data
```json
{
  "email": "nonexistent@example.com",
  "password": "AnyPassword123!"
}
```

#### Expected Output
**Status Code:** `401 Unauthorized`

```json
{
  "detail": "Invalid email or password"
}
```

#### Pass Criteria
- ✅ Response status code is 401 Unauthorized
- ✅ Response detail is "Invalid email or password"
- ✅ No token is returned
- ✅ Error message doesn't reveal email doesn't exist

#### Fail Criteria
- ❌ Status code is not 401
- ❌ Token is returned
- ❌ Error message reveals email doesn't exist

---

### TC-LOGIN-004: Login with Invalid Email Format

| Field | Value |
|-------|-------|
| **Test Case ID** | TC-LOGIN-004 |
| **Title** | Login fails with invalid email format |
| **Endpoint** | `POST /api/auth/login` |
| **Priority** | P2 (High) |
| **Status** | Ready for Testing |

#### Description
Test that login fails when email format is invalid.

#### Input Data
```json
{
  "email": "invalid-email",
  "password": "AnyPassword123!"
}
```

#### Expected Output
**Status Code:** `422 Unprocessable Entity`

#### Pass Criteria
- ✅ Response status code is 422 Unprocessable Entity
- ✅ Error indicates invalid email format

#### Fail Criteria
- ❌ Status code is not 422
- ❌ Request is processed despite invalid email

---

### TC-LOGIN-005: Login with Missing Credentials

| Field | Value |
|-------|-------|
| **Test Case ID** | TC-LOGIN-005 |
| **Title** | Login fails with missing email or password |
| **Endpoint** | `POST /api/auth/login` |
| **Priority** | P2 (High) |
| **Status** | Ready for Testing |

#### Description
Test that login fails when email or password is missing.

#### Input Data
```json
{
  "email": "testuser@example.com"
}
```
(Missing password)

#### Expected Output
**Status Code:** `422 Unprocessable Entity`

#### Pass Criteria
- ✅ Response status code is 422 Unprocessable Entity
- ✅ Error indicates missing field

#### Fail Criteria
- ❌ Status code is not 422

---

### TC-LOGIN-006: JWT Token Validity

| Field | Value |
|-------|-------|
| **Test Case ID** | TC-LOGIN-006 |
| **Title** | JWT token returned from login is valid and contains correct claims |
| **Endpoint** | `POST /api/auth/login` |
| **Priority** | P2 (High) |
| **Status** | Ready for Testing |

#### Description
Test that JWT token returned contains correct claims and can be decoded.

#### Input Data
```json
{
  "email": "testuser@example.com",
  "password": "TestPassword123!"
}
```

#### Expected Output
Valid JWT token with structure:
```
Header: { "alg": "HS256", "typ": "JWT" }
Payload: { "sub": "testuser@example.com", "exp": 1713602400 }
```

#### Pass Criteria
- ✅ Token can be decoded without error
- ✅ Algorithm is HS256
- ✅ "sub" claim equals user email
- ✅ "exp" claim is a future timestamp
- ✅ "exp" claim is 30 minutes from now (±1 minute)

#### Fail Criteria
- ❌ Token cannot be decoded
- ❌ Claims are missing or incorrect
- ❌ Expiration is in the past

---

---

## Test Cases - Get User Profile Endpoint

### Endpoint: `GET /api/users/{user_id}`

---

### TC-PROFILE-001: Get User Profile with Valid Token

| Field | Value |
|-------|-------|
| **Test Case ID** | TC-PROFILE-001 |
| **Title** | Successfully retrieve user profile with valid authentication |
| **Endpoint** | `GET /api/users/{user_id}` |
| **Priority** | P1 (Critical) |
| **Status** | Ready for Testing |

#### Precondition
- User with ID `550e8400-e29b-41d4-a716-446655440000` exists in database
- Valid JWT token for this user is available
- Token is not expired

#### Description
Test that an authenticated user can retrieve their own profile.

#### Request Headers
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

#### Input Data
- **URL Path:** `/api/users/550e8400-e29b-41d4-a716-446655440000`
- **Method:** GET

#### Expected Output
**Status Code:** `200 OK`

```json
{
  "user_id": "550e8400-e29b-41d4-a716-446655440000",
  "email": "testuser@example.com",
  "full_name": "Test User",
  "created_at": "2026-04-19T08:00:00.000000",
  "updated_at": "2026-04-19T10:00:00.000000"
}
```

#### Pass Criteria
- ✅ Response status code is 200 OK
- ✅ Response contains all user fields (user_id, email, full_name, created_at, updated_at)
- ✅ Response data matches database
- ✅ Sensitive fields (hashed_password) are NOT included
- ✅ Timestamps are in ISO format

#### Fail Criteria
- ❌ Status code is not 200
- ❌ Hashed password is exposed in response
- ❌ Data doesn't match database

---

### TC-PROFILE-002: Get Profile Without Authentication Token

| Field | Value |
|-------|-------|
| **Test Case ID** | TC-PROFILE-002 |
| **Title** | Profile retrieval fails without authentication token |
| **Endpoint** | `GET /api/users/{user_id}` |
| **Priority** | P1 (Critical) |
| **Status** | Ready for Testing |

#### Description
Test that profile retrieval fails when no authentication token is provided.

#### Request Headers
(No Authorization header)

#### Input Data
- **URL Path:** `/api/users/550e8400-e29b-41d4-a716-446655440000`
- **Method:** GET

#### Expected Output
**Status Code:** `403 Forbidden` or `401 Unauthorized`

```json
{
  "detail": "Not authenticated" or "Could not validate credentials"
}
```

#### Pass Criteria
- ✅ Response status code is 403 or 401
- ✅ Profile data is NOT returned
- ✅ Error message indicates authentication required

#### Fail Criteria
- ❌ Profile data is returned without token
- ❌ Status code is 200

---

### TC-PROFILE-003: Get Profile with Invalid Token

| Field | Value |
|-------|-------|
| **Test Case ID** | TC-PROFILE-003 |
| **Title** | Profile retrieval fails with invalid token |
| **Endpoint** | `GET /api/users/{user_id}` |
| **Priority** | P2 (High) |
| **Status** | Ready for Testing |

#### Description
Test that profile retrieval fails when token is invalid or malformed.

#### Request Headers
```
Authorization: Bearer invalid.token.string
```

#### Input Data
- **URL Path:** `/api/users/550e8400-e29b-41d4-a716-446655440000`
- **Method:** GET

#### Expected Output
**Status Code:** `401 Unauthorized`

```json
{
  "detail": "Could not validate credentials"
}
```

#### Pass Criteria
- ✅ Response status code is 401
- ✅ Profile data is NOT returned
- ✅ Error message indicates invalid credentials

#### Fail Criteria
- ❌ Profile data is returned
- ❌ Status code is 200

---

### TC-PROFILE-004: Get Profile with Expired Token

| Field | Value |
|-------|-------|
| **Test Case ID** | TC-PROFILE-004 |
| **Title** | Profile retrieval fails with expired token |
| **Endpoint** | `GET /api/users/{user_id}` |
| **Priority** | P2 (High) |
| **Status** | Ready for Testing |

#### Description
Test that profile retrieval fails when JWT token has expired.

#### Request Headers
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... (expired token)
```

#### Input Data
- **URL Path:** `/api/users/550e8400-e29b-41d4-a716-446655440000`
- **Method:** GET

#### Expected Output
**Status Code:** `401 Unauthorized`

```json
{
  "detail": "Could not validate credentials"
}
```

#### Pass Criteria
- ✅ Response status code is 401
- ✅ Profile data is NOT returned
- ✅ Expired token is rejected

#### Fail Criteria
- ❌ Profile data is returned with expired token
- ❌ Status code is 200

---

### TC-PROFILE-005: Access Another User's Profile

| Field | Value |
|-------|-------|
| **Test Case ID** | TC-PROFILE-005 |
| **Title** | User cannot access another user's profile |
| **Endpoint** | `GET /api/users/{user_id}` |
| **Priority** | P1 (Critical) |
| **Status** | Ready for Testing |

#### Precondition
- User A (ID: `111e1111-e11b-11d4-a111-111155110000`) has valid token
- User B (ID: `222e2222-e22b-22d4-a222-222255220000`) exists in database
- Token belongs to User A

#### Description
Test that a user cannot access another user's profile.

#### Request Headers
```
Authorization: Bearer <Token for User A>
```

#### Input Data
- **URL Path:** `/api/users/222e2222-e22b-22d4-a222-222255220000` (User B ID)
- **Method:** GET

#### Expected Output
**Status Code:** `403 Forbidden`

```json
{
  "detail": "Not authorized to view this user"
}
```

#### Pass Criteria
- ✅ Response status code is 403 Forbidden
- ✅ User B's profile data is NOT returned
- ✅ Error message indicates unauthorized access

#### Fail Criteria
- ❌ User B's profile is returned
- ❌ Status code is 200

---

### TC-PROFILE-006: Get Non-existent User Profile

| Field | Value |
|-------|-------|
| **Test Case ID** | TC-PROFILE-006 |
| **Title** | Profile retrieval fails for non-existent user |
| **Endpoint** | `GET /api/users/{user_id}` |
| **Priority** | P2 (High) |
| **Status** | Ready for Testing |

#### Precondition
- Valid token exists
- User ID `999e9999-e99b-99d4-a999-999955990000` does NOT exist in database

#### Description
Test that retrieving a non-existent user's profile returns 404.

#### Request Headers
```
Authorization: Bearer <Valid Token>
```

#### Input Data
- **URL Path:** `/api/users/999e9999-e99b-99d4-a999-999955990000`
- **Method:** GET

#### Expected Output
**Status Code:** `404 Not Found`

```json
{
  "detail": "User not found"
}
```

#### Pass Criteria
- ✅ Response status code is 404 Not Found
- ✅ Error message indicates user not found

#### Fail Criteria
- ❌ Status code is 200
- ❌ Non-existent user data is returned

---

---

## Test Cases - Update User Profile Endpoint

### Endpoint: `PUT /api/users/{user_id}`

---

### TC-UPDATE-001: Successfully Update User Profile

| Field | Value |
|-------|-------|
| **Test Case ID** | TC-UPDATE-001 |
| **Title** | Successfully update user profile with valid data |
| **Endpoint** | `PUT /api/users/{user_id}` |
| **Priority** | P1 (Critical) |
| **Status** | Ready for Testing |

#### Precondition
- User with ID `550e8400-e29b-41d4-a716-446655440000` exists
- Valid JWT token for this user is available

#### Description
Test that a user can successfully update their profile information.

#### Request Headers
```
Authorization: Bearer <Valid Token>
```

#### Input Data
```json
{
  "full_name": "Updated Name",
  "email": "newemail@example.com"
}
```

#### Expected Output
**Status Code:** `200 OK`

```json
{
  "user_id": "550e8400-e29b-41d4-a716-446655440000",
  "email": "newemail@example.com",
  "full_name": "Updated Name",
  "created_at": "2026-04-19T08:00:00.000000",
  "updated_at": "2026-04-19T11:00:00.000000"
}
```

#### Pass Criteria
- ✅ Response status code is 200 OK
- ✅ full_name is updated to "Updated Name"
- ✅ email is updated to "newemail@example.com"
- ✅ user_id and created_at remain unchanged
- ✅ updated_at timestamp is newer than before
- ✅ Changes are persisted in database

#### Fail Criteria
- ❌ Status code is not 200
- ❌ Changes are not persisted
- ❌ user_id or created_at changed

---

### TC-UPDATE-002: Partial Profile Update (Only Full Name)

| Field | Value |
|-------|-------|
| **Test Case ID** | TC-UPDATE-002 |
| **Title** | Update only full name, email remains unchanged |
| **Endpoint** | `PUT /api/users/{user_id}` |
| **Priority** | P1 (Critical) |
| **Status** | Ready for Testing |

#### Precondition
- User with email `testuser@example.com` exists

#### Description
Test that user can update only specific fields (partial update).

#### Request Headers
```
Authorization: Bearer <Valid Token>
```

#### Input Data
```json
{
  "full_name": "Updated Name Only"
}
```

#### Expected Output
**Status Code:** `200 OK`

```json
{
  "user_id": "550e8400-e29b-41d4-a716-446655440000",
  "email": "testuser@example.com",
  "full_name": "Updated Name Only",
  "created_at": "2026-04-19T08:00:00.000000",
  "updated_at": "2026-04-19T11:00:00.000000"
}
```

#### Pass Criteria
- ✅ Response status code is 200 OK
- ✅ full_name is updated
- ✅ email remains unchanged
- ✅ Other fields remain unchanged

#### Fail Criteria
- ❌ email changed when not provided
- ❌ Status code is not 200

---

### TC-UPDATE-003: Update with Invalid Email Format

| Field | Value |
|-------|-------|
| **Test Case ID** | TC-UPDATE-003 |
| **Title** | Update fails with invalid email format |
| **Endpoint** | `PUT /api/users/{user_id}` |
| **Priority** | P2 (High) |
| **Status** | Ready for Testing |

#### Description
Test that profile update fails with invalid email format.

#### Request Headers
```
Authorization: Bearer <Valid Token>
```

#### Input Data
```json
{
  "email": "invalid-email-format"
}
```

#### Expected Output
**Status Code:** `422 Unprocessable Entity`

#### Pass Criteria
- ✅ Response status code is 422
- ✅ Email is NOT updated
- ✅ Error indicates invalid email format

#### Fail Criteria
- ❌ Status code is 200
- ❌ Invalid email is saved

---

### TC-UPDATE-004: Update Without Authentication

| Field | Value |
|-------|-------|
| **Test Case ID** | TC-UPDATE-004 |
| **Title** | Profile update fails without authentication |
| **Endpoint** | `PUT /api/users/{user_id}` |
| **Priority** | P1 (Critical) |
| **Status** | Ready for Testing |

#### Description
Test that profile update fails without valid authentication token.

#### Request Headers
(No Authorization header)

#### Input Data
```json
{
  "full_name": "Updated Name"
}
```

#### Expected Output
**Status Code:** `403 Forbidden` or `401 Unauthorized`

#### Pass Criteria
- ✅ Response status code is 403 or 401
- ✅ Profile is NOT updated
- ✅ Error indicates authentication required

#### Fail Criteria
- ❌ Profile is updated without token
- ❌ Status code is 200

---

### TC-UPDATE-005: Update Another User's Profile

| Field | Value |
|-------|-------|
| **Test Case ID** | TC-UPDATE-005 |
| **Title** | User cannot update another user's profile |
| **Endpoint** | `PUT /api/users/{user_id}` |
| **Priority** | P1 (Critical) |
| **Status** | Ready for Testing |

#### Precondition
- User A token is available
- User B ID is `222e2222-e22b-22d4-a222-222255220000`
- Token belongs to User A

#### Description
Test that a user cannot update another user's profile.

#### Request Headers
```
Authorization: Bearer <Token for User A>
```

#### Input Data
- **URL Path:** `/api/users/222e2222-e22b-22d4-a222-222255220000` (User B ID)
- **Request Body:**
```json
{
  "full_name": "Hacked Name"
}
```

#### Expected Output
**Status Code:** `403 Forbidden`

```json
{
  "detail": "Not authorized to update this user"
}
```

#### Pass Criteria
- ✅ Response status code is 403 Forbidden
- ✅ User B's profile is NOT updated
- ✅ Error message indicates unauthorized

#### Fail Criteria
- ❌ User B's profile is updated
- ❌ Status code is 200

---

### TC-UPDATE-006: Updated_at Timestamp Changes

| Field | Value |
|-------|-------|
| **Test Case ID** | TC-UPDATE-006 |
| **Title** | updated_at timestamp is automatically updated on profile change |
| **Endpoint** | `PUT /api/users/{user_id}` |
| **Priority** | P2 (High) |
| **Status** | Ready for Testing |

#### Description
Test that updated_at timestamp is automatically updated when profile is modified.

#### Request Headers
```
Authorization: Bearer <Valid Token>
```

#### Input Data
```json
{
  "full_name": "New Name"
}
```

#### Expected Output
**Status Code:** `200 OK`  
**Response contains:**
- `updated_at` timestamp is newer than previous timestamp
- `created_at` remains unchanged

#### Pass Criteria
- ✅ updated_at is automatically set to current time
- ✅ updated_at > previous created_at/updated_at
- ✅ created_at remains the same

#### Fail Criteria
- ❌ updated_at is not updated
- ❌ created_at is modified

---

---

## Test Cases - Logout Endpoint

### Endpoint: `POST /api/auth/logout`

---

### TC-LOGOUT-001: Successful Logout with Valid Token

| Field | Value |
|-------|-------|
| **Test Case ID** | TC-LOGOUT-001 |
| **Title** | Successfully logout authenticated user |
| **Endpoint** | `POST /api/auth/logout` |
| **Priority** | P2 (High) |
| **Status** | Ready for Testing |

#### Precondition
- User has valid, non-expired JWT token

#### Description
Test that an authenticated user can logout successfully.

#### Request Headers
```
Authorization: Bearer <Valid Token>
```

#### Input Data
- **Method:** POST
- **Body:** Empty or {}

#### Expected Output
**Status Code:** `200 OK`

```json
{
  "message": "Successfully logged out"
}
```

#### Pass Criteria
- ✅ Response status code is 200 OK
- ✅ Response contains message "Successfully logged out"
- ✅ Client removes token from localStorage (frontend responsibility)
- ✅ Subsequent requests with same token are rejected (token not blacklisted on server)

#### Fail Criteria
- ❌ Status code is not 200
- ❌ Logout message is different

---

### TC-LOGOUT-002: Logout Without Authentication

| Field | Value |
|-------|-------|
| **Test Case ID** | TC-LOGOUT-002 |
| **Title** | Logout fails without authentication |
| **Endpoint** | `POST /api/auth/logout` |
| **Priority** | P2 (High) |
| **Status** | Ready for Testing |

#### Description
Test that logout fails when user is not authenticated.

#### Request Headers
(No Authorization header)

#### Input Data
- **Method:** POST

#### Expected Output
**Status Code:** `403 Forbidden` or `401 Unauthorized`

```json
{
  "detail": "Not authenticated" or "Could not validate credentials"
}
```

#### Pass Criteria
- ✅ Response status code is 403 or 401
- ✅ Error indicates authentication required

#### Fail Criteria
- ❌ Logout succeeds without token
- ❌ Status code is 200

---

### TC-LOGOUT-003: Logout with Invalid Token

| Field | Value |
|-------|-------|
| **Test Case ID** | TC-LOGOUT-003 |
| **Title** | Logout fails with invalid token |
| **Endpoint** | `POST /api/auth/logout` |
| **Priority** | P2 (High) |
| **Status** | Ready for Testing |

#### Description
Test that logout fails when token is invalid.

#### Request Headers
```
Authorization: Bearer invalid.token
```

#### Input Data
- **Method:** POST

#### Expected Output
**Status Code:** `401 Unauthorized`

```json
{
  "detail": "Could not validate credentials"
}
```

#### Pass Criteria
- ✅ Response status code is 401
- ✅ Invalid token is rejected

#### Fail Criteria
- ❌ Status code is 200
- ❌ Logout succeeds with invalid token

---

### TC-LOGOUT-004: Logout with Expired Token

| Field | Value |
|-------|-------|
| **Test Case ID** | TC-LOGOUT-004 |
| **Title** | Logout fails with expired token |
| **Endpoint** | `POST /api/auth/logout` |
| **Priority** | P2 (High) |
| **Status** | Ready for Testing |

#### Description
Test that logout fails when token is expired.

#### Request Headers
```
Authorization: Bearer <Expired Token>
```

#### Input Data
- **Method:** POST

#### Expected Output
**Status Code:** `401 Unauthorized`

```json
{
  "detail": "Could not validate credentials"
}
```

#### Pass Criteria
- ✅ Response status code is 401
- ✅ Expired token is rejected

#### Fail Criteria
- ❌ Status code is 200

---

---

## Test Execution Summary

### Quick Reference - Test Case Count by Endpoint

| Endpoint | Test Cases | Coverage |
|----------|-----------|----------|
| POST /api/auth/register | TC-REG-001 to TC-REG-005 | 5 cases |
| POST /api/auth/login | TC-LOGIN-001 to TC-LOGIN-006 | 6 cases |
| GET /api/users/{user_id} | TC-PROFILE-001 to TC-PROFILE-006 | 6 cases |
| PUT /api/users/{user_id} | TC-UPDATE-001 to TC-UPDATE-006 | 6 cases |
| POST /api/auth/logout | TC-LOGOUT-001 to TC-LOGOUT-004 | 4 cases |
| **TOTAL** | | **27 Test Cases** |

### Test Execution Checklist

#### Setup Phase
- [ ] Database initialized with test data
- [ ] API server running on http://localhost:8000
- [ ] Test environment configured
- [ ] Test data cleaned between test runs

#### Execution Phase
- [ ] All 27 test cases executed
- [ ] Results recorded
- [ ] Failed tests documented
- [ ] Screenshots/logs captured for failures

#### Validation Phase
- [ ] All critical (P1) tests passed
- [ ] High (P2) tests reviewed
- [ ] Coverage analysis completed
- [ ] Test report generated

### Test Report Template

```
Test Execution Report
====================
Execution Date: [Date]
Total Tests: 27
Passed: __/27
Failed: __/27
Success Rate: ___%

Failed Tests:
- [Test ID]: [Reason]

Notes:
[Additional observations]
```

---

**Document Version:** 1.0  
**Last Updated:** April 19, 2026  
**Author:** QA Team  
**Status:** Ready for Testing
