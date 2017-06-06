/**
 * This javascript file will constitute the entry point of your solution.
 *
 * Edit it as you need.  It currently contains things that you might find helpful to get started.
 */

// This is not really required, but means that changes to index.html will cause a reload.
require('./site/index.html')
// Apply the styles in style.css to the page.
require('./site/style.css')

var sortTable = require('./site/sort.js')
var calculateMidprice = require('./site/midprice.js')

// Change this to get detailed logging from the stomp library
global.DEBUG = false

// configure visible fields
const showFields = ["name", "bestBid", "bestAsk", "lastChangeAsk", "lastChangeBid"];
const titles = {"name":"Name", "bestBid": "Best Bid", "bestAsk": "Best Ask", "lastChangeAsk": "Last Change Ask", "lastChangeBid": "Last Change Bid &#9651;"};
const midPriceTitle = "Mid Price";

const url = "ws://localhost:8011/stomp";

//Full data structure
//Html table will be sync with this structure
var dataStruct = {};
var midprice = {};
var htmlTableVar = document.querySelector("#data");
var initialized = false;

//create Websockets client
const client = Stomp.client(url)
client.debug = function(msg) {
  if (global.DEBUG) {
    console.info(msg)
  }
}

//called when connection stablished
function connectCallback() {
  console.info ("It has now successfully connected to a stomp server serving price updates for some foreign exchange currency pairs.")
  //start reading messages from topic
  var subscription = client.subscribe("/fx/prices", receiveMsg)
}

client.connect({}, connectCallback, function(error) {
  alert(error.headers.message)
})

//called when the client receives a STOMP message from the server
function receiveMsg (message) {
  if (message.body) {
    var messageJson = JSON.parse(message.body)
    updateData (messageJson, htmlTableVar)
    refreshTable (messageJson, htmlTableVar)
    sortTable (htmlTableVar, dataStruct)
  } else {
    console.info ("got empty message")
  }
}

/* 
Create headers dynamically with first message
Really, data structure in not usually dynamic, but this is a JS challenge, so I'll do intensive use of JS :)
*/
function initializeTable ( message, htmlTable) {
  initialized = true
  var head = htmlTable.tHead;
  var row = head.insertRow (-1)
  
  for (var key in message) {
    if (message.hasOwnProperty(key) && showFields.indexOf(key) > -1 ) {
      var th = document.createElement('th');
      var cell = row.appendChild(th)
      cell.innerHTML = titles[key]
    }
  }
  var th = document.createElement('th');
  var cell = row.appendChild(th)
  cell.innerHTML = midPriceTitle
}

//Update data structure with last message
function updateData ( message, htmlTable ) {
  
  //first time, create inmutable headers
  if(!initialized)
    initializeTable(message, htmlTable)
  
  //popule data map by currency key
  dataStruct[message["name"]] = message;
  
  calculateMidprice(midprice, message)
}

//draw sparkline and add to table
function addMidpriceSpakline (key, row, index) {
  var cell = row.cells[index]
  if (!cell)
    cell = row.insertCell(-1)
  else
    cleanCell (cell)
  const sparkElement = document.createElement('span')
  const sparkline = new Sparkline(sparkElement)
  cell.appendChild (sparkElement)
  
  var onlyPrices = [];
  midprice[key].forEach(function(item) {
    onlyPrices.push ( item[1] )
  });
  
  sparkline.draw(onlyPrices)
}

//sync DOM with last changes
function refreshTable (message, htmlTable) {
  //iterate overy keys and create rows using that order
  var key = message["name"]
  var body = htmlTable.tBodies[0]
  var row;
  var rowArr = body.getElementsByClassName(key);
  var create = false;
  if ( rowArr.length === 0 )
  {
    create = true;
    //add new row to last position
    row = htmlTable.tBodies[0].insertRow(-1)
    row.id = key
    row.className = key 
  }
  else
    row = rowArr[0]

  //add cells with currency values
  var count = 0;
  for (var keyColumn in message) {
    //show only enabled fields
    if (message.hasOwnProperty(keyColumn)  && showFields.indexOf(keyColumn) > -1) {
      var cell;
      if ( create )
        cell = row.insertCell(-1)
      else
        cell = row.cells[count]
      cell.innerHTML = message[keyColumn]
      count++;
    }
  }
  addMidpriceSpakline (key, row, count)
}

function cleanCell (cell)
{
  while (cell.hasChildNodes())
    cell.removeChild(cell.lastChild);
}
