
# Blood Donor Web Application

Welcome to the **Blood Donor Web Application**! This platform is designed to make the process of blood donation easier and more efficient. It connects donors with recipients, allowing users to find the right blood type in their area and manage donation requests.

## Features

- **User Registration & Login**: Users can register and log in to manage their profiles.
- **Search Donors**: Search for available blood types by location.
- **Donation Requests**: Users can send or respond to donation requests.
- **Admin Dashboard**: Admins can manage donors and donation requests.

## Tech Stack

- **Frontend**: `React`, `Vite`
- **Backend**: `Node.js`, `Express`
- **Database**: `MongoDB` (with `Mongoose`)
- **Authentication**: `JWT` (JSON Web Tokens)
- **Deployment**: `Render` (Frontend on Render, Backend on Heroku)

## Installation Guide

### 1. Clone the Repository

First, clone the repository to your local machine:

```bash
git clone https://github.com/visionarymehedi/blood-donor-app.git
cd blood-donor-app
```

### 2. Set Up the Backend

1. Navigate to the backend directory:

   ```bash
   cd backend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the backend folder and add your environment variables:

   ```plaintext
   PORT=5000
   DATABASE_URL=your_mongo_database_url
   JWT_SECRET=your_jwt_secret
   ```

4. Start the backend server:

   ```bash
   npm start
   ```

Your backend API will now be running on `http://localhost:5000`.

### 3. Set Up the Frontend

1. Navigate to the frontend directory:

   ```bash
   cd frontend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the frontend folder and set the API URL:

   ```plaintext
   REACT_APP_API_URL=http://localhost:5000/api
   ```

4. Run the frontend server:

   ```bash
   npm run dev
   ```

Your frontend React app will now be running on `http://localhost:3000`.

## Usage

1. **Frontend**:
   - Register or log in as a donor.
   - Search for available blood types by location.
   - Send a new donation request or respond to an existing one.

2. **Backend**:
   - API endpoints are available to handle user registration, login, and donation requests.
   - Admins can manage donor information and donation requests.

## Contributing

We welcome contributions to the **Blood Donor Web Application**!

### Steps to Contribute:

1. Fork the repository.
2. Clone your fork to your local machine.
3. Create a new branch:
   ```bash
   git checkout -b feature-branch
   ```
4. Make your changes and commit them:
   ```bash
   git commit -m "Add new feature"
   ```
5. Push your changes:
   ```bash
   git push origin feature-branch
   ```
6. Open a pull request on GitHub.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgements

- **[React](https://reactjs.org/)**: A JavaScript library for building user interfaces.
- **[Node.js](https://nodejs.org/)**: JavaScript runtime for the backend.
- **[Express](https://expressjs.com/)**: Web framework for Node.js.
- **[MongoDB](https://www.mongodb.com/)**: NoSQL database for storing data.
- **[Mongoose](https://mongoosejs.com/)**: MongoDB object modeling tool for Node.js.
- **[JWT](https://jwt.io/)**: Secure token-based authentication.

## Contact

For any questions or feedback, feel free to reach out to me at:  
**Email**: `khanmehedi178@gmail.com`  
**GitHub**: [github.com/visionarymehedi](https://github.com/visionarymehedi)
