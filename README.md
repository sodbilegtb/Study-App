### Starting the application <br>
Install dependencies <br>
```npm install``` <br>
Start the application by running <br>
```node main.js```

### With Docker
Build the image <br>
```docker build -t app .``` <br>
Run the container <br>
```docker run -p 3000:3000 app:latest``` <br> <br>
Or use docker compose <br>
```docker compose up```

Then visit http://localhost:3000