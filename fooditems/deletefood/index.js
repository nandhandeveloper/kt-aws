const AWS = require("aws-sdk");
const docClient = new AWS.DynamoDB.DocumentClient();

exports.handler = async event => {
  const foodparams = {
    TableName: "kt-foods",
    Key: {
      cuisinename: event.cuisineName,
      foodname: event.foodName
    }
  };
  try {
    const foodDetails = await docClient.get(foodparams).promise();

    if (Object.keys(foodDetails).length === 0) {
      const error = {
        code: "NotFound",
        message:
          "No Food found with the name " +
          event.foodName +
          " in cuisine " +
          event.cuisineName
      };
      throw new Error(JSON.stringify(error));
    } else {
      const deletedFood = await docClient.delete(foodparams).promise();
      if (deletedFood) {
        const successMessage = {
          message:
            "Deleted a Food " +
            event.foodName +
            " of cuisine " +
            event.cuisineName +
            " successfully"
        };
        return successMessage;
      }
    }
  } catch (error) {
    throw new Error(error);
  }
};
