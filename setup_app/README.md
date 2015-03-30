##Basic SPA Setup with Mean Starter Kit

###Tutorial from Scotch.io
https://scotch.io/tutorials/setting-up-a-mean-stack-single-page-application

####App Requirements / Specs
* Single page application (SPA)
* Node.js backend with Express and MongoDB
* AngularJS frontend
* Modular Angular components (controllers, services)
* Good application structure

####Application Structure
```
    - app
        ----- models/
        ---------- nerd.js <!-- the nerd model to handle CRUD -->
    ----- routes.js
    - config
        ----- db.js 
    - node_modules <!-- created by npm install -->
    - public <!-- all frontend and angular stuff -->
    ----- css
    ----- js
    ---------- controllers <!-- angular controllers -->
    ---------- services <!-- angular services -->
    ---------- app.js <!-- angular application -->
    ---------- appRoutes.js <!-- angular routes -->
    ----- img
    ----- libs <!-- created by bower install -->
    ----- views 
    ---------- home.html
    ---------- nerd.html
    ---------- geek.html
    ----- index.html
    - .bowerrc <!-- tells bower where to put files (public/libs) -->
    - bower.json <!-- tells bower which files we need -->
    - package.json <!-- tells npm which packages we need -->
    - server.js <!-- set up our node application -->
```

