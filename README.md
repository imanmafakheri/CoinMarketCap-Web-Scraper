### Project: CoinMarketCap Web Scraper

This project is designed to scrape cryptocurrency data from [CoinMarketCap](https://coinmarketcap.com) and store the data in a MySQL database. It consists of two scripts:

1. **Script 1**: Fetches cryptocurrency names and stores them in a MySQL database.
2. **Script 2**: Based on the cryptocurrency names stored in the database, it fetches additional data like rank, watchlist count, market cap, volume, price, circulating supply, and logo URL, and updates the corresponding database records.

The project uses **Node.js**, **Cheerio** (for HTML parsing), **Axios** (for making HTTP requests), **MySQL** (for database interactions), and **Express.js**.

---

## Table of Contents

1. [Features](#features)
2. [Requirements](#requirements)
3. [Installation](#installation)
4. [Project Structure](#project-structure)
5. [Configuration](#configuration)
6. [Usage](#usage)
7. [Database Schema](#database-schema)
8. [License](#license)

---

### Features

- **Web scraping**: Scrapes data from CoinMarketCap website.
- **Data storage**: Stores cryptocurrency names and additional details (rank, price, market cap, etc.) into a MySQL database.
- **Scheduled updates**: Automatically updates the database with fresh data every 4 minutes.

---

### Requirements

- **Node.js** (v12+)
- **MySQL** (v5.7+)
- **npm** (Node package manager)

### Dependencies

The following packages are used in this project:
- `axios`: To make HTTP requests.
- `cheerio`: To parse and manipulate HTML.
- `express`: Web framework (used for the API setup).
- `mysql`: MySQL client for database interaction.
- `cors`: Middleware for handling CORS.

---

### Installation

#### Step 1: Clone the repository
```bash
git clone https://github.com/your-username/coinmarketcap-scraper.git
cd coinmarketcap-scraper
```

#### Step 2: Install dependencies
```bash
npm install
```

#### Step 3: MySQL Setup

Make sure you have a MySQL server running and a database named `robot`. Update the connection details in the code according to your MySQL configuration.

```sql
CREATE DATABASE robot;
USE robot;

CREATE TABLE test (
    id INT AUTO_INCREMENT PRIMARY KEY,
    url VARCHAR(255) NOT NULL,
    name VARCHAR(255),
    rank INT,
    watchlists INT,
    market FLOAT,
    volume FLOAT,
    price FLOAT,
    circulating FLOAT,
    logo_url VARCHAR(255)
);
```

#### Step 4: Configuration

In both scripts, you need to update the database connection settings as per your local MySQL setup:
```javascript
const con = mysql.createConnection({
    host: "127.0.0.1",
    user: "root",
    password: "root",
    port: "8889",
    database: "robot"
});
```

---

### Project Structure

```
coinmarketcap-scraper/
├── app.js             # Main application entry point
├── dataUpdater.js     # Script to update cryptocurrency data
├── package.json       # npm configuration file with dependencies
└── README.md          # Project documentation
```

---

### Configuration

- **MySQL Database**: The project expects a MySQL database to store cryptocurrency data.
- **Cheerio Selectors**: The HTML selectors in the scripts are configured to match the current structure of CoinMarketCap. Any structural changes on the site may require updates to these selectors.

---

### Usage

#### Running the Project

1. **Run Script 1**: To scrape and store cryptocurrency names in the database.
    ```bash
    node app.js
    ```

    This script scrapes the first 50 pages of CoinMarketCap and stores the names and URLs of cryptocurrencies in the MySQL database.

2. **Run Script 2**: To update additional cryptocurrency data (rank, market cap, price, etc.) in the database.
    ```bash
    node dataUpdater.js
    ```

    This script retrieves URLs from the database and fetches additional details for each cryptocurrency. It runs periodically every 4 minutes to ensure the data is up-to-date.

---

### Database Schema

The data is stored in the `test` table within the `robot` database. Below is a schema overview:

| Column        | Type          | Description                             |
|---------------|---------------|-----------------------------------------|
| id            | INT           | Primary Key (Auto Increment)            |
| url           | VARCHAR(255)  | The URL of the cryptocurrency page      |
| name          | VARCHAR(255)  | Name of the cryptocurrency              |
| rank          | INT           | Rank of the cryptocurrency              |
| watchlists    | INT           | Number of users watching the currency   |
| market        | FLOAT         | Market capitalization (in USD)          |
| volume        | FLOAT         | 24-hour trading volume (in USD)         |
| price         | FLOAT         | Current price (in USD)                  |
| circulating   | FLOAT         | Circulating supply (as a percentage)    |
| logo_url      | VARCHAR(255)  | URL of the cryptocurrency logo          |

---

### License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

### Notes

- Ensure that the CoinMarketCap website's structure doesn't change, as the scraper relies heavily on specific HTML element selectors. If changes occur, selectors in the script must be updated accordingly.
- Be mindful of the terms and conditions of CoinMarketCap regarding scraping.

---

Feel free to modify and extend the project based on your needs!

--- 

### Contribution

Contributions are welcome! Please open an issue or submit a pull request to improve the project.
