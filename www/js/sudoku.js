var sudokuTable; 
var rows = 9; 
var columns = 9;
var displayPossibleNumbers;
var arrayForBoard;
var arrayForDisplayBoard;
var arrayForEditableNumbers;
var difficultyLevel;
var numberWithEvent;
var displayWhereNumbersCannotGo;
var arrayOfNumberPlacements;
var arrayOfBlack;
var arrayOfRed;
var arrayOfBlue;
var arrayOfGreen;
var arrayOfPurple;

var mostrar; // handle for winner show interval

var timeClock;//=setInterval(function(){myTimer()},1000);
var sec = 0;
var min = 0;
var hr = 0;

function myTimer()
{
  sec++;
  if (sec === 60)
  {
    sec = 0;
    min++;
  }
  if (min === 60)
  {
    min = 0;
    hr++;
  }
  var t = hr + ":" + zeroPad(min,2) + ":" + zeroPad(sec,2); 
  document.getElementById("timer").innerHTML=t;
}

function zeroPad(num, places)
{
  var zero = places - num.toString().length + 1;
  return Array(+(zero > 0 && zero)).join("0") + num;
}

function start()
{
  var button = document.getElementById("newGame");
  button.addEventListener( "click", startNewGame, false );
  var buttonClearBoard = document.getElementById("clearBoard");
  buttonClearBoard.addEventListener( "click", clearBoard, false );
  var buttonSolvePuzzle = document.getElementById("solvePuzzle");
  buttonSolvePuzzle.addEventListener( "click", solvePuzzle, false );
  var buttonUndo = document.getElementById("undo");
  buttonUndo.addEventListener( "click", undo, false );
  displayPossibleNumbers = document.getElementById("possibleNumbers");
  sudokuTable = document.getElementById("sudoku");
  displayWhereNumbersCannotGo = document.getElementById("showWhereNumbersCannotGo");
  startNewGame();
}

