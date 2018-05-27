const AWS = require("aws-sdk");
var docClient = new AWS.DynamoDB.DocumentClient();

exports.handler = async event => {
  const currentDate = new Date();

  const cuisineParams = {
    TableName: "kt-cuisines",
    Key: {
      name: event.cuisineName
    }
  };
  const addCuisineParams = {
    TableName: "kt-cuisines",
    Item: {
      name: event.cuisineName,
      info: {
        image: event.info.image,
        foodItems: event.info.foodItems,
        description: event.info.description
      },
      createdAt: "" + currentDate,
      updatedAt: "" + currentDate
    }
  };
  try {
    const cuisineDetails = await docClient.get(cuisineParams).promise();
    if (Object.keys(cuisineDetails).length === 0) {
      const addedCuisine = await docClient.put(addCuisineParams).promise();
      if (addedCuisine) {
          const success = {
              message : 'added Cuisine '+event.cuisineName+' successfully'
          }
        return success;
      }
    } else {
      const error = {
        code: "Found",
        message: "Cuisine already exists with the name " + event.cuisineName
      };
      throw new Error(JSON.stringify(error));
    }
  } catch (error) {
    throw new Error(error);
  }
};


// Use the below Schema to post the Cuisine Details:
// {
//   "info": {
//       "image": "../../assets/regional-poster.jpg",
//       "description": "some cuisine description",
//       "foodItems": 8
//   },
  
//   "cuisineName": "Test2"
  
// }