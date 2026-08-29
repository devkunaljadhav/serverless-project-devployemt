import json
import boto3

dynamodb = boto3.resource('dynamodb')

table = dynamodb.Table('employeeData')


def lambda_handler(event, context):

    try:

        employeeid = event['employeeid']


        response = table.delete_item(

            Key={
                'employeeid': employeeid
            }

        )


        return {

            'statusCode': 200,

            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },

            'body': json.dumps({
                'message': 'Employee deleted successfully',
                'employeeid': employeeid
            })

        }


    except Exception as e:

        return {

            'statusCode': 500,

            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },

            'body': json.dumps({
                'message': 'Error deleting employee',
                'error': str(e)
            })

        }