function startNewGame()
{
  var arrayOfNumbers = new Array();
  var arrayHasNumberBeenUsed;
  var randomNumber = 0;
  var count = 0;
  var secondChanceAttempts = 0;
  sec = 0;
  min = 0;
  hr = 0;
  
  // If the timer has already been set,
  // clear the timer.
  $("#timer").html("0:00:00");
  if (timeClock)
  {
    window.clearInterval(timeClock);
  }
  timeClock = setInterval(function(){myTimer();},1000);
  
  // If the winner has already won,
  // stop all animation.
  if (mostrar)
  {
    window.clearInterval(mostrar);
  }
  $("#sudoku").removeClass();
  
  // Set color back to black.
  color("black");
 
  arrayOfNumberPlacements = new Array();
  displayPossibleNumbers.innerHTML = "<br />";
 
  // Create the proper board size.
  arrayForBoard = new Array(rows);
  arrayForDisplayBoard = new Array(rows);
  arrayForEditableNumbers = new Array(rows);
  arrayOfBlack = new Array(rows);
  arrayOfRed = new Array(rows);
  arrayOfGreen = new Array(rows);
  arrayOfBlue = new Array(rows);
  arrayOfPurple = new Array(rows);
  for (var i = 0; i < rows; i++)
  {
    arrayForBoard[i] = new Array(columns);
    arrayForDisplayBoard[i] = new Array(columns);
    arrayForEditableNumbers[i] = new Array(columns);
    arrayOfBlack[i] = new Array(columns);
    arrayOfRed[i] = new Array(columns);
    arrayOfGreen[i] = new Array(columns);
    arrayOfBlue[i] = new Array(columns);
    arrayOfPurple[i] = new Array(columns);   
  }
 
  // initialize the board.
  for (var i = 0; i < rows; i++)
  {
    for (var j = 0; j < columns; j++)
    {
      arrayForBoard[i][j] = 0;
      arrayForDisplayBoard[i][j] = 0;
      arrayForEditableNumbers[i][j] = 0;
      arrayOfBlack[i][j] = 0;
      arrayOfRed[i][j] = 0;
      arrayOfGreen[i][j] = 0;
      arrayOfBlue[i][j] = 0;
      arrayOfPurple[i][j] = 0;    
   }
  }
  
  // Determine which numbers will be displayed.
  configureDisplayBoard();

  // Assign random numbers to the board.
  for (var i = 0; i < rows; i++) 
  {
    var numberOfAttempts = 0;
    for (var j = 0; j < columns; j++)
    {
      randomNumber = Math.floor(Math.random()*rows) + 1;

      if (isNumberAlreadyUsedInColumn(j, randomNumber, arrayForBoard) )
      {
	j--;
	numberOfAttempts++;
      }
      else if (isNumberAlreadyUsedInRow(i, randomNumber, arrayForBoard) )
      {
	j--;
	numberOfAttempts++;
      }
      else if (isNumberAlreadyUsedInSection(i, j, randomNumber, arrayForBoard) )
      {
	j--;
	numberOfAttempts++;
      }
      else
      {
	arrayForBoard[i][j] = randomNumber;
	numberOfAttempts = 0;
      } // end else
     
     // If the random number generator 
     // is stuck, give it a nudge.
     if (numberOfAttempts > 18)
     {
       j++;
       for (var m = 0; m < rows; m++)
       {
	 arrayOfNumbers[m] = 0;
       }
       
       // Mark off every single number that cannot be in this section.
       for (var m = 0; m < rows; m++)
       {
	 if (isNumberAlreadyUsedInSection(i, j, m+1, arrayForBoard))
	 {
	    arrayOfNumbers[m] = 1;
	 }
	 else if (isNumberAlreadyUsedInRow(i, m+1, arrayForBoard))
	 {
	    arrayOfNumbers[m] = 1;
	 }
	 else if (isNumberAlreadyUsedInColumn(j, m+1, arrayForBoard))
	 {
	    arrayOfNumbers[m] = 1;
	 }
       } // end for (var m = 0; m < rows; m++)
       
       // Pick the first number that is not used.
       for (var m = 0; m < rows; m++)
       {
	  if (arrayOfNumbers[m] === 0)
	  {
	    arrayForBoard[i][j] = m + 1;
	    m = rows + 1;
	    secondChanceAttempts = 0;
	  }
       }
       if (arrayForBoard[i][j] === 0)
       {
	 // Set the current row back to zero and try again.
	 for (var m = 0; m < rows; m++)
	 {
	    arrayForBoard[i][m] = 0;
	 }
	 j = -1;
	 secondChanceAttempts++;
       }
       numberOfAttempts = 0;       
     } // end if (numberOfAttempts > 18)
     
     // if we are at a stalemate, start over completely.
     if (secondChanceAttempts > 10)
     {
         // initialize the board.
	for (var m = 0; m < rows; m++)
	{
	  for (var n = 0; n < columns; n++)
	  {
	    arrayForBoard[m][n] = 0;
	  }
	}
	j = -1;
	i = 0;
	secondChanceAttempts = 0;
     }
    } // end for (var j = 0; j < columns; j++)
  } // end for (var i = 0; i < rows; i++)
  
  // Display the numbers.
  for (var i = 0; i < rows; i++)
  {
    for (var j = 0; j < columns; j++)
    {
      if (arrayForDisplayBoard[i][j] > 0)
      {
	arrayForDisplayBoard[i][j] = arrayForBoard[i][j];
	arrayForEditableNumbers[i][j] = 1;
      }
    }
  }
   
  showTable();
  showWhereNumbersCannotGo(0);
}

function clearBoard()
{
  for (var i = 0; i < rows; i++)
  {
    for (var j = 0; j < columns; j++)
    {
      if (arrayForEditableNumbers[i][j] > 0)
      {
	arrayForDisplayBoard[i][j] = arrayForBoard[i][j];
      }
      else 
      {
	arrayForDisplayBoard[i][j] = 0;
      }
      arrayOfBlack[i][j] = 0;
      arrayOfRed[i][j] = 0;
      arrayOfGreen[i][j] = 0;
      arrayOfBlue[i][j] = 0;
      arrayOfPurple[i][j] = 0; 
    }
  }
  arrayOfNumberPlacements = new Array(); 
  showTable();
}

function solvePuzzle()
{
  for (var i = 0; i < rows; i++)
  {
    for (var j = 0; j < columns; j++)
    {
      arrayForDisplayBoard[i][j] = arrayForBoard[i][j];
    }
  }
   
  showTable();  
}

