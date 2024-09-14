// Importing required modules
const mysql = require('mysql');       // Import the MySQL library to work with a MySQL database
const cheerio = require('cheerio');   // Import Cheerio to parse and manipulate HTML from web pages
const express = require('express');   // Import Express to create a web server
const axios = require("axios");       // Import Axios to make HTTP requests
const cors = require('cors');         // Import CORS to handle cross-origin requests

// Initialize Express application
const app = express();
// Enable CORS for all routes, allowing access from different origins
app.use(cors());

// Configure MySQL connection settings
const con = mysql.createConnection({
    host: "127.0.0.1",        // The hostname of the database (local in this case)
    user: "root",             // Username for database login
    password: "root",         // Password for database login
    port: "8889",             // Port for MySQL connection
    database: "robot"         // Name of the database to connect to
});

let pge = 1;  // Initialize a variable to iterate through pages
const url = 'https://coinmarketcap.com/?page=';  // Base URL for CoinMarketCap

// Loop through pages 1 to 50 on CoinMarketCap
for (pge; pge <= 50; pge++) {

    const pager = url + pge;  // Append the page number to the base URL

    // Make an HTTP request to fetch the HTML content of the page
    axios(pager)
        .then(response => {
            const html = response.data;  // Get HTML response data
            const $ = cheerio.load(html);  // Load HTML content into Cheerio for parsing
            const articles = [];  // Initialize an array to store extracted URLs

            // Iterate over each row of the table in the HTML
            $('tbody tr', html).each(function () {
                const url = $(this).find('a').attr('href');  // Extract URL from the anchor tag inside the row
                articles.push({
                    url  // Store the URL in the articles array
                });
            });

            // Connect to the MySQL database
            con.connect(function () {
                const str = JSON.stringify(articles);  // Convert the articles array to a JSON string
                let i = 0;  // Initialize a counter variable

                // Loop to insert up to 300 records into the database
                for (; i < 300;) {
                    i++;  // Increment the counter

                    // Prepare the URL by appending the relevant part from the articles array
                    const ur = 'https://coinmarketcap.com/currencies/';
                    const st = ur + str.split("/")[i];  // Construct the final URL to be inserted

                    // SQL query to insert the URL into the database
                    const sql = "INSERT INTO test (url) VALUES ('" + st + "'); ";

                    // Execute the SQL query to insert the record
                    con.query(sql, function (err) {
                        if (err) throw err;  // Throw an error if the query fails
                    });

                    i++;  // Increment the counter again
                    console.log("Number of records inserted: " + i);  // Log the progress
                }
            });
        }).catch(err => console.log(err));  // Log any errors during the HTTP request
}