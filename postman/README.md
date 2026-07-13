# Postman API Tests

This folder contains the Postman collection and environment files used to test the backend API of the Issue Tracker application.

## How to use:
1. Import `IssueTracker.postman_collection.json` into Postman.
2. Import `local.postman_environment.json` into Postman.
3. Make sure the local ASP.NET Core API is running on `http://localhost:5000`.
4. Run the `Login User` request first. The test script will automatically extract the JWT token and save it to the environment variables.
5. All subsequent requests (GET, POST, PATCH, DELETE) will use this token for authorization.