function showTable()
{
  var outputString = "";
  var numberForDisplay = "";
  var cssClass = "";
  for (var i = 0; i < rows; i++)
  {
    outputString += "<tr>";
    for (var j = 0; j < columns; j++)
    {
      var cssStyle = "";
      
      // Color the number appropriately.
      if (arrayOfBlack[i][j] === 1)
      {
	cssStyle += "color: black; "
      }
      else if (arrayOfRed[i][j] === 1)
      {
	cssStyle += "color: red; "
      }
      else if (arrayOfGreen[i][j] === 1)
      {
	cssStyle += "color: green; "
      }
      else if (arrayOfBlue[i][j] === 1)
      {
	cssStyle += "color: blue; "
      }
      else if (arrayOfPurple[i][j] === 1)
      {
	cssStyle += "color: purple; "
      }
      
      // Check if the number at this coordinate should be displayed.
      if (arrayForDisplayBoard[i][j] > 0)
      {
	numberForDisplay = arrayForDisplayBoard[i][j];
      }
      else 
      {
	numberForDisplay = " ";
      }
            
      // Add appropriate CSS class to the tile.
      if ( ( (i < 3 || i > 5) && (j > 2 && j < 6) ) ||
	   ( (i > 2 && i < 6) && (j < 3 || j > 5) )
      )
      {
	if (arrayForEditableNumbers[i][j] === 0)
	{
	  cssClass = "square";
	}
	else
	{
	  cssClass = "squareNoPointer";
	  cssStyle += "font-weight: bold;";
	}
      }
      else
      {
	if (arrayForEditableNumbers[i][j] === 0)
	{
	  cssClass = "tile";
	}
	else
	{
	  cssClass = "tileNoPointer";
	  cssStyle += "font-weight: bold;";
	}
      }
      
      outputString += "<td id=\"row" + i + "col" + j + "\" class=\"" + cssClass + "\" onclick=\"onClickNumber(" + i + ", " + j + ")\"" + "style=\"" + cssStyle + "\"" + ">" + numberForDisplay + "</td>";
    } // end for (var j = 0; j < columns; j++)
    outputString += "</tr>";
  } // end for (var i = 0; i < rows; i++)
  
  sudokuTable.innerHTML = outputString;
}

function showWhereNumbersCannotGo(inputNumber)
{
  var cssClass = "";
  displayWhereNumbersCannotGo.innerHTML = "Show Where Number Cannot Go:<br/>";
  for (var i = 1; i <= rows; i++)
  {
    if (inputNumber === i)
    {
      cssClass = "possibleNumbersHighlight";
    }
    else
    {
      cssClass = "possibleNumbers";
    }    
    displayWhereNumbersCannotGo.innerHTML +=  "<span onclick=\"blockNumber(" + i + ")\" class=\"" + cssClass + "\">" + i + "</span> ";
  }
  cssClass = "possibleNumbers";
  displayWhereNumbersCannotGo.innerHTML += "<span onclick=\"hideWhereNumbersCannotGo()\" class=\"" + cssClass + "\">None</span>"
}

function hideWhereNumbersCannotGo()
{
  showWhereNumbersCannotGo(0);
  showTable();
}

function undo()
{
  if (arrayOfNumberPlacements.length > 0)
  {
    var undoRecord = arrayOfNumberPlacements.pop();
    splitRecord = undoRecord.split(":");
    var coordinates = splitRecord[0].split(",");
    var numbersToUndo = splitRecord[1].split(",");
    
    arrayForDisplayBoard[coordinates[0]][coordinates[1]] = numbersToUndo[0];
    showTable();
  }
}

function winnerShowAlternatingRainbow() {
    // Replace the classes.
    c=0; 
    for(var i=0;i<9;i++){
          for(var j=0;j<9;j++){
              $("#row"+i+"col"+j).removeClass();
              if(c%2==0){
                $("#row"+i+"col"+j).addClass("winner1")
              }
              else{
                 $("#row"+i+"col"+j).addClass("winner2") 
              }
              c++;
          }
    }  
}

function winnerShowBlueWave() {
    // Replace the classes.
    c=0; 
    for(var i=0;i<9;i++){
          for(var j=0;j<9;j++){
              $("#row"+i+"col"+j).removeClass();
              $("#row"+i+"col"+j).addClass("blue"+((c)%10)) 
              c++;
          }
    }  
}

