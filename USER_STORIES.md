# User Stories & Acceptance Criteria
## User Authentication & Profile Management System

---

## 1. USER REGISTRATION

### US-101: User Registration with Email Validation
**As a** new user  
**I want to** create an account with my email and password  
**So that** I can access the application securely

**Acceptance Criteria:**
- [ ] User can navigate to the registration page
- [ ] User can enter full name (required field)
- [ ] User can enter email address with validation (must be valid email format)
- [ ] User can enter password (required field, minimum security requirements)
- [ ] User can click "Register" button to submit the form
- [ ] System validates that the full name, email, and password are provided
- [ ] System validates email format before submission
- [ ] If email already exists, system shows error: "Email already registered"
- [ ] If registration is successful, user is redirected to login page
- [ ] Success message appears with redirect instructions (implicitly via navigation)
- [ ] Password is securely hashed using bcrypt before storage
- [ ] User account is created in the database with unique user ID
- [ ] Loading state appears while registration is processing
- [ ] Error messages are clearly displayed if registration fails

**Technical Notes:**
- Email validation is handled by Pydantic's `EmailStr`
- Password is hashed with bcrypt (72-byte limit enforced)
- Each user gets a unique UUID4 identifier
- User creation timestamp is recorded


### US-102: Duplicate Email Prevention
**As a** system administrator  
**I want to** prevent users from registering with duplicate emails  
**So that** each user account is unique and identifiable

**Acceptance Criteria:**
- [ ] System checks if email exists before creating new account
- [ ] If email is already registered, API returns 400 error with message "Email already registered"
- [ ] Frontend displays error message to user on registration
- [ ] User can attempt registration again with different email
- [ ] No duplicate emails exist in the database

**Technical Notes:**
- Duplicate check occurs in `database.create_user()` method
- HTTP 400 Bad Request status code returned
- Check is case-sensitive (room for enhancement to make case-insensitive)

---

## 2. USER LOGIN & AUTHENTICATION

### US-201: User Login with JWT Token
**As a** registered user  
**I want to** login with my email and password  
**So that** I can access my profile and use protected features

**Acceptance Criteria:**
- [ ] User can navigate to the login page
- [ ] User can enter email address
- [ ] User can enter password
- [ ] User can click "Login" button to submit credentials
- [ ] System validates email and password credentials
- [ ] If credentials are invalid, system shows error: "Invalid email or password"
- [ ] If credentials are valid, system generates a JWT access token
- [ ] JWT token is returned to frontend with user_id and token_type
- [ ] Token is automatically stored in browser localStorage
- [ ] user_id is stored in localStorage for session management
- [ ] User is redirected to profile page after successful login
- [ ] Loading state appears while login is processing
- [ ] Session remains active for 30 minutes (configurable)

**Technical Notes:**
- JWT tokens include email in the `sub` (subject) claim
- Tokens are signed with HS256 algorithm
- Token expiration is set to 30 minutes (ACCESS_TOKEN_EXPIRE_MINUTES)
- Password verification uses bcrypt comparison
- Login endpoint at `POST /api/auth/login`


### US-202: Password Security
**As a** system administrator  
**I want to** ensure passwords are securely stored and verified  
**So that** user accounts are protected from unauthorized access

**Acceptance Criteria:**
- [ ] Passwords are never stored in plain text
- [ ] Passwords are hashed using bcrypt with salt
- [ ] Password verification uses secure bcrypt comparison
- [ ] Hashed passwords cannot be reversed or decrypted
- [ ] Long passwords (>72 bytes) are handled safely
- [ ] Incorrect passwords always return "Invalid email or password" error (no user enumeration)
- [ ] Password is validated on both registration and login

**Technical Notes:**
- Bcrypt salt is automatically generated with `bcrypt.gensalt()`
- 72-byte password limit enforced by bcrypt standard
- Passwords are truncated to 72 bytes before hashing


### US-203: Invalid Login Credentials Handling
**As a** user  
**I want to** get clear feedback when I enter wrong credentials  
**So that** I know my login attempt failed

