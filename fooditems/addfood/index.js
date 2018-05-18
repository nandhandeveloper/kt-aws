const AWS = require("aws-sdk");
var docClient = new AWS.DynamoDB.DocumentClient();

exports.handler = (event, context, callback) => {
  const currentDate = new Date();

  const cusinesparams = {
    TableName: 'kt-cuisines',
    Key:{
        "name": event.cuisineName
    }
};

docClient.get(cusinesparams, (err, result)=> {
    if(err){
        callback(err);
    } else {
        if(Object.keys(result).length === 0){
          const error = {
            code : "NotFound",
            message: "No Cuisine Exists with the Given Name "+ event.cuisineName
          }
          return context.fail(JSON.stringify(error));
        } else {
          const params = {
            TableName: "kt-foods",
            Key: {
              cuisinename: event.cuisineName,
              foodname: event.foodName
            }
          };


  docClient.get(params, (err, result) => {
    if (err) {
      callback(err);
    } else {
      if (Object.keys(result).length === 0) {
        const addParams = {
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
            createdAt: "" + currentDate,
            updatedAt: "" + currentDate
          }
        };
        docClient.put(addParams, (err, result) => {
          if (err) {
            return callback(err);
          } else {
            return callback(null, result);
          }
        });
      } else {
        const error = {
          code: "Found",
          message:
            "Food already exists with the name " +
            event.foodName +
            " in cuisine " +
            event.cuisineName
        };
        return context.fail(JSON.stringify(error));
      }
    }
  });


        }
    }
});

 

};