function winnerShowSpin() {
    $("#sudoku").addClass("winner3");
}

function winnerShowTarget() {
    // OuterEdges
    for (var i = 0; i < 9; i++) {
        $("#row0col"+i).removeClass();
        $("#row0col"+i).addClass("ryb1");
        $("#row"+i+"col0").removeClass();
        $("#row"+i+"col0").addClass("ryb1");
        $("#row8col"+i).removeClass();
        $("#row8col"+i).addClass("ryb1");
        $("#row"+i+"col8").removeClass();
        $("#row"+i+"col8").addClass("ryb1");
    }
    
    // Second row
    for (var i = 1; i < 8; i++) {
        $("#row1col"+i).removeClass();
        $("#row1col"+i).addClass("ryb2");
        $("#row"+i+"col1").removeClass();
        $("#row"+i+"col1").addClass("ryb2");
        $("#row7col"+i).removeClass();
        $("#row7col"+i).addClass("ryb2");
        $("#row"+i+"col7").removeClass();
        $("#row"+i+"col7").addClass("ryb2");
    }
    
    // Third row
    for (var i = 2; i < 7; i++) {
        $("#row2col"+i).removeClass();
        $("#row2col"+i).addClass("ryb3");
        $("#row"+i+"col2").removeClass();
        $("#row"+i+"col2").addClass("ryb3");
        $("#row6col"+i).removeClass();
        $("#row6col"+i).addClass("ryb3");
        $("#row"+i+"col6").removeClass();
        $("#row"+i+"col6").addClass("ryb3");
    }
        
    // Fourth row
    for (var i = 3; i < 6; i++) {
        $("#row3col"+i).removeClass();
        $("#row3col"+i).addClass("ryb4");
        $("#row"+i+"col3").removeClass();
        $("#row"+i+"col3").addClass("ryb4");
        $("#row5col"+i).removeClass();
        $("#row5col"+i).addClass("ryb4");
        $("#row"+i+"col5").removeClass();
        $("#row"+i+"col5").addClass("ryb4");
    }
    
    // Center
    $("#row4col4").removeClass();
    $("#row4col4").addClass("ryb5");
    
    $("#sudoku").addClass("winner3");
}

function winnerShowSpinCell() {
    $("#sudoku td").addClass("winner4");
}

function winnerShowSpinRow() {
    $("#sudoku tr").addClass("winner4");
}

function displayShowForWinner()
{
    // Put on a show for the winner.
    whichShow = Math.floor(Math.random()*8);
    switch(whichShow) {
        case 0:
            winnerShowAlternatingRainbow();
            break;
        case 1:
            winnerShowBlueWave();
            break;
        case 2:
            winnerShowSpin();
            break;
        case 3:
            winnerShowTarget();
            break;
        case 4:
            winnerShowSpinCell();
            break;
        case 5:
            winnerShowSpinRow();
            break;
        case 6:
            winnerShowSpin();
            winnerShowSpinCell();
            break;
        case 7:
            winnerShowAlternatingRainbow();
            winnerShowSpinCell();
            break;
        default:
            winnerShowSpin();
    }
    
  // Display the time it took to finish the puzzle.  
  var stringOfTime = "";
  if (hr > 1)
  {
    stringOfTime += hr.toString() + " hours";
  }
  else if (hr > 0)
  {
    stringOfTime += hr.toString() + " hour";
  }
  if ( hr > 0 && (min > 0 || sec > 0) )
  {
    stringOfTime += ", ";
  }
  if (min > 1)
  {
    stringOfTime += min.toString() + " minutes";
  }
  else if (min > 0)
  {
    stringOfTime += min.toString() + " minute";
  }
  if ( min > 0 && sec > 0 )
  {
    stringOfTime += ", ";
  }
  if (sec > 1)
  {
    stringOfTime += sec.toString() + " seconds";
  }
  else if (sec > 0)
  {
    stringOfTime += sec.toString() + " second";
  }
  window.clearInterval(timeClock);
  $("#possibleNumbers").html("Congratulations! You solved the puzzle in " + stringOfTime + ".<br/>");
}

