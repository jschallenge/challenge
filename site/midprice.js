module.exports = calculateMidprice;

const expireMidprice = 30000;

//Update midprice
function calculateMidprice (midprice, message)
{
  //calculate midprice
  var elemMidprice = (message["bestBid"] + message["bestAsk"]) / 2;
  var currentTimestamp = Date.now()
  //check if exist previous midPrices
  if ( midprice[message["name"]] )
    cleanOldMidprices (midprice[message["name"]], currentTimestamp)
  else
    midprice[message["name"]] = []
  //Add new midprice
  midprice[message["name"]].push( [currentTimestamp, elemMidprice] )
}


//Util function to maintain only fresh bids
function cleanOldMidprices ( midPriceArray, currentTimestamp) {
  var lengthPrices = midPriceArray.length - 1
  //Iterate midprice array and remove elements older than 30 seconds
  for(var index=lengthPrices-1; index>=0; index--)
  {
    if ( currentTimestamp - midPriceArray[index][0] > expireMidprice )
      midPriceArray.splice (index, 1)
  }
}
