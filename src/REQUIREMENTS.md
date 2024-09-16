# PREREQUISITE FOR THE BOT 
> All required packages

```bash
npm install -g discord.js
```

```bash
npm i nodemon dotenv fs mongoose rss-parser axios crypto
```

> All requied environment variables

- **.env**
  - `TOKEN` 
    - (*BOT TOKEN WHICH YOU WILL RECEIVE FROM [DISCORD DEV PORTAL](https://discord.com/developers/)*)
  - `DEFAULT_PREFIX`
    - (*SET YOUR CUSTOM PREFIX FOR THE BOT BYDEFAULT IS S! ~CASE SENSITIVE~*)
  - `GITHUB_TOKEN`
    - (*IF YOU HAVE TO USE GITHUB NOTIFCATIONS LOG IN YOUR BOT PLEASE MAKE ONE FROM SETTINGS>DEVELOPER SETTINGS>PERSONAL ACCESS TOKENS*)
  - `MONGODB_URI`
    - (*AFTER CREATING A COLLECTION YOU WILL GET A URI KEEP THAT AND USE ANY METHOD TO CONNECT FROM `src/mongosDbConnection.txt` OR WE HAVE ALREADY CONFIGURED ONE IN THE INDEX.JS*)