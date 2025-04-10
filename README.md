# ExpenseTracker

A streamlined expense tracking application built with React and Appwrite to help users manage their personal finances effectively.

## Overview

ExpenseTracker is a simple yet powerful web application that allows users to track and manage their expenses. With intuitive user interface and seamless integration with Appwrite backend services, users can easily categorize expenses, perform CRUD operations, and gain insights into their spending habits.

## Features

- **User Authentication**: Secure login and registration system powered by Appwrite Auth
- **Expense Management**: Create, read, update, and delete expense records
- **Categorization**: Organize expenses into categories (food, travel, bills, etc.)
- **Responsive Design**: Works seamlessly across desktop and mobile devices
- **Real-time Updates**: Changes reflect immediately with Appwrite's real-time capabilities

## Tech Stack

### Frontend
- React JS/TS
- Tailwind CSS for styling

### Backend
- Appwrite for backend services
  - Authentication
  - Database

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Appwrite instance (self-hosted or cloud)

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/expense-tracker.git
cd expense-tracker
```

2. Install dependencies
```bash
npm install
# or
yarn install
```

3. Configure Appwrite
   - Create an Appwrite project
   - Set up authentication (email/password)
   - Create a database with collections for expenses
   - Update the environment variables with your Appwrite credentials

4. Start the development server
```bash
npm start
# or
yarn start
```

## Database Schema

### Expenses Collection
| Field      | Type     | Description                                  |
|------------|----------|----------------------------------------------|
| id         | String   | Unique identifier (generated by Appwrite)    |
| user_id    | String   | User ID of the expense owner                 |
| amount     | Number   | Expense amount                               |
| category   | String   | Category of expense (food, travel, bills)    |
| description| String   | Description of the expense                   |
| date       | DateTime | Date of the expense                          |
| created_at | DateTime | Timestamp when record was created            |
| updated_at | DateTime | Timestamp when record was last updated       |

## Project Structure

```
public/
src/
├── assets/
│   └── reactsvg.svg
├── components/
│   ├── Dashboard.jsx
│   ├── ExpenseForm.jsx
│   ├── ExpenseList.jsx
│   ├── Login.jsx
│   ├── Register.jsx
│   ├── Sidebar.jsx
│   ├── SummaryCards.jsx
│   └── Toast.jsx
├── contexts/
│   ├── ExpenseContext.jsx
│   └── ToastContext.jsx
├── services/
│   └── appwrite.js
├── App.jsx
├── index.css
└── main.jsx
.gitignore
```

## Usage

1. Register for a new account or login with existing credentials
2. On the dashboard, view existing expenses or add new ones
3. Edit or delete expenses as needed
4. Filter expenses by category or date range
5. View summary statistics about your spending habits

## Key Components

- **Login/Register**: Authentication components for user sign-in and registration
- **Dashboard**: Main interface displaying expense summaries and statistics
- **ExpenseForm**: Form component for adding and editing expenses
- **ExpenseList**: Component to display and manage existing expenses
- **Sidebar**: Navigation and user controls
- **SummaryCards**: Visual representation of expense statistics
- **Toast**: Notification component for user feedback

## Contexts

- **ExpenseContext**: Manages expense data state and operations across components
- **ToastContext**: Handles application-wide notifications

## Future Enhancements

- Monthly spending reports
- Budget setting and tracking
- Expense analytics and visualization
- Export functionality (CSV, PDF)
- Multiple currency support
- Receipt image upload and storage

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [Appwrite](https://appwrite.io/) for providing an excellent backend platform
- [React](https://reactjs.org/) for the frontend framework
- [Tailwind CSS](https://tailwindcss.com/) for styling

---

Developed with ❤️ by [Al-jon Santiago]
