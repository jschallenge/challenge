module.exports = sortTable;

function sortTable( htmlTable, data ) {
  //sort keys in a new array using data struct
  var orderedKeys = Object.keys(data);
  orderedKeys.sort(function(a,b){return data[a]["lastChangeBid"] - data[b]["lastChangeBid"] });
  
  var body = htmlTable.tBodies[0]
  var count = 0;
  orderedKeys.forEach(function(key) {
    var row = body.getElementsByClassName(key)[0];
    //If row must change its position (index-1 to avoid header)
    var index = row.rowIndex - 1
    if( index != count)
    {
      var currentDataRow = data[key];
      var oldId = row.id
      var oldClassName = row.className
      var oldHtml = row.innerHTML
      var span = row.getElementsByTagName("span")[0]
      
      htmlTable.tBodies[0].deleteRow(index)
      
      //add new row to current position
      var newrow = htmlTable.tBodies[0].insertRow(count)
      newrow.id = oldId
      newrow.className = oldClassName
      newrow.innerHTML = oldHtml
      cleanCell( newrow.cells[newrow.cells.length-1] )
      newrow.cells[newrow.cells.length-1].appendChild (span)
    }
    count++
  });
}

function cleanCell (cell)
{
  while (cell.hasChildNodes())
    cell.removeChild(cell.lastChild);
}