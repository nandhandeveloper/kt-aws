const AWS = require("aws-sdk");
const docClient = new AWS.DynamoDB.DocumentClient();

exports.handler = async event => {
  const params = {
    TableName: "kt-cuisines",
    Key: {
      name: event.cuisineName
    }
  };

  try {
    const cuisineDetails = await docClient.get(params).promise();
    console.log(cuisineDetails);
    if (Object.keys(cuisineDetails).length >= 1) {
      const result = await docClient.delete(params).promise();
      if (result) {
        const successMessage = {
          message: "Deleted a cuisine " + event.cuisineName + " successfully"
        };
        return successMessage;
      }
    } else {
      const errorMessage = {
        code: 'NotFound',
        message: "No Cuisine Exists with the name " + event.cuisineName
      };
      throw new Error(JSON.stringify(errorMessage));
    }
  } catch (error) {
    throw new Error(error);
  }
};
