Author: Yi Ai

# Cognito Dynamodb Sync tool

This repository contains the source code of lambda functions which are

- Send custom notification to newly confirmed user
- Sync Cognito new user to Dynamodb User table

# Deployment

Run the following command to deploy the function:

`serverless deploy --stage production --region yourRegion`

# Setup Cognito Trigger

Go to Cognito User Pool trigger setting page, Assign the deployed Lambda function to the `Post confirmation` trigger
