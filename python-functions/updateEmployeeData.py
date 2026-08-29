import json
import boto3

dynamodb = boto3.resource('dynamodb')

table = dynamodb.Table('employeeData')


def lambda_handler(event, context):

    try:

        employeeid = event['employeeid']
        name = event['name']
        department = event['department']
        salary = event['salary']


        response = table.update_item(

            Key={
                'employeeid': employeeid
            },

            UpdateExpression="""
                SET #employee_name = :name,
                    department = :department,
                    salary = :salary
            """,

            ExpressionAttributeNames={
                '#employee_name': 'name'
            },

            ExpressionAttributeValues={
                ':name': name,
                ':department': department,
                ':salary': salary
            },

            ReturnValues="UPDATED_NEW"

        )


        return {

            'statusCode': 200,

            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },

            'body': json.dumps({
                'message': 'Employee updated successfully',
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
                'message': 'Error updating employee',
                'error': str(e)
            })

        }