**Acceptance Criteria:**
- [ ] Invalid email returns error message
- [ ] Wrong password returns error message
- [ ] Non-existent user returns error message
- [ ] Error message is generic: "Invalid email or password" (prevents user enumeration)
- [ ] User remains on login page to retry
- [ ] Clear error message is displayed in red/error styling
- [ ] User can retry login without page refresh

---

## 3. SESSION MANAGEMENT

### US-301: Token Storage and Session Persistence
**As a** user  
**I want to** remain logged in while browsing the application  
**So that** I don't have to login repeatedly for each page

**Acceptance Criteria:**
- [ ] JWT token is stored in browser localStorage after login
- [ ] user_id is stored in browser localStorage after login
- [ ] Token persists across page refreshes
- [ ] User session remains active for 30 minutes
- [ ] Token can be retrieved from localStorage when needed
- [ ] Token is included in API requests for protected endpoints
- [ ] Token is sent in Authorization header as "Bearer {token}"

**Technical Notes:**
- localStorage keys: `token` and `user_id`
- Token used in Authorization header for all authenticated API calls
- No server-side session storage required


### US-302: Logout Functionality
**As a** user  
**I want to** logout from the application  
**So that** I can end my session and protect my account

**Acceptance Criteria:**
- [ ] User can click "Logout" button on profile page
- [ ] User can click "Logout" button on home page (if logged in)
- [ ] Logout removes token from localStorage
- [ ] Logout removes user_id from localStorage
- [ ] User is redirected to login page after logout
- [ ] User session is terminated
- [ ] Subsequent API calls without token are rejected
- [ ] Browser back button doesn't allow access to protected pages after logout

**Technical Notes:**
- `authService.logout()` removes both token and user_id from localStorage
- Frontend logout endpoint at `POST /api/auth/logout` (primarily for client-side cleanup)
- Protected routes verify token existence before rendering


### US-303: Session Expiration
**As a** system administrator  
**I want to** automatically expire user sessions after inactivity  
**So that** inactive accounts are not vulnerable to unauthorized access

**Acceptance Criteria:**
- [ ] JWT tokens expire after 30 minutes
- [ ] Expired tokens are rejected by the API
- [ ] User is redirected to login when token expires
- [ ] User receives message indicating session expired (future enhancement)
- [ ] Token expiration time is included in JWT payload
- [ ] No refresh token mechanism for extended sessions (design decision)

**Technical Notes:**
- Token includes `exp` claim with expiration timestamp
- Server validates exp claim during JWT decode
- Current implementation is 30 minutes (hardcoded in config)

---

## 4. USER PROFILE MANAGEMENT

### US-401: View User Profile
**As a** logged-in user  
**I want to** view my profile information  
**So that** I can see what information is stored about me

