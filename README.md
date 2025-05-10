# do-test Service

The **do-test** service is a NestJS backend application designed to manage tests, questions, answers, and class tests for an educational or quiz platform.

## Features

- **Class Tests Management**: Retrieve questions for specific class tests for authenticated users.
- **Questions Management**: (Planned) Create and retrieve questions.
- **Answers Management**: (Planned) Manage answers related to questions.
- **Authentication**: JWT-based authentication guard protecting API endpoints.

## Modules

- **ClassTestModule**: Handles operations related to class tests, including fetching test questions.
- **QuestionsModule**: Manages question entities (currently with placeholder endpoints).
- **AnswersModule**: Manages answers (controller currently empty).
- **AuthModule**: Handles authentication (service currently with placeholder methods).

## Setup

### Prerequisites

- Node.js and npm installed
- MongoDB instance running and accessible

### Installation

1. Navigate to the `do-test` directory:

```bash
cd do-test
```

2. Install dependencies:

```bash
npm install
```

3. Configure environment variables, especially `MONGODB_URI` for MongoDB connection.

### Running the Service

Run the service in development mode:

```bash
npm run start:dev
```

### Testing

Run tests using:

```bash
npm run test
```

## API Endpoints

- `POST /class-test/get-question-of-test`: Retrieve questions for a specific class test. Requires JWT authentication.
- `POST /questions`: Create a question (currently placeholder).
- `GET /questions`: Retrieve all questions (currently placeholder).

## Technologies Used

- [NestJS](https://nestjs.com/)
- [MongoDB](https://www.mongodb.com/)
- [Mongoose](https://mongoosejs.com/)
- TypeScript

## License

This project is licensed under the MIT License.