function onClickChangeNumber(rowCoord, colCoord, inputNumber)
{
  hideWhereNumbersCannotGo();
  var pushThis = rowCoord.toString() + "," + colCoord.toString() + ":" + arrayForDisplayBoard[rowCoord][colCoord].toString() + "," + inputNumber.toString();
  arrayOfNumberPlacements.push(pushThis);
      arrayForDisplayBoard[rowCoord][colCoord] = inputNumber;

  if (inputNumber === 0)
  {
    //arrayForDisplayBoard[rowCoord][colCoord] = 0;
    arrayOfBlack[rowCoord][colCoord] = 0;
    arrayOfRed[rowCoord][colCoord] = 0;
    arrayOfGreen[rowCoord][colCoord] = 0;
    arrayOfBlue[rowCoord][colCoord] = 0;
    arrayOfPurple[rowCoord][colCoord] = 0;
  }
  else
  {
    
    if ($('#color').val() == 'black')
    {
      arrayOfBlack[rowCoord][colCoord] = 1;
      arrayOfRed[rowCoord][colCoord] = 0;
      arrayOfGreen[rowCoord][colCoord] = 0;
      arrayOfBlue[rowCoord][colCoord] = 0;
      arrayOfPurple[rowCoord][colCoord] = 0; 
    }
    else if ($('#color').val() == 'red')
    {
      arrayOfBlack[rowCoord][colCoord] = 0;
      arrayOfRed[rowCoord][colCoord] = 1;
      arrayOfGreen[rowCoord][colCoord] = 0;
      arrayOfBlue[rowCoord][colCoord] = 0;
      arrayOfPurple[rowCoord][colCoord] = 0; 
    }
    else if ($('#color').val() == 'green')
    {
      arrayOfBlack[rowCoord][colCoord] = 0;
      arrayOfRed[rowCoord][colCoord] = 0;
      arrayOfGreen[rowCoord][colCoord] = 1;
      arrayOfBlue[rowCoord][colCoord] = 0;
      arrayOfPurple[rowCoord][colCoord] = 0; 
    }
    else if ($('#color').val() == 'blue')
    {
      arrayOfBlack[rowCoord][colCoord] = 0;
      arrayOfRed[rowCoord][colCoord] = 0;
      arrayOfGreen[rowCoord][colCoord] = 0;
      arrayOfBlue[rowCoord][colCoord] = 1;
      arrayOfPurple[rowCoord][colCoord] = 0; 
    }
    else if ($('#color').val() == 'purple')
    {
      arrayOfBlack[rowCoord][colCoord] = 0;
      arrayOfRed[rowCoord][colCoord] = 0;
      arrayOfGreen[rowCoord][colCoord] = 0;
      arrayOfBlue[rowCoord][colCoord] = 0;
      arrayOfPurple[rowCoord][colCoord] = 1; 
    }  
  }
  displayPossibleNumbers.innerHTML = "<br />";
  showTable();
  if (isPuzzleSolved())
  {
    displayShowForWinner();
  }
}

function onClickNumber(rowCoord, colCoord)
{
  showTable();
  showWhereNumbersCannotGo(0);
  var idString = "row" + rowCoord.toString() + "col" + colCoord.toString();
  var listOfPossibleNumbers = new Array();
  numberWithEvent = document.getElementById(idString);
  
  if (arrayForEditableNumbers[rowCoord][colCoord] === 0)
  {
    // Look for all possible numbers.
    for (var i = 1; i  <= rows; i++)
    {
      if (!isNumberAlreadyUsedInColumn(colCoord, i, arrayForDisplayBoard) && 
	!isNumberAlreadyUsedInRow(rowCoord, i, arrayForDisplayBoard) && 
	!isNumberAlreadyUsedInSection(rowCoord, colCoord, i, arrayForDisplayBoard)
      )
      {
	listOfPossibleNumbers.push(i);
      }
    }
    
    // Display all possible numbers for input.
    // The user clicks on these numbers for input.
    var stringOfPossibleNumbers = "";
    for (var i = 0; i  < listOfPossibleNumbers.length; i++)
    {
      stringOfPossibleNumbers += "<span class=\"possibleNumbers\" onclick=\"onClickChangeNumber(" + rowCoord + ", " + colCoord + ", " + listOfPossibleNumbers[i] + ")\">" + listOfPossibleNumbers[i] + "</span> ";
    }
    stringOfPossibleNumbers += "<span class=\"possibleNumbers\" onclick=\"onClickChangeNumber(" + rowCoord + ", " + colCoord + ", 0)\">Erase</span><br />";
    
    displayPossibleNumbers.innerHTML = stringOfPossibleNumbers;
    
    // Differentiate the selected box from others.
    numberWithEvent.setAttribute("class","blank");
    
  } // end if (arrayForEditableNumbers[rowCoord][colCoord] === 0)
}

