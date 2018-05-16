const AWS = require("aws-sdk");
var docClient = new AWS.DynamoDB.DocumentClient();

exports.handler = (event, context, callback) => {
  const params = {
    TableName: "kt-cuisines",
    Key: {
      name: event.cuisineName
    }
  };

  docClient.get(params, (err, result) => {
    if (err) {
      callback(err);
    } else {
      if (Object.keys(result).length === 0) {
        const error = {
          code: "NotFound",
          message: "No Cuisine found with the name " + event.cuisineName
        };
        return context.fail(JSON.stringify(error));
      } else {
        const cuisineParams = {
          TableName: "kt-cuisines",
          Item: {
            name: event.cuisineName,
            info: {
              image: event.info.image,
              foodItems: event.info.foodItems,
              description: event.info.description
            },
            createdAt: result.Item.createdAt,
            updatedAt: "" + new Date()
          }
        };

        docClient.put(cuisineParams, (err, updatedResult) => {
          if (err) {
            callback(err);
          } else {
            return callback(null, updatedResult);
          }
        });
      }
    }
  });
};
