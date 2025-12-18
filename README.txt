Instructions for running the website:
1. Import the sql file found in the assests folder. Name of database should be team-berners-lee.
2. (For PHP) Open terminal and navigate to the project folder. Run the command php -S localhost:8000
3. (For Node.js) Navigate to the app folder using a terminal and run the command npm start.
4. Open any browser and go to type in localhost:8000.

Note: Make sure that the php modules are present in the Path Environment Variables for the PHP to work.

Running using docker
1. Go to project directory.
2. Run docker compose up --build (This builds the compose.yaml which contains configurations for running the website via docker containers).
4. Open any browser and go to type in localhost:8000 or <ipAddress>:8000 (e.g. 192.168.1.1:8000).
