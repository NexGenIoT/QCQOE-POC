# ott-admin
Server IP: 3.6.164.157
Current Branch: qoe-server-v2
Instance Name: qoe-server

All 12 services are added to the AWS.
Steps to deploy the application:
1. Login to the AWS console.
2. Navigate to the EC2 dashboard.
3. Click on the "Instances" tab.
4. Select the instance that mentioned above to deploy the application to.
5. Click on the "Actions" dropdown menu.
6. Select "Connect to instance" to connect to the instance.
7. Once connected, navigate to the application directory.
8. Move to 'ott-admin' directory.
9. Run the command `git pull`.
10. If it prompt fro passphrase provide it as `daman`.
11. Run command `sudo su`
12. Move to folder "backend".
13. Run command `./deploy.sh` (It will deploy all the 12 service to the AWS)

Note: please refer to the docker compose for the correct port mapping.

Frontend App.
1. move to frontend directory.
2. Run command `npm install`
3. Run command `npm run build`
4. Run command `pm2 restart all`

App URL: http://<ip>:3000

