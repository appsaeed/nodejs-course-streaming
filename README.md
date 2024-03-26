# Nodejs Course Application

## Uses
install nodejs (if doen't exist) <br> <br>
install node_modules packages by executing the command from terminal
```sh
npm install 
```

run development server (it has watch mode that always looks for file changes and update server)
```sh
npm run dev 
```

run production server
```sh
npm run dev 
```


## packages

- **bcrypt** (make password hash)
- **body-parser** (parser data to body request for post, get, etc)
- **connect-flash** (send session messages server to ejs/client)
- **cookie-parser** (browser cookies)
- **dotenv** (load .env file to access environment)
- **ejs** (render ejs template)
- **express** (use router and middleware in nodejs application)
- **express-session** (application session or browser session)
- **express-validator** (body/form request validation for server side)
- **http-errors** (Help to create custom error)
- **multer** (files upload)
- **pg** (postgresql database driver)


## environment with .env file
port number for application port like localhost:3030
```.env
PORT="any_port_number"
```
**database config**
```.env
DB_HOST="localhost"
DB_PORT="5432"
DB_DATABASE="course"
DB_USERNAME="root"
DB_PASSWORD="7890"
```

## Project Structure
```
.
├── /
├── │
├── ├── app/
├── │   ├── db.js - postgresql database connection
├── │   ├── settings.js - some environment variables extracted in js
├── │   └── upload.js - file upload using multer package
├── │   └── utilities.js - helpers functions e.g: bcrypt package to hash password
├── |
├── ├── contollers/
├── │   ├── admin/
├── |   ├── ├── AdminController.js - admin crud operations, login, register etc.
├── |   ├── ├── CommentControler.js - admin comment crud operations etc.
├── |   ├── ├── PlaylistContoller.js - admin playlist crud operations etc.
├── |   ├── └── VideoController.js - admin video crud operations etc.
├── |   ├── AccountController.js - user profile, udpate, edit etc.
├── |   ├── AuthController.js - user account login, register, update etc.
├── |   ├── BookmakController.js - user bookmark crud operations etc.
├── |   ├── CommentController.js - user comment crud operations etc.
├── |   ├── ContactContoller.js - user contact crud operations etc.
├── |   ├── HomeController.js - user view render some pages etc.
├── |   ├── LikeController.js - user like crud operations some pages etc.
├── |   ├── PlaylistController.js - user like crud operations some pages etc.
├── |   ├── TutorController.js - user show tutor profile, etc.
├── |   └── TutorController.js - user show tutor profile, etc.
├── |
├── ├── database/
├── │   └── tables.sql - postgresql database tables schema
├── |
├── ├── middleware/
├── │   ├── amdin.js - admin authentication middleware
├── │   ├── auth.js - user authentication middleware
├── │   ├── errors.js - all errors handler middleware
├── │   ├── api.js or token.js - api authentication
├── │   └── unauth.js - login, register, will redirect to home page
├── |
├── ├── model/ --- models uses for sql queries
├── │   ├── Model.js - parent class to help sql queries for of the models
├── │   ├── Auth.js - get authenticated user, tutor id , user_id etc
├── │   ├── Bookmark.js - run sql query on bookmark table
├── │   ├── Contact.js -  run sql query on Contact table
├── │   ├── Content.js - run sql query on Content table
├── │   ├── Like.js - run sql query on likes table
├── │   ├── Playlist.js - run sql query on playlist table
├── │   ├── Tutor.js - run sql query on tutors table
├── │   └── User.js - run sql query on users table
├── |
├── ├── public/ 
├── │   └── Nothing updated on this directory 
├── |
├── ├── reuter/ - Application all routers
├── │   ├── admin.js - all admin pages/routers
├── │   ├── auth.js - all authentication and unauthorized pages
├── │   └── public.js - all public pages path/routes
├── │
├── ├── view/ - All view pages wtih only html/css/javascript and ejs
├── │
├── ├── .eslintrc.json - vs code eslint ignore
├── ├── .gitignoe - git ignore files
├── ├── package.json - node packages
├── ├── package.lock.json - node packages version lock files
├── ├── main.js - main nodejs server file
├── │
└── └── README.md
```
