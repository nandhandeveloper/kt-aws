const AWS = require("aws-sdk");
var docClient = new AWS.DynamoDB.DocumentClient();

exports.handler = async event => {
  const currentDate = new Date();
  const cuisineName =  event.params.path.cuisinename;
  const foodName =  event.params.path.foodname;
  const requestFoodDetails = event['body-json'];

  const cusinesparams = {
    TableName: "kt-cuisines",
    Key: {
      name: cuisineName
    }
  };

  const foodparams = {
    TableName: "kt-foods",
    Key: {
      cuisinename: cuisineName,
      foodname: foodName
    }
  };

  const updateFoodParams = {
    TableName: "kt-foods",
    Item: {
      cuisinename: cuisineName,
      foodname: foodName,
      info: {
        price: requestFoodDetails.info.price,
        description: requestFoodDetails.info.description,
        ingredients: requestFoodDetails.info.ingredients,
        calories: requestFoodDetails.info.calories,
        rating: requestFoodDetails.info.rating,
        servingTime: requestFoodDetails.info.servingTime
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
        message: "No Cuisine Exists with the Given Name " + cuisineName
      };
      throw new Error(JSON.stringify(error));
    } else {
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
        updateFoodParams.Item.createdAt = foodDetails.Item.createdAt;
        const updatedFood = await docClient.put(updateFoodParams).promise();
        if (updatedFood) {
          const successMessage = {
            message:
              "SuccessFully updated the food Details of " + foodName
          };
          return successMessage;
        }
      }
    }
  } catch (error) {
    throw new Error(error);
  }
};


// Use below json schema while updating the food Item

// {
//   "info": {
//       "rating": 3,
//       "description": " Flavoured curry with banana chips as a side",
//       "ingredients": [
//           "rice",
//           "curd",
//           "sweet"
//       ],
//       "servingTime": "dinner",
//       "calories": 450,
//       "price": 555
//   }
  
// }