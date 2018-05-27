const AWS = require("aws-sdk");
const docClient = new AWS.DynamoDB.DocumentClient();

exports.handler = async event => {
  const cuisineName = event.params.path.cuisinename;
  const foodName = event.params.path.foodname;

  const foodparams = {
    TableName: "kt-foods",
    Key: {
      cuisinename: cuisineName,
      foodname: foodName
    }
  };
  try {
    const foodDetails = await docClient.get(foodparams).promise();

    if (Object.keys(foodDetails).length === 0) {
      const error = {
        code: "NotFound",
        message:
          "No Food found with the name " +
          foodName +
          " in cuisine " +
          cuisineName
      };
      throw new Error(JSON.stringify(error));
    } else {
      const deletedFood = await docClient.delete(foodparams).promise();
      if (deletedFood) {
        const successMessage = {
          message:
            "Deleted a Food " +
            foodName +
            " of cuisine " +
            cuisineName +
            " successfully"
        };
        return successMessage;
      }
    }
  } catch (error) {
    throw new Error(error);
  }
};
