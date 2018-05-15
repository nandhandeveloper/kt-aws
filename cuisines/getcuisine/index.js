const AWS = require('aws-sdk');
var docClient = new AWS.DynamoDB.DocumentClient();

exports.handler = (event, context, callback) => {


    var params = {
        TableName: 'kt-cuisines',
        Key:{
            "name": event.cuisineName
        }
    };

    docClient.get(params, (err, result)=> {
        if(err){
            callback(err);
        } else {
            callback(null, result);
        }
    });

}