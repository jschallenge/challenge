/**
 * This javascript file will constitute the entry point of your solution.
 *
 * Edit it as you need.  It currently contains things that you might find helpful to get started.
 */

// This is not really required, but means that changes to index.html will cause a reload.
require('./site/index.html')
// Apply the styles in style.css to the page.
require('./site/style.css')

const url = "ws://localhost:8011/stomp";

var sortTable = require('./site/sort.js')
var table = require('./site/table.js')

// Change this to get detailed logging from the stomp library
global.DEBUG = false

// configure visible fields
//Full data structure
//Html table will be sync with this structure
var dataStruct = {};

var htmlTableVar = document.querySelector("#data");

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
    table.updateData (messageJson, htmlTableVar, dataStruct)
    table.refreshTable (messageJson, htmlTableVar)
    sortTable (htmlTableVar, dataStruct)
  } else {
    console.info ("got empty message")
  }
}





