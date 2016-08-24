$(document).ready(function(){

// Business Logic
  var gameState = {
    currentTotal: 0,
    player2Comp: true,
    playerTurn: "player1"
  };

  function Player(name) {
    this.name = name;
    this.score = 0;
    this.wins = 0;
  }

  function resetData(){
    player1.score = 0;
    player2.score = 0;
    gameState.playerTurn = "player1";
    gameState.currentTotal = 0;
  }

  function rollDie(){
    return(Math.floor(Math.random() * 6) + 1)
  };

  function rollDice(){
    var roll = [];
    roll[0] = rollDie();
    roll[1] = rollDie();

    //console.log(roll[0] + " : " + roll[1] + " : " + gameState.playerTurn);

    if(roll[0] === 1 || roll[1] === 1){
      gameState.currentTotal = 0;
      updateTotal(gameState.currentTotal);
      toggleTurn();
      if (gameState.playerTurn === "player2" && gameState.player2Comp) {
        computerTurn();
      }

    }
    else {
      gameState.currentTotal = gameState.currentTotal + roll[0] + roll[1];
      updateTotal(gameState.currentTotal);
    }
    return(roll);
  };


  function computerRoll(){

     if(gameState.currentTotal <= 15 && gameState.playerTurn === "player2") {
          var rollResult = rollDice();
          printDice(rollResult[0], rollResult[1]);
          if(rollResult[0] === 1 || rollResult[1] === 1){
            return false;
          }
          else {
            return true;
          }
     }
     else {
        hold();
        return false;
     }
   };

  function printDice(val1, val2) {
    $("#d1Output").text(val1);
    $("#d2Output").text(val2);
    //console.log("rollResult " + val1 + " : " + val2);
  };

  //Initialize Players and board
  var player1 = new Player("player1");
  var player2 = new Player("player2");
  resetBoard();

  // User Interface
  function computerTurn(){
    $("#holdButton").prop('disabled', true);
    $("#rollButton").prop('disabled', true);

    while(computerRoll());


    $("#rollButton").prop('disabled', false);
  };

  function toggleTurn(){
    $("#holdButton").prop('disabled', true);

    if (gameState.playerTurn === "player1") {
      gameState.playerTurn = "player2";
      $("#p1flag").css({"color": "red"});
      $("#p2flag").css({"color": "green"});
    }
    else if(gameState.playerTurn === "player2") {
      gameState.playerTurn = "player1";
      $("#p1flag").css({"color": "green"});
      $("#p2flag").css({"color": "red"});
      }
  };

  function updateTotal(newTotal){
      $("#totalOutput").text(newTotal);
  };

  function resetBoard(){
    $("#p1flag").css({"color": "green"});
    $("#p2flag").css({"color": "red"});
    $("#p1ScoreOutput").text(player1.score);
    $("#p2ScoreOutput").text(player2.score);
    $("#d1Output").text("-");
    $("#d2Output").text("-");
    $("#totalOutput").text(0);
    $("#p1Wins").css({"display": "none"});
    $("#p2Wins").css({"display": "none"});
    $("#holdButton").prop('disabled', true);
    $("#rollButton").prop('disabled', false);
  };

  $("#resetButton").click(function(event){
    resetData();
    resetBoard();
  });

  $("#rollButton").click(function(event){
    $("#holdButton").prop('disabled', false);
    var temp = rollDice();
    printDice(temp[0], temp[1]);
    event.preventDefault();
  });

  function hold(){

    if(gameState.playerTurn === "player1") {
      player1.score = player1.score + gameState.currentTotal;
      $("#p1ScoreOutput").text(player1.score);
      if(player1.score>=50) {
        $("#p1flag").css({"color": "blue"});
        $("#p1Wins").css({"display": "inline"});
        $("#rollButton").css({"display": "none"});
        $("#holdButton").css({"display": "none"});
      }
      else {
        gameState.currentTotal = 0;
        $("#totalOutput").text(gameState.currentTotal);
        toggleTurn();
        if(gameState.player2Comp === true) {
          computerTurn();
        }
      }
    }
    // Player2
    else  {
      player2.score = player2.score + gameState.currentTotal;
      $("#p2ScoreOutput").text(player2.score);
      if(player2.score>=50) {
        $("#p2flag").css({"color": "blue"});
        $("#p2Wins").css({"display": "inline"});
        $("#rollButton").css({"display": "none"});
        $("#holdButton").css({"display": "none"});
      }
      else {
        gameState.currentTotal = 0;
        $("#totalOutput").text(gameState.currentTotal);
        $("#rollButton").prop('disabled', false);
        toggleTurn();
      }
    }
  };

  $("#holdButton").click(function(event){
    hold();
  });

});
