import json
import boto3

def lambda_handler(event, context):
    try:
        # Initialize a DynamoDB resource object for the specified region
        dynamodb = boto3.resource('dynamodb', region_name='ap-south-1')

        # Select the DynamoDB table named 'employeeData'
        table = dynamodb.Table('employeeData')

        # Scan the table to retrieve all items
        response = table.scan()
        data = response['Items']

        # If there are more items to scan, continue scanning until all items are retrieved
        while 'LastEvaluatedKey' in response:
            response = table.scan(ExclusiveStartKey=response['LastEvaluatedKey'])
            data.extend(response['Items'])

        # Return the retrieved data with CORS headers
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
                'Access-Control-Allow-Methods': 'GET,OPTIONS'
            },
            'body': json.dumps(data)
        }
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': str(e)})
        }