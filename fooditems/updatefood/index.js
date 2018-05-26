const AWS = require("aws-sdk");
var docClient = new AWS.DynamoDB.DocumentClient();

exports.handler = async event => {
  const currentDate = new Date();

  const cusinesparams = {
    TableName: "kt-cuisines",
    Key: {
      name: event.cuisineName
    }
  };

  const foodparams = {
    TableName: "kt-foods",
    Key: {
      cuisinename: event.cuisineName,
      foodname: event.foodName
    }
  };

  const updateFoodParams = {
    TableName: "kt-foods",
    Item: {
      cuisinename: event.cuisineName,
      foodname: event.foodName,
      info: {
        price: event.info.price,
        description: event.info.description,
        ingredients: event.info.ingredients,
        calories: event.info.calories,
        rating: event.info.rating,
        servingTime: event.info.servingTime
      },
      createdAt: "",
      updatedAt: "" + currentDate
    }
  };

  try {
    const cuisineDetails = await docClient.get(cusinesparams).promise();
    if (Object.keys(cuisineDetails).length === 0) {
      const error = {
        code: "NotFound",
        message: "No Cuisine Exists with the Given Name " + event.cuisineName
      };
      throw new Error(JSON.stringify(error));
    } else {
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
        updateFoodParams.Item.createdAt = foodDetails.Item.createdAt;
        const updatedFood = await docClient.put(updateFoodParams).promise();
        if (updatedFood) {
          const successMessage = {
            message:
              "SuccessFully updated the food Details of " + event.foodName
          };
          return successMessage;
        }
      }
    }
  } catch (error) {
    throw new Error(error);
  }
};
