var mysql = require("mysql");
var table = require("console.table");
var colors = require('colors');
var inquirer = require('inquirer');

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,

  // Your username
  user: "jaya",

  // Your password
  password: "p4ssword",
  database: "bamazon_DB"
});

connection.connect(function(err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId + "\n");
  readProducts();
});

function readProducts() {
  	console.log("Products available for sale in bamazon...\n".bold);
  	console.log("----------------------------------------------------------------------------");
  	connection.query("SELECT * FROM products", function(err, res) {
    if (err) throw err;
    // Log all results of the SELECT statement
    console.table(res);
    runOptions();
  });
}


function runOptions() {
	inquirer.prompt({
		name: "action",
		type: "input",
		message: "Would you like to make purchase(s) at bamazon or exit form the application?",
		choices: [
			"purchase",
			"exit"
		]
		}).then(function (answer) {
	    // if user types option... pur or p or purchase or PURCHASE!! call makePurchase function! 
	    switch (answer.action) {
	    	case "purchase":
	    	case "p":
	    	case "pur":
	    	case "PURCHASE":
	    	makePurchase();
	    	//connection.end();
	    	break;

	    	case "exit":
	    	connection.end();
	    	break;
	    }
	});
}

function makePurchase() {
	inquirer.prompt([
		{
			name: "item_id",
			type: "input",
			message: "Can you please type item id that you like to buy?",
			validate: function(value) {
				if (isNaN(value) === false) {
					return true;
				}
				return false;
			}
		},
		{
			name: "quantity",
			type: "input",
			message: "Can you please type number of quanties you like to buy?",
			validate: function(value) {
				if (isNaN(value) === false) {
					return true;
				}
				return false;
			}
		}

	])
	.then(function(answer) {
		console.table(answer);
		
		connection.query("SELECT product_name, price, stock_quantity FROM products WHERE ?", {item_id: answer.item_id}, function(err, res) {
			//for(var i = 0; i < res.length; i++)
			console.log("here");
			if (err) {
				throw err;
			}
			else if (res.length > 0) {
				if (res[0].stock_quantity >= answer.quantity) {
					updateProduct(res[0], answer);
					var totalPrice = answer.quantity * res[0].price;
					console.log("----------------------------------------------------------------------------");
					console.log(" Your total cost for" + answer.quantity.bold + " " + res[0].product_name.bold + " is : " + totalPrice.bold);
					console.log("----------------------------------------------------------------------------");
				}
				else {
					console.log("Insufficient quantity!!".bold);
				}
			}
			else {
				console.log("The item_id you entered is incorrect! Please enter the correct item_id");
			}
		})
		connection.end();
	})
}

function updateProduct(row, answer) {
  console.log("Updating the database...\n");
  var query = connection.query(
    "UPDATE products SET ? WHERE ?",
    [
      {
        stock_quantity: (row.stock_quantity - answer.quantity)
      },
      {
        item_id: answer.item_id
      }
    ],
    function(err, res) {
      
      console.log(res.affectedRows + " products updated!\n");
   
    }
  );

  // logs the actual query being run
  //console.log(query.sql);
}



