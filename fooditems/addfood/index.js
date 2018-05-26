const AWS = require("aws-sdk");
const docClient = new AWS.DynamoDB.DocumentClient();

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

  const addFoodParams = {
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
        servingTime: event.info.servingTime,
        type: event.info.type
      },
      createdAt: "" + currentDate,
      updatedAt: "" + currentDate
    }
  };

  try {
    const cuisineDetails = await docClient.get(cusinesparams).promise();
    if (Object.keys(cuisineDetails).length === 0) {
      const error = {
        code: "NotFound",
        message: "No cuisine Found with the name " + event.cuisineName
      };
      throw new Error(JSON.stringify(error));
    } else {
      const foodDetails = await docClient.get(foodparams).promise();

      if (Object.keys(foodDetails).length === 0) {
        const addedFoodDetails = await docClient.put(addFoodParams).promise();
        if (addedFoodDetails) {
          const successMessage = {
            message:
              "Successfully added the Food Details of food " + event.foodName
          };

          return successMessage;
        }
      } else {
        const error = {
          code: "Found",
          message:
            "Food already exists with the name " +
            event.foodName +
            " in cuisine " +
            event.cuisineName
        };
        throw new Error(JSON.stringify(error));
      }
    }
  } catch (error) {
    throw new Error(error);
  }
};
