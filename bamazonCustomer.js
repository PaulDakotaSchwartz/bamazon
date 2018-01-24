var mysql = require("mysql");
var inquirer = require("inquirer");
require('dotenv').config();

// create the connection information for the sql database
var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: process.env.SQLPW,
  database: "bamazon_DB"
});

// connect to the mysql server and sql database
connection.connect(function(err) {
  if (err) throw err;
  // run the start function after the connection is made to prompt the user
  start();
});

// function which prompts the user for what action they should take
function start() {
  
  // connection.query("SELECT * FROM products", function(err, results) {
  //   if (err) throw err;

  //           var choiceArray = [];
  //           for (var i = 0; i < results.length; i++) {
  //             choiceArray.push(results[i].item_id);
  //             choiceArray.push(results[i].product_name);
  //             choiceArray.push(results[i].price);
  //           }
  //           console.log(choiceArray);
  // });


  inquirer
    .prompt({
      name: "orderList",
      type: "rawlist",
      message: "Enter 1 to Select an Item or Enter 2 to Quit.",
      choices: ["PURCHASE", "QUIT"]
    })
    .then(function(answer) {
      // based on their answer, either call the bid or the post functions
      if (answer.orderList.toUpperCase() === "PURCHASE") {
        displayBamazon();
      }
      else if (answer.orderList.toUpperCase() === "QUIT") {
        connection.end();
      }
    });
}

// function to handle posting new items up for auction
// function postAuction() {
//   // prompt for info about the item being put up for auction
//   inquirer
//     .prompt([
//       {
//         name: "item",
//         type: "input",
//         message: "What is the item you would like to submit?"
//       },
//       {
//         name: "category",
//         type: "input",
//         message: "What category would you like to place your auction in?"
//       },
//       {
//         name: "startingBid",
//         type: "input",
//         message: "What would you like your starting bid to be?",
//         validate: function(value) {
//           if (isNaN(value) === false) {
//             return true;
//           }
//           return false;
//         }
//       }
//     ])
//     .then(function(answer) {
//       // when finished prompting, insert a new item into the db with that info
//       connection.query(
//         "INSERT INTO auctions SET ?",
//         {
//           item_name: answer.item,
//           category: answer.category,
//           starting_bid: answer.startingBid,
//           highest_bid: answer.startingBid
//         },
//         function(err) {
//           if (err) throw err;
//           console.log("Your auction was created successfully!");
//           // re-prompt the user for if they want to bid or post
//           start();
//         }
//       );
//     });
// }

function displayBamazon() {
  // query the database for all items being auctioned
  connection.query("SELECT * FROM products", function(err, results) {
    if (err) throw err;
    // console.log(results);
    // once you have the items, prompt the user for which they'd like to bid on
    inquirer
      .prompt([
        {
          name: "choice",
          type: "rawlist",
          choices: function() {
            var choiceArray = [];
            for (var i = 0; i < results.length; i++) {
              choiceArray.push(results[i].product_name);
            }
            return choiceArray;
          },
          message: "What is the id of the item you would like to buy?"
        },
        {
          name: "unitsRequired",
          type: "input",
          message: "How many of these would you like to order?"
        }
      ])
      .then(function(answer) {
        // get the information of the chosen item
        var chosenItem;
        for (var i = 0; i < results.length; i++) {
          if (results[i].product_name === answer.choice) {
            chosenItem = results[i];
          }
        }
        // console.log(chosenItem);

        // determine if stock available.
        if (chosenItem.stock_quantity >= parseInt(answer.unitsRequired)) {
          // bid was high enough, so update db, let the user know, and start over
          var newStock_Quantity = chosenItem.stock_quantity - parseInt(answer.unitsRequired);
          // console.log(newStock_Quantity);

          var orderPrice = parseInt(answer.unitsRequired) * chosenItem.price;
          // console.log(orderPrice);

          connection.query(
            "UPDATE products SET ? WHERE ?",
            [
              {
                stock_quantity: newStock_Quantity
              },
              {
                item_id: chosenItem.item_id
              }
            ],
            function(err) {
              if (err) throw err;
              console.log("Order placed successfully!");
              console.log("Your total order price is $" + orderPrice + ".")
              start();
            }
          );
        }
        else {
          // bid wasn't high enough, so apologize and start over
          console.log("There is insufficient stock to complete your order. Please try again...");
          start();
        }
      });
  });
}