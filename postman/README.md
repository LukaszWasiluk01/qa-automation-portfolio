# Postman API Tests

This directory contains Postman collections and environments for testing the Issue Tracker REST API.

## Setup

1. Import the collection `IssueTracker.postman_collection.json` into your Postman workspace.
2. Import the environment `local.postman_environment.json`.
3. Ensure the ASP.NET Core backend API is running locally on `http://localhost:5141`.
4. Select the `local` environment in Postman.
5. Run the collection manually or via Postman Collection Runner. The scripts include automatic JWT token extraction and assignment to subsequent requests.