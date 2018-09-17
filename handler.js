"use strict";
const AWS = require("aws-sdk");
const Promise = require("bluebird");
const moment = require("moment");
const stepfunctions = new AWS.StepFunctions();
const documentClient = new AWS.DynamoDB.DocumentClient();
const cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider({
  apiVersion: "2017-07-05",
  region: process.env.AWS_REGION
});

AWS.config.setPromisesDependency(Promise);

exports.postUserConfirm = (event, context, callback) => {
  if (event.request.userAttributes.email) {
    // sendEmail(
    //   event.request.userAttributes.email,
    //   "Congratulations " + event.userName + ", you have been confirmed: ",
    //   function(status) {}
    // );
  }
  const stateMachineArn = process.env.statemachine_arn;
  const params = {
    input: JSON.stringify(event),
    stateMachineArn
  };

  return stepfunctions
    .startExecution(params)
    .promise()
    .then(() => {
      callback(null, event);
    })
    .catch(error => {
      callback(error.message);
    });
};

module.exports.syncCognitoToDynamodb = (event, context, callback) => {
  const {
    request: {
      userAttributes: { sub: id, name = "", email = "", phone_number = "" }
    }
  } = event;

  const parmItem = {
    id,
    confirmDate: moment().format(),
    name,
    email,
    phone_number
  };

  if (!phone_number) delete parmItem.phone_number;
  if (!email) delete parmItem.email;

  const params = {
    TableName: process.env.userTable,
    Item: parmItem
  };

  documentClient
    .put(params)
    .promise()
    .then(r => {
      return callback(null, event);
    })
    .catch(err => {
      console.log(err);
      return callback(null, err);
    });
};

function sendEmail(to, body, completedCallback) {
  console.log("SEND CUSTOM NOTIFICATION EMAIL");
}
