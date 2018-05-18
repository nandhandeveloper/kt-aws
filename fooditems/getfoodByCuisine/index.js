const AWS = require("aws-sdk");
var docClient = new AWS.DynamoDB.DocumentClient();

exports.handler = (event, context, callback) => {
  const cuisineParams = {
    TableName: "kt-cuisines",
    Key: {
      name: event.cuisineName
    }
  };

  docClient.get(cuisineParams, (err, cuisineDetails) => {
    if (err) {
      callback(err);
    } else {
      if (Object.keys(cuisineDetails).length === 0) {
        const error = {
          code: "NotFound",
          message: "No Cuisine Exists with the Given Name " + event.cuisineName
        };
        return context.fail(JSON.stringify(error));
      } else {
        const goodParamsByCuisine = {
          TableName: "kt-foods",
          KeyConditionExpression: "#cn = :cusineName",
          ExpressionAttributeNames: {
            "#cn": "cuisinename"
          },
          ExpressionAttributeValues: {
            ":cusineName": event.cuisineName
          }
        };

        docClient.query(goodParamsByCuisine, (err, foodResult) => {
          if (err) {
            return callback(err);
          } else {
            return callback(null, foodResult);
          }
        });
      }
    }
  });
};