function isNumberAlreadyUsedInSection(rowCoord, colCoord, rNum, passedArray)
{
  var sectionRow = getSectionNumber(rowCoord);
  var sectionColumn = getSectionNumber(colCoord);
  for (var k = 0; k < 3; k++)
  {
    for (var l = 0; l < 3; l++)
    {
      if (passedArray[(sectionRow * 3) + k][(sectionColumn * 3) + l] === rNum)
      {
	return true;
      }
    }
  }
  return false;
}

function isNumberAlreadyUsedInRow(rowCoord, rNum, passedArray)
{
  for (var k = 0; k < rows; k++)
  {
    if (passedArray[rowCoord][k] === rNum) 
    {
      return true;      
    }
  }
  return false;
}

function isNumberAlreadyUsedInColumn(colCoord, rNum, passedArray)
{
  for (var k = 0; k < rows; k++)
  {
    if (passedArray[k][colCoord] === rNum) {
      return true;      
    }
  }
  return false;
}

function isNumberOtherwiseUsedInSection(rowCoord, colCoord, rNum, passedArray)
{
  var sectionRow = getSectionNumber(rowCoord);
  var sectionColumn = getSectionNumber(colCoord);
  for (var k = 0; k < 3; k++)
  {
    for (var l = 0; l < 3; l++)
    {
      if (passedArray[(sectionRow * 3) + k][(sectionColumn * 3) + l] === rNum)
      {
	if ( (sectionRow * 3) + k != rowCoord)
	{
	  return true;
	}
      }
    }
  }
  return false;
}

function isNumberOtherwiseUsedInRow(rowCoord, colCoord, rNum, passedArray)
{
  for (var k = 0; k < rows; k++)
  {
    if (passedArray[rowCoord][k] === rNum) 
    {
      if (k != colCoord)
      {
	return true;      
      }
    }
  }
  return false;
}

function isNumberOtherwiseUsedInColumn(rowCoord, colCoord, rNum, passedArray)
{
  for (var k = 0; k < rows; k++)
  {
    if (passedArray[k][colCoord] === rNum)
    {
      if (k != rowCoord)
      {
	return true;      
      }
    }
  }
  return false;
}

function blockNumber(inputNumber)
{
  var outputString = "";
  var numberForDisplay = "";
  var cssClass = "";
  for (var i = 0; i < rows; i++)
  {
    outputString += "<tr>";
    for (var j = 0; j < columns; j++)
    {
      var cssStyle = "";
      
      // Check if the number at this coordinate should be displayed.
      if (arrayForDisplayBoard[i][j] > 0)
      {
	numberForDisplay = arrayForDisplayBoard[i][j];
      }
      else 
      {
	numberForDisplay = " ";
      }
            
      // Add appropriate CSS class to the tile.
      if ( ( (i < 3 || i > 5) && (j > 2 && j < 6) ) ||
	   ( (i > 2 && i < 6) && (j < 3 || j > 5) )
      )
      {
	if (arrayForEditableNumbers[i][j] === 0)
	{
	  cssClass = "square";
	  cssStyle = "";
	}
	else
	{
	  cssClass = "squareNoPointer";
	  cssStyle = " style=\"font-weight: bold;\"";
	}
      }
      else
      {
	if (arrayForEditableNumbers[i][j] === 0)
	{
	  cssClass = "tile";
	  cssStyle = "";
	}
	else
	{
	  cssClass = "tileNoPointer";
	  cssStyle = " style=\"font-weight: bold;\"";
	}
      }
      
      // alter tiles if the inputNumber is in this row, column, or section.
      if ((isNumberAlreadyUsedInColumn(j, inputNumber, arrayForDisplayBoard) ||
	isNumberAlreadyUsedInRow(i, inputNumber, arrayForDisplayBoard) ||
	isNumberAlreadyUsedInSection(i, j, inputNumber, arrayForDisplayBoard)) || 
        (arrayForDisplayBoard[i][j] != 0 )
      )
      {
	if ( ( (i < 3 || i > 5) && (j > 2 && j < 6) ) ||
	( (i > 2 && i < 6) && (j < 3 || j > 5) )
	)
	{
	  cssClass = "blockedByNumber1";
	}
	else
	{
	  cssClass = "blockedByNumber2";
	}
      }
      
      outputString += "<td id=\"row" + i + "col" + j + "\" class=\"" + cssClass + "\" onclick=\"onClickNumber(" + i + ", " + j + ")\"" + cssStyle + ">" + numberForDisplay + "</td>";
    } // end for (var j = 0; j < columns; j++)
    outputString += "</tr>";
  } // end for (var i = 0; i < rows; i++)
  
  sudokuTable.innerHTML = outputString;
  showWhereNumbersCannotGo(inputNumber);
}

