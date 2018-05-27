const AWS = require("aws-sdk");
const docClient = new AWS.DynamoDB.DocumentClient();

exports.handler = async event => {
  const params = {
    TableName: "kt-cuisines"
  };

  try {
    const allCuisines = await docClient.scan(params).promise();
    return allCuisines.Items;
  } catch (error) {
    throw new Error(error);
  }
};
