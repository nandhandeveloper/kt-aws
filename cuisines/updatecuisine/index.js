const AWS = require("aws-sdk");
var docClient = new AWS.DynamoDB.DocumentClient();

exports.handler = async event => {
  const params = {
    TableName: "kt-cuisines",
    Key: {
      name: event.cuisineName
    }
  };
  const cuisineParams = {
    TableName: "kt-cuisines",
    Item: {
      name: event.cuisineName,
      info: {
        image: event.info.image,
        foodItems: event.info.foodItems,
        description: event.info.description
      },
      createdAt: "",
      updatedAt: "" + new Date()
    }
  };

  try {
    const cuisineDetails = await docClient.get(params).promise();
    if (Object.keys(cuisineDetails).length === 0) {
      const error = {
        code: "NotFound", 
        message: "No cuisine Found wityh the name " + event.cuisineName
      };
      throw new Error(JSON.stringify(error));
    } else {
      cuisineParams.Item.createdAt = cuisineDetails.Item.createdAt;

      const updatedCuisine = await docClient.put(cuisineParams).promise();

      if (updatedCuisine) {
        const successMessage = {
          message: "Updated the cuisine " + event.cuisineName
        };

        return successMessage;
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
