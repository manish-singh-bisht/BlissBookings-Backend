# BlissBookings-Backend

This is the backend repository for BlissBookings,a hotel booking platform simplifying accomodations.


## Table of Contents

- [Architecture](#Architecture)
- [Development](#Development)
- [Contributing](#Contributing)


## Architecture

- This platform is built using microservices architecture, with each service having its own database.
- Services communicate asynchronously via Apache Kafka to maintain data consistency.
- Data is cached using Redis as a caching layer.
- The SAGA pattern is implemented for managing distributed transactions across services, for example, between booking-service and payment-service.
- The API gateway which also serves as an aggregator, receives client requests and routes them to the appropriate microservices.
  
![Screenshot from 2024-07-12 02-24-37](https://github.com/user-attachments/assets/3ec47b9a-2e2b-48cf-b971-af88473598c6)

In our system architecture, auth-service directly makes REST API calls to user-service during user registration.User creation happens in both the services. This direct interaction is crucial because auth-service depends on user-service for creating user entries. The success or failure of user-service operations determines the overall success or failure of user registration. This approach ensures that user data is properly synchronized and validated across both services.

![Screenshot from 2024-07-12 02-24-55](https://github.com/user-attachments/assets/360213b1-79dc-47c5-96b8-1ba3ed4286e7)


Each service in our architecture validates API calls by verifying the access token (JWT) sent as a header with each request. This validation is performed by sending the access token to auth-service via a direct REST API call. auth-service checks the validity and authenticity of the token before allowing further processing of the request.

![Screenshot from 2024-07-12 02-19-34](https://github.com/user-attachments/assets/3b445166-6937-46f9-8f7b-fad539689fcf)




## Development

Here are the steps to run the project locally:

### 1. Fork and Clone the Repository

- Fork the repository on GitHub to your own account.
- Clone the forked repository to your local machine:



```
  git clone https://github.com/your-username/BlissBookings-Backend.git
```


Replace `your-username` with your actual GitHub username.

### 2. Install Dependencies

- Navigate into each service directory (e.g., `cd service-directory`).
- Run the following command to install dependencies for each service:
```
  npm install
```

### 3. Set Up Environment Variables

- Create a `.env` file in the root of each service.
- Copy the contents from `.env.example` provided in each service directory.
- Update the values in `.env` files according to your environment and configuration needs.

### 4. Start Docker Containers

- In the root directory of the project, start Docker containers defined in `docker-compose.yml` file in detached mode:
```
 docker-compose up -d
```


### 5. Start Services

- After Docker containers are up and running, start each service by running:
```
  npm run start
```


Run this command in each service directory. This command should start the service and make it available locally.

### 6. Verify Services

- Once all services are up and running, verify their availability by accessing their respective endpoints or checking logs for any errors.




## Contributing

Would love to see your contribution.