function getSectionNumber(coordinate)
{
  switch (coordinate) {
      case 0:
      case 1:
      case 2:
	  return 0;
	  break;
      case 3:
      case 4:
      case 5:
	  return 1;
	  break;
      case 6:
      case 7:
      case 8:
	  return 2;
	  break;
      default:
	  alert("Error in switch (coordinate). coordinate = " + coordinate );
	  break;
  }
  return 0;  
}

function assessDifficultyLevel()
{
  return parseInt($("#difficulty").val());
}

function isPuzzleSolved()
{
  for (var i = 0; i < rows; i++)
  { 
    for (var j = 0; j < columns; j++)
    {
      if (isNumberOtherwiseUsedInSection(i, j, arrayForDisplayBoard[i][j], arrayForDisplayBoard) ||
	isNumberOtherwiseUsedInRow(i, j, arrayForDisplayBoard[i][j], arrayForDisplayBoard) ||
	isNumberOtherwiseUsedInColumn(i, j, arrayForDisplayBoard[i][j], arrayForDisplayBoard) ||
	arrayForDisplayBoard[i][j] < 1
      )
      {
	return false;
      }      
    }
  }
  return true;
}

function configureDisplayBoard()
{
  // initialize the board.
  for (var i = 0; i < rows; i++)
  {
    for (var j = 0; j < columns; j++)
    {
      arrayForDisplayBoard[i][j] = 0;
    }
  }
  
  // Pick how many numbers appear in the center column.
  var numberOfColumnNumbers = Math.floor(Math.random()*4);
  
  // Mark which numbers to display on half of the board.
  for (var i = 0; i < Math.floor(assessDifficultyLevel() ) / 2 - numberOfColumnNumbers; i++)
  {
    var rowCoord = Math.floor(Math.random()*9);
    var colCoord = Math.floor(Math.random()*4);
    //alert(arrayForDisplayBoard[rowCoord][colCoord]);
    if (arrayForDisplayBoard[rowCoord][colCoord] === 0)
    {
      arrayForDisplayBoard[rowCoord][colCoord] = 1;
    }
    else
    {
      i--;
    }
  } 

  // Mirror the displayed numbers.
  for (var i = 0, z = rows - 1; i < rows; i++, z--)
  {
    for (var j = 0, y = columns - 1; j < Math.floor(columns / 2); j++, y--)
    {
	if (arrayForDisplayBoard[i][j] > 0)
	{
	  arrayForDisplayBoard[z][y] = 1;
	}
    }
  }
  
  // Display numbers in the center column.
  for (var i = 3; i < 8 && numberOfColumnNumbers > 0; i++)
  {
    arrayForDisplayBoard[i][Math.floor(columns / 2)] = 1;
    numberOfColumnNumbers--;
  }
 
}

function debug(twoDArray)
{
      var dkdksf = "";
  for (var i = 0; i < rows; i++)
  {
    for (var j = 0; j < columns; j++)
    {
      dkdksf += twoDArray[i][j] + " ";
    }
    dkdksf += "\n";
  }
  alert(dkdksf);

}

window.addEventListener( "load", start, false ); // This event listener makes the function start() execute when the window opens. 