const AWS = require("aws-sdk");
const docClient = new AWS.DynamoDB.DocumentClient();

exports.handler = async event => {
  const cuisineParams = {
    TableName: "kt-cuisines",
    Key: {
      name: event.cuisineName
    }
  };

  const foodParamsByCuisine = {
    TableName: "kt-foods",
    KeyConditionExpression: "#cn = :cusineName",
    ExpressionAttributeNames: {
      "#cn": "cuisinename"
    },
    ExpressionAttributeValues: {
      ":cusineName": event.cuisineName
    }
  };

  try {
    const cuisineDetails = await docClient.get(cuisineParams).promise();
    if (Object.keys(cuisineDetails).length === 0) {
      const error = {
        code: "NotFound",
        message: "No cuisine Found wityh the name " + event.cuisineName
      };
      throw new Error(JSON.stringify(error));
    } else {
      const foodResult = await docClient.query(foodParamsByCuisine).promise();
      if (foodResult.Items) {
        return foodResult.Items;
      } else {
        const error = {
          code: "InternalError",
          message: "Something went wrong !!!"
        };
        throw new Error(JSON.stringify(error));
      }
    }
  } catch (error) {
    throw new Error(error);
  }
};
