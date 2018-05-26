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
    if (Object.keys(cuisineDetails).length === 0) {
      const error = {
        code: "NotFound",
        message: "No cuisine Found wityh the name " + event.cuisineName
      };
      throw new Error(JSON.stringify(error));
    } else {
      return cuisineDetails.Item;
    }
  } catch (error) {
    throw new Error(error);
  }
};