**Acceptance Criteria:**
- [ ] User can navigate to profile page (protected route)
- [ ] Profile page displays full name
- [ ] Profile page displays email address
- [ ] Profile page displays account creation date
- [ ] Profile page displays last update date
- [ ] User ID is associated with profile retrieval
- [ ] Only authenticated users can access profile page
- [ ] User can only view their own profile (not other users')
- [ ] Loading state appears while profile data is fetched
- [ ] Error message displays if profile cannot be loaded

**Technical Notes:**
- Protected by `PrivateRoute` component that checks localStorage token
- Profile data fetched via `GET /api/users/{user_id}`
- Backend verifies current_user.user_id matches requested user_id
- Returns 403 Forbidden if user tries to view another user's profile


### US-402: Edit User Profile
**As a** logged-in user  
**I want to** update my profile information  
**So that** I can keep my account details current

**Acceptance Criteria:**
- [ ] User can click "Edit Profile" button
- [ ] Form enters edit mode with current values pre-filled
- [ ] User can edit full name field (optional in request)
- [ ] User can edit email field (optional in request)
- [ ] User can click "Save" to submit changes
- [ ] System validates email format before saving
- [ ] System validates that email is not already in use by another user (future enhancement)
- [ ] Updated information is saved to database
- [ ] Success message displays after update
- [ ] Profile view updates with new information
- [ ] User can click "Cancel" to discard changes
- [ ] Loading state appears while update is processing
- [ ] Error messages display if update fails
- [ ] Only the current user can edit their own profile

**Technical Notes:**
- Edit endpoint: `PUT /api/users/{user_id}`
- Authorization check ensures user can only update own profile
- Updated_at timestamp is automatically updated
- Optional fields allow partial updates


### US-403: User Data Persistence
**As a** system administrator  
**I want to** persist all user data reliably  
**So that** user information is never lost

**Acceptance Criteria:**
- [ ] User data is stored in database after registration
- [ ] User data persists after page refreshes
- [ ] User data persists across logout/login cycles
- [ ] Profile updates are immediately saved
- [ ] Database file is updated with new/modified user information
- [ ] All user fields are stored: user_id, email, full_name, hashed_password, created_at, updated_at
- [ ] Data is stored in valid JSON format

**Technical Notes:**
- JSON file database at `../data/users.json`
- Uses file-based locking and atomic writes
- Database initializes automatically if file is missing

---

## 5. PROTECTED ROUTES & ACCESS CONTROL

### US-501: Protected Route Access
**As a** system administrator  
**I want to** restrict access to protected pages without authentication  
**So that** unauthenticated users cannot access private user data

**Acceptance Criteria:**
- [ ] Profile page is protected by authentication
- [ ] Unauthenticated users cannot access profile page
- [ ] Unauthenticated users are redirected to login page
- [ ] Direct URL navigation to `/profile` redirects to login if not authenticated
- [ ] Browser back button respects authentication state
- [ ] Each protected endpoint requires valid JWT token
- [ ] API returns 401 Unauthorized if token is missing
- [ ] API returns 401 Unauthorized if token is invalid
- [ ] API returns 401 Unauthorized if token is expired

**Technical Notes:**
- `PrivateRoute` component checks for token in localStorage
- `get_current_user()` dependency validates JWT on backend
- Returns 401 with WWW-Authenticate header for failed auth


### US-502: User Authorization
**As a** system administrator  
**I want to** ensure users can only access their own data  
**So that** user privacy is maintained and data remains confidential

**Acceptance Criteria:**
- [ ] User can only view their own profile
- [ ] User can only edit their own profile
- [ ] User A cannot access User B's profile data
- [ ] API returns 403 Forbidden if user accesses another user's data
- [ ] Error message indicates "Not authorized to view this user"
- [ ] Current user ID is verified against requested resource
- [ ] No user enumeration occurs (error message doesn't reveal existence of user)

**Technical Notes:**
- Authorization check: `if current_user.user_id != user_id: raise HTTPException(403)`
- Implemented in both GET and PUT endpoints for user data
- Uses JWT's decoded email to fetch current user

---

## 6. API ENDPOINTS & INTEGRATION

### US-601: User Registration API Endpoint
**As a** frontend developer  
**I want to** have a registration API endpoint  
**So that** users can create new accounts

**Acceptance Criteria:**
- [ ] Endpoint: `POST /api/auth/register`
- [ ] Accepts JSON: `{email, password, full_name}`
- [ ] Returns 201 Created on success
- [ ] Returns User object with user_id, email, full_name, created_at, updated_at
- [ ] Returns 400 Bad Request if email is already registered
- [ ] Returns 400 Bad Request if validation fails
- [ ] Password field is NOT returned in response
- [ ] Email is validated with EmailStr validator

**Technical Notes:**
- Request model: `UserCreate`
- Response model: `User` (excludes hashed_password)
- Status code: 201 Created


### US-602: User Login API Endpoint
**As a** frontend developer  
**I want to** have a login API endpoint  
**So that** users can authenticate and receive tokens

**Acceptance Criteria:**
- [ ] Endpoint: `POST /api/auth/login`
- [ ] Accepts JSON: `{email, password}`
- [ ] Returns Token object with access_token, token_type, user_id
- [ ] Token type is "bearer"
- [ ] Returns 401 Unauthorized if credentials are invalid
- [ ] Token is valid JWT that can be decoded

**Technical Notes:**
- Request model: `LoginRequest`
- Response model: `Token`
- Status code: 200 OK


### US-603: User Profile Retrieval API Endpoint
**As a** frontend developer  
**I want to** have an API endpoint to fetch user profile  
**So that** I can display user information on the frontend

**Acceptance Criteria:**
- [ ] Endpoint: `GET /api/users/{user_id}`
- [ ] Requires authentication (Bearer token in header)
- [ ] Returns User object on success
- [ ] Returns 401 Unauthorized if no valid token
- [ ] Returns 403 Forbidden if user tries to access another user's profile
- [ ] Returns 404 Not Found if user doesn't exist
- [ ] Response includes: user_id, email, full_name, created_at, updated_at

**Technical Notes:**
- Protected by `get_current_user` dependency
- Status codes: 200, 401, 403, 404


### US-604: User Profile Update API Endpoint
**As a** frontend developer  
**I want to** have an API endpoint to update user profile  
**So that** users can modify their account information

**Acceptance Criteria:**
- [ ] Endpoint: `PUT /api/users/{user_id}`
- [ ] Requires authentication (Bearer token in header)
- [ ] Accepts JSON with optional fields: `{full_name, email}` (both optional)
- [ ] Returns updated User object on success
- [ ] Returns 401 Unauthorized if no valid token
- [ ] Returns 403 Forbidden if user tries to update another user's profile
- [ ] Returns 404 Not Found if user doesn't exist
- [ ] Updates only provided fields (patching)
- [ ] Updates modified_at timestamp automatically

**Technical Notes:**
- Request model: `UserUpdate`
- Response model: `User`
- Status code: 200 OK


### US-605: User Logout API Endpoint
**As a** frontend developer  
**I want to** have a logout endpoint  
**So that** users can terminate their session (client-side cleanup support)

**Acceptance Criteria:**
- [ ] Endpoint: `POST /api/auth/logout`
- [ ] Requires authentication
- [ ] Returns success message: "Successfully logged out"
- [ ] Frontend removes token and user_id from localStorage
- [ ] User is redirected to login page

**Technical Notes:**
- Endpoint is primarily decorative - actual logout is client-side
- Future enhancement: Token blacklist/revocation on server


### US-606: API Error Handling
**As a** frontend developer  
**I want to** receive clear error messages from the API  
**So that** I can properly handle and display errors

**Acceptance Criteria:**
- [ ] All error responses include detail message
- [ ] Error detail explains the problem clearly
- [ ] Appropriate HTTP status codes are returned
- [ ] No sensitive information is exposed in errors
- [ ] Error responses are in consistent JSON format
- [ ] 400 Bad Request for validation errors
- [ ] 401 Unauthorized for authentication failures
- [ ] 403 Forbidden for authorization failures
- [ ] 404 Not Found for missing resources
- [ ] 500 Internal Server Error for server issues

---

## 7. USER INTERFACE

### US-701: Home Page
**As a** visitor  
**I want to** see a home page with authentication options  
**So that** I understand what the application is about

**Acceptance Criteria:**
- [ ] Home page displays application title ("Authentication App")
- [ ] Home page displays application description
- [ ] Unauthenticated users see "Login" and "Register" buttons
- [ ] Authenticated users see "Go to Profile" and "Logout" buttons
- [ ] Buttons navigate to correct pages
- [ ] Home page is responsive and visually appealing
- [ ] Page has clear call-to-action elements

**Technical Notes:**
- Route: `/`
- Checks `authService.getCurrentUser()` to determine state
- Conditional rendering of buttons based on authentication


### US-702: Registration Page
**As a** new user  
**I want to** see a registration form with fields  
**So that** I can create a new account

**Acceptance Criteria:**
- [ ] Form displays "Create Account" heading
- [ ] Form has "Full Name" input field
- [ ] Form has "Email" input field with email validation
- [ ] Form has "Password" input field (masked/hidden)
- [ ] Form has "Register" button
- [ ] Form displays error messages clearly
- [ ] Loading state shows "Creating..." during submission
- [ ] Link to login page: "Already have an account? Login"
- [ ] Form is responsive and user-friendly

**Technical Notes:**
- Route: `/register`
- HTML5 email input type provides client-side validation
- Password input type masks characters


### US-703: Login Page
**As a** registered user  
**I want to** see a login form  
**So that** I can authenticate to access my profile

**Acceptance Criteria:**
- [ ] Form displays "Welcome Back" heading
- [ ] Form has "Email" input field
- [ ] Form has "Password" input field (masked/hidden)
- [ ] Form has "Login" button
- [ ] Form displays error messages clearly
- [ ] Loading state shows "Logging in..." during submission
- [ ] Link to registration page: "Don't have an account? Register"
- [ ] Form is responsive and user-friendly

**Technical Notes:**
- Route: `/login`
- HTML5 email input type provides client-side validation
- Password input type masks characters


### US-704: Profile Page
**As a** logged-in user  
**I want to** see my profile with view and edit modes  
**So that** I can view and modify my account information

**Acceptance Criteria:**
- [ ] Profile page displays "User Profile" heading
- [ ] View mode shows: Full Name, Email
- [ ] View mode displays all user information read-only
- [ ] View mode has "Edit Profile" button
- [ ] View mode has "Logout" button
- [ ] Edit mode shows form fields pre-populated with current data
- [ ] Edit mode has "Save" button
- [ ] Edit mode has "Cancel" button
- [ ] Clicking "Edit Profile" switches to edit mode
- [ ] Clicking "Save" submits changes and returns to view mode
- [ ] Clicking "Cancel" discards changes and returns to view mode
- [ ] Success message appears after successful update
- [ ] Error message displays if update fails
- [ ] Page shows loading state while fetching user data
- [ ] Page is protected (only accessible when logged in)

**Technical Notes:**
- Route: `/profile` (protected)
- Uses `editMode` state to toggle between view/edit
- Fetches user data on component mount via `useEffect`


### US-705: Navigation and Routing
**As a** user  
**I want to** easily navigate between pages  
**So that** I can access different features of the application

**Acceptance Criteria:**
- [ ] Home page is accessible at `/`
- [ ] Registration page is accessible at `/register`
- [ ] Login page is accessible at `/login`
- [ ] Profile page is accessible at `/profile`
- [ ] Invalid routes redirect to home page (/)
- [ ] Navigation maintains application state
- [ ] Browser back/forward buttons work correctly
- [ ] Page titles/headings are clear and descriptive

**Technical Notes:**
- React Router v6 with BrowserRouter
- PrivateRoute wrapper for protected pages
- Navigate component redirects invalid routes to home


### US-706: Frontend Error Handling
**As a** user  
**I want to** see clear error messages when something goes wrong  
**So that** I understand what happened and how to fix it

**Acceptance Criteria:**
- [ ] Error messages are displayed in error styling (red/visible)
- [ ] Error messages are clear and user-friendly
- [ ] Error messages don't expose sensitive information
- [ ] Error messages disappear after successful action
- [ ] Success messages are displayed in success styling (green/visible)
- [ ] Success messages auto-dismiss after 3 seconds
- [ ] Loading states indicate processing is occurring
- [ ] Disabled button state prevents duplicate submissions

---

## 8. CROSS-CUTTING CONCERNS

### US-801: CORS Support
**As a** a developer  
**I want to** ensure CORS is properly configured  
**So that** the frontend can communicate with the backend

**Acceptance Criteria:**
- [ ] CORS middleware is enabled on FastAPI
- [ ] Frontend origin (http://localhost:3000) is allowed
- [ ] Backend origin (http://localhost:8000) is allowed
- [ ] 127.0.0.1 origins are allowed for localhost testing
- [ ] Credentials are allowed in CORS requests
- [ ] All HTTP methods are allowed
- [ ] All headers are allowed
- [ ] No CORS errors in browser console

**Technical Notes:**
- Configured in `main.py` with CORSMiddleware
- Allowed origins list in `config.py`
- Credentials enabled for token transmission


### US-802: API Documentation
**As a** a developer  
**I want to** have interactive API documentation  
**So that** I can understand and test the API

**Acceptance Criteria:**
- [ ] Swagger UI is available at `/docs`
- [ ] ReDoc is available at `/redoc`
- [ ] All endpoints are documented
- [ ] Request/response models are documented
- [ ] Error responses are documented
- [ ] Required authentication is indicated
- [ ] Try-it-out functionality works (for testing)

**Technical Notes:**
- FastAPI automatically generates Swagger and ReDoc from code
- Title, description, version in FastAPI initialization
- Pydantic models automatically included in documentation


### US-803: Security Headers
**As a** a security administrator  
**I want to** ensure appropriate security headers are set  
**So that** the application is protected from common attacks

**Acceptance Criteria:**
- [ ] JWT tokens use HS256 algorithm (not RS256 in this implementation)
- [ ] Secret key is stored securely (environment variable in production)
- [ ] Passwords are never logged or exposed
- [ ] HTTPS should be used in production (future enhancement)
- [ ] Token expiration is enforced (30 minutes)
- [ ] No user enumeration in error messages

**Technical Notes:**
- Current config has hardcoded SECRET_KEY (should be environment variable)
- HTTPS not enforced in development environment
- Future enhancement: Add security headers middleware


### US-804: Data Validation
**As a** a system administrator  
**I want to** validate all user inputs  
**So that** the system maintains data integrity

**Acceptance Criteria:**
- [ ] Email format is validated (must be valid email)
- [ ] Required fields are validated (not empty)
- [ ] Email uniqueness is enforced
- [ ] Password is required and non-empty
- [ ] Full name is required and non-empty
- [ ] Invalid inputs return clear validation error messages
- [ ] No SQL injection possible (JSON database, not SQL)
- [ ] Input sanitization prevents XSS attacks

**Technical Notes:**
- Pydantic models handle validation
- EmailStr from pydantic validates email format
- Frontend also validates before submission (defense in depth)

---

## 9. PERFORMANCE & SCALABILITY

### US-901: Database Performance
**As a** a system administrator  
**I want to** ensure the database performs efficiently  
**So that** the application remains responsive

**Acceptance Criteria:**
- [ ] User lookup by email is efficient
- [ ] User lookup by ID is efficient
- [ ] User creation completes quickly
- [ ] Profile updates complete quickly
- [ ] All users query completes in acceptable time
- [ ] Database operations don't timeout
- [ ] No N+1 query problems

**Technical Notes:**
- JSON file database has O(n) lookups (room for optimization with indexes)
- Future enhancement: Use SQL database like PostgreSQL
- Current implementation suitable for <10,000 users


### US-902: Token Management
**As a** a researcher  
**I want to** understand token lifecycle  
**So that** I can optimize session management

**Acceptance Criteria:**
- [ ] Tokens are generated quickly
- [ ] Token validation is fast
- [ ] Token includes necessary claims (email, exp)
- [ ] Token size is reasonable
- [ ] Expired tokens are rejected
- [ ] Invalid tokens are rejected
- [ ] Token refresh not supported (stateless design)

**Technical Notes:**
- JWT tokens are stateless (no server-side storage)
- Single 30-minute expiration window (no refresh tokens)

---

## 10. FUTURE ENHANCEMENTS (Out of Current Scope)

### Potential Features:
- [ ] Password reset functionality
- [ ] Email verification on registration
- [ ] Two-factor authentication (2FA)
- [ ] Password change endpoint
- [ ] User role and permission system (admin, user, etc.)
- [ ] Audit logging of authentication events
- [ ] Rate limiting on auth endpoints
- [ ] Account lockout after failed login attempts
- [ ] OAuth2 integration (Google, GitHub login)
- [ ] Profile picture upload
- [ ] User search and discovery
- [ ] Account deletion/data removal
- [ ] Refresh token mechanism
- [ ] Token blacklist on logout (revocation)
- [ ] Email notifications
- [ ] Activity history/sessions list
- [ ] SQL database backend (PostgreSQL/MySQL)
- [ ] Containerization (Docker)
- [ ] Automated testing (unit, integration, E2E)
- [ ] CI/CD pipeline
- [ ] Monitoring and logging
- [ ] Analytics tracking

---

## Summary Statistics

**Total User Stories:** 30+  
**Total Acceptance Criteria:** 200+  
**API Endpoints:** 5 main endpoints  
**Frontend Pages:** 4 main pages  
**Database Tables:** 1 (users)  
**Authentication Method:** JWT (Bearer tokens)  
**Session Duration:** 30 minutes  
**Password Hashing:** Bcrypt  
**Database Type:** JSON file-based  

---

## Document Information

- **Project:** User Authentication App (FastAPI + React)
- **Generated Date:** April 19, 2026
- **Repository:** https://github.com/coderzhubtest/auth-demo
- **Technology Stack:** FastAPI, React, Pydantic, Bcrypt, JWT, Axios, React Router
