const AWS = require('aws-sdk');
var docClient = new AWS.DynamoDB.DocumentClient();

exports.handler = (event, context, callback) => {


    var params = {
        TableName: 'kt-cuisines',
        Item:{
            "name": event.cuisineName,
            "info": {
                "image": event.info.image,
                "foodItems": event.info.foodItems,
                "description": event.info.description,
            },
            "createdAt": new Date(),
            "updatedAt": ''
        }
    };

    docClient.put(params, (err, result)=> {
        if(err){
            callback(err);
        } else {
            callback(null, result);
        }
    });

}