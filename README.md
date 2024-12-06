# ReactPostIt
***Welcome to ReactPostIt, a social media platform inspired by Reddit and Twitter. This project is a personal hobby and portfolio showcase built with Laravel, React, and Inertia.js. The aim is to create a modern, full-stack application where users can share posts, comment, and interact in a social environment.***

## Features
- User Authentication: Secure login and registration.
- Post Creation: Share your thoughts with the community.
- Comments: Engage in discussions by commenting on posts.
- Like System: Like posts and comments to show appreciation.
- Responsive Design: Fully functional on both desktop and mobile devices.
- Dynamic UI: Smooth transitions powered by Inertia.js.
- User Profiles: Customizable user profiles to enhance personalization.


## Technologies

### Backend:
Laravel - A powerful PHP framework for building APIs and handling business logic.

### Frontend:
React - A modern JavaScript library for building user interfaces.
Inertia.js - A library to create single-page applications without building an API.

### Database:
MySQL or PostgreSQL - Choose your preferred relational database.

### Containerization:
Docker - For containerized development and deployment.

### Others:
Tailwind CSS - A utility-first CSS framework for styling.
Vite - A fast and modern frontend build tool.

## Setup Instructions
- **Local Development**

- Clone the Repository:
```
git clone https://github.com/Tenarien/ReactPostIt.git
cd ReactPostIt
```
- Install Dependencies:
Backend: ```composer install``` 
Frontend: ```npm install```
- Configure Environment:
Copy .env.example to .env: ```cp .env.example .env``` ***Set database credentials and other configurations in ```.env```.***
- Generate Application Key:
```php artisan key:generate```
- Run Migrations and Seeders:
```php artisan migrate --seed```
- Build Frontend Assets:
```npm run dev```
- Start the Server:
```php artisan serve```
- Visit the App:
Open your browser and navigate to: ```http://localhost:8000``` or ```http://127.0.0.1:8000```

## Docker Development
Install Docker and Docker Compose: Ensure Docker is installed on your machine.

- Set Up Docker Environment:
Modify the .env file to use the Docker database service:
```
DB_HOST=db
DB_PORT=3306
```
- Build and Start Docker Containers:
```docker-compose up --build```
- Run Migrations and Seeders: Access the Laravel container and run:
```
docker exec -it reactpostit bash
```
*or run it manually through docker application*
```
php artisan migrate --seed
```

## Usage
- Create an Account: Sign up with a new account or log in with existing credentials.
- Post: Share your thoughts by creating new posts.
- Engage: Comment on posts and interact with the community.
- Like: Show your appreciation for posts you enjoy.

## Future Improvements
- Real-Time Notifications: Notify users about likes, comments, and new posts in real-time using WebSockets.
- Content Moderation: Add admin tools to manage inappropriate content or ban users.
- Search Functionality: Enable users to search for posts, topics, or other users.
- Dark Mode: Add a toggle for dark mode for better user experience in low-light conditions.
- Analytics Dashboard: Provide insights into user engagement and platform activity.

## License
This project is licensed under the ***MIT License***.

## Screenshots 
- Home Page
https://github.com/Tenarien/ReactPostIt/blob/main/images/home.png?raw=true
- Login
https://github.com/Tenarien/ReactPostIt/blob/main/images/login.png?raw=true
- Register
https://github.com/Tenarien/ReactPostIt/blob/main/images/register.png?raw=true
- Post
https://github.com/Tenarien/ReactPostIt/blob/main/images/post.png?raw=true
- Current User Profile
https://github.com/Tenarien/ReactPostIt/blob/main/images/profile.png?raw=true
- Other User Profile
https://github.com/Tenarien/ReactPostIt/blob/main/images/profile2.png?raw=true
