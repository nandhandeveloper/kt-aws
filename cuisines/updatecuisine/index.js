const AWS = require("aws-sdk");
var docClient = new AWS.DynamoDB.DocumentClient();

exports.handler = async event => {
  
  const cuisineName =  event.params.path.cuisinename;
  const requestedCuisineDetails = event['body-json'];
  
  const params = {
    TableName: "kt-cuisines",
    Key: {
      name: cuisineName
    }
  };
  const cuisineParams = {
    TableName: "kt-cuisines",
    Item: {
      name: cuisineName,
      info: {
        image: requestedCuisineDetails.info.image,
        foodItems: requestedCuisineDetails.info.foodItems,
        description: requestedCuisineDetails.info.description
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
          message: 'Updated the cuisine '+cuisineName
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
