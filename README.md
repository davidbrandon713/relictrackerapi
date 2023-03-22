# Installation
- clone the repo
- navigate to the ***relictrackerapi*** folder
- run `npm install`
- create a file in the `relictrackerapi` folder called `.env` and paste this into the file:
```
mongoURI=mongodb+srv://<USERNAME>:<PASSWORD>@<CLUSTER>.qtrqjqe.mongodb.net/<DATABASE>?retryWrites=true&w=majority
```
- replace the values (and the brackets) with your username, password, cluster, and database names

&nbsp;

## Start the server
- run the server simply by double clicking the file: ***relictrackerapi.bat***
- the server will run by default at `http://localhost:3001`
- press `Ctrl+C` to stop the server

&nbsp;

## !!&nbsp;&nbsp;DO NOT move the bat file from the original location&nbsp;&nbsp;!! 
instead, create a shortcut somwhere easily accessible such as on your desktop
