const AWS = require("aws-sdk");
var docClient = new AWS.DynamoDB.DocumentClient();

exports.handler = (event, context, callback) => {
  const foodparams = {
    TableName: "kt-foods",
    Key: {
      cuisinename: event.cuisineName,
      foodname: event.foodName
    }
  };

  docClient.get(foodparams, (err, foodItem) => {
    if (err) {
      callback(err);
    } else {
      if (Object.keys(foodItem).length === 0) {
        const error = {
          code: "NotFound",
          message:
            "No Food found with the name " +
            event.foodName +
            " in cuisine " +
            event.cuisineName
        };
        return context.fail(JSON.stringify(error));
      } else {
        const params = {
          TableName: "kt-foods",
          Key: {
            cuisinename: event.cuisineName,
            foodname: event.foodName
          }
        };
        docClient.delete(params, (err, result) => {
          if (err) {
            return callback(err);
          } else {
            return callback(null, result);
          }
        });
      }
    }
  });
};
