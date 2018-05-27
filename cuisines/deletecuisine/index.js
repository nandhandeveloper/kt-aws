const AWS = require("aws-sdk");
const docClient = new AWS.DynamoDB.DocumentClient();

exports.handler = async event => {
  const cuisineName = event.params.path.cuisinename;

  const params = {
    TableName: "kt-cuisines",
    Key: {
      name: cuisineName
    }
  };

  try {
    const cuisineDetails = await docClient.get(params).promise();

    if (Object.keys(cuisineDetails).length >= 1) {
      const result = await docClient.delete(params).promise();
      if (result) {
        const successMessage = {
          message: "Deleted a cuisine " + cuisineName + " successfully"
        };
        return successMessage;
      }
    } else {
      const errorMessage = {
        code: "NotFound",
        message: "No Cuisine Exists with the name " + cuisineName
      };
      throw new Error(JSON.stringify(errorMessage));
    }
  } catch (error) {
    throw new Error(error);
  }
};
