// Importing required modules
const cheerio = require('cheerio');   // Used for parsing and manipulating HTML
const express = require('express');   // Web framework for Node.js to create server-side applications
const axios = require("axios");       // HTTP client for making requests
const cors = require('cors');         // Middleware for enabling CORS (Cross-Origin Resource Sharing)
const mysql = require('mysql');       // MySQL client for connecting and querying the database

// Initialize Express application
const app = express();
// Use CORS for handling requests from different origins
app.use(cors());

// Database connection configuration
const con = mysql.createConnection({
    host: "127.0.0.1",  // Database host (localhost in this case)
    user: "root",       // MySQL username
    password: "root",   // MySQL password
    port: "8889",       // MySQL connection port (default: 3306, but customized here)
    database: "robot"   // Database to connect to
});

// Time interval in minutes for data updates and current page tracking
let updateTime = 4;        // Update every 4 minutes
let currentPage = 0;       // Start from the first page

// Function to call updateData every `updateTime` minutes
updateData();
setInterval(function () {
    updateData();  // Regularly update data
}, updateTime * 60000);  // Convert minutes to milliseconds

// Function to fetch and update data from the database
function updateData() {
    con.connect(function (err) {
        if (err) throw err;  // If the connection fails, throw an error

        // Select URL and ID from the 'test' table
        con.query("SELECT url, id FROM test", function (err, result) {
            if (err) throw err;  // Handle query errors

            // Loop through a batch of 100 records starting from currentPage
            for (let i = currentPage; i < currentPage + 100 && i < 5000; i++) {

                // Fetch HTML from each URL
                axios(result[i].url)
                    .then(response => {
                        const html = response.data;
                        const $ = cheerio.load(html);  // Load the HTML into cheerio for parsing

                        // Extract relevant data from the page and update the database

                        // Extract Name
                        $('#__next > div > div.main-content > div.sc-57oli2-0.comDeo.cmc-body-wrapper > div > div.sc-16r8icm-0.eMxKgr.container > div.sc-16r8icm-0.sc-9vl594-1.hXdIVV > section > div > span', html).each(function () {
                            const name = $(this).text();

                            // Update the database with the extracted name
                            const sql = `UPDATE test SET name="${name}" WHERE id="${result[i].id}"`;
                            con.query(sql, function (err) {
                                if (err) throw err;  // Handle query errors
                                console.log("Name updated: " + name);
                            });
                        });

                        // Extract Rank
                        $('.namePillPrimary', html).each(function () {
                            const rank = $(this).text().replace("Rank #", "");

                            // Update the rank in the database
                            const sql = `UPDATE test SET rank="${rank}" WHERE id="${result[i].id}"`;
                            con.query(sql, function (err) {
                                if (err) throw err;
                                console.log("Rank updated: " + rank);
                            });
                        });

                        // Extract Watchlist count
                        $('div:nth-child(3)', html).each(function () {
                            const watchlistCount = $(this).text().split(" ")[1].replace(/,/g, "");

                            // Update watchlist count in the database
                            const sql = `UPDATE test SET watchlists="${watchlistCount}" WHERE id="${result[i].id}"`;
                            con.query(sql, function (err) {
                                if (err) throw err;
                                console.log("Watchlist updated: " + watchlistCount);
                            });
                        });

                        // Extract Market Cap
                        $('.statsItemRight', html).each(function () {
                            const marketCap = $(this).text().replace(/[$,]/g, "").replace("- -", "0");

                            // Update market cap in the database
                            const sql = `UPDATE test SET market="${marketCap}" WHERE id="${result[i].id}"`;
                            con.query(sql, function (err) {
                                if (err) throw err;
                                console.log("Market Cap updated: " + marketCap);
                            });
                        });

                        // Extract Volume
                        $('section', html).each(function () {
                            const volume = $(this).text().replace(/[$,]/g, "").replace("- -", "0");

                            // Update volume in the database
                            const sql = `UPDATE test SET volume="${volume}" WHERE id="${result[i].id}"`;
                            con.query(sql, function (err) {
                                if (err) throw err;
                                console.log("Volume updated: " + volume);
                            });
                        });

                        // Extract Price
                        $('table > tbody > tr:nth-child(1) > td', html).each(function () {
                            const price = $(this).text().replace(/[$,<]/g, "").replace("No Data", "0");

                            // Update price in the database
                            const sql = `UPDATE test SET price="${price}" WHERE id="${result[i].id}"`;
                            con.query(sql, function (err) {
                                if (err) throw err;
                                console.log("Price updated: " + price);
                            });
                        });

                        // Extract Circulating Supply
                        $('.supplyBlockPercentage', html).each(function () {
                            const circulatingSupply = $(this).text().replace("%", "").replace("--", "0");

                            // Update circulating supply in the database
                            const sql = `UPDATE test SET circulating="${circulatingSupply}" WHERE id="${result[i].id}"`;
                            con.query(sql, function (err) {
                                if (err) throw err;
                                console.log("Circulating Supply updated: " + circulatingSupply);
                            });
                        });

                        // Extract Logo URL
                        $('.nameHeader img', html).each(function () {
                            const logoUrl = $(this).attr('src');

                            // Update logo URL in the database
                            const sql = `UPDATE test SET logo_url="${logoUrl}" WHERE id="${result[i].id}"`;
                            con.query(sql, function (err) {
                                if (err) throw err;
                                console.log("Logo URL updated: " + logoUrl);
                            });
                        });

                    }).catch(err => console.log(err));  // Log errors in axios requests
            }

            // Increment currentPage by 100 after each batch
            currentPage += 100;
        });
    });
}