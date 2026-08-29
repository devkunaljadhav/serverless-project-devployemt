EMPOWER EMS - FINAL PROJECT
============================

Frontend:
- index.html
- scripts.js

AWS Lambda:
- insertEmployeeData.py
- getEmployees.py
- updateEmployeeData.py
- deleteEmployeeData.py

Frontend element IDs are kept compatible with scripts.js.
The UI includes:
- Dashboard statistics
- Add employee
- View employees
- Search
- Edit employee
- Update employee
- Delete employee
- Responsive professional layout

DEPLOYMENT
----------
1. Upload index.html and scripts.js to the same S3 folder.
2. Keep your existing API Gateway endpoint in scripts.js.
3. Deploy/update the four Lambda functions as required.
4. Make sure API Gateway routes are:
   POST   /employeeData
   GET    /employeeData
   PUT    /employeeData
   DELETE /employeeData
5. Refresh CloudFront after uploading the new frontend if CloudFront is used.

IMPORTANT
---------
Do not change the API endpoint in scripts.js unless your API Gateway URL is different.
The existing backend uses DynamoDB table: employeeData
Primary key: employeeid
