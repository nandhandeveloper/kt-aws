const AWS = require('aws-sdk');
var docClient = new AWS.DynamoDB.DocumentClient();

exports.handler = (event, context, callback) => {

    const currentDate =  new Date();

    const params = {
        TableName: "kt-cuisines",
        Key: {
          name: event.cuisineName
        }
      };
    
      docClient.get(params, (err, result) => {
        if (err) {
          callback(err);
        } else {
          if (Object.keys(result).length === 0) {
            const addParams = {
                TableName: 'kt-cuisines',
                Item:{
                    "name": event.cuisineName,
                    "info": {
                        "image": event.info.image,
                        "foodItems": event.info.foodItems,
                        "description": event.info.description,
                    },
                    "createdAt": ''+currentDate,
                    "updatedAt": ''+currentDate
                }
            };
            docClient.put(addParams, (err, result)=> {
                if(err){
                    return callback(err);
                } else {
                   return callback(null, result);
                }
            });

          } else {
            const error = {
                code: "Found",
                message: "Cuisine already exists with the name " + event.cuisineName
              };
              return context.fail(JSON.stringify(error));
          }
        }
    });
}