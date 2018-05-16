const AWS = require('aws-sdk');
var docClient = new AWS.DynamoDB.DocumentClient();

exports.handler = (event, context, callback) => {


    const params = {
        TableName: 'kt-cuisines'
    };

    docClient.scan(params, (err, result)=> {
        if(err){
            callback(err);
        } else {
            callback(null, result);
        }
    });

}