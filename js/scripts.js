$(document).ready(function(){


// Business Logic
  var gameState = {
    currentTotal: 0,
    die1: null,
    die2: null,
    player1Turn: true,
    player2Comp: true
  };

  function rollDie(){
    return(Math.floor(Math.random() * 6) + 1)
  };

  function rollDice(){
    var roll = [];
    roll[0] = rollDie();
    roll[1] = rollDie();

    if(roll[0] === 1 || roll[1] === 1){
      gameState.currentTotal = 0;
      updateTotal(gameState.currentTotal);
      toggleTurn();
    }
    else {
      gameState.currentTotal = gameState.currentTotal + roll[0] + roll[1];
      updateTotal(gameState.currentTotal);
    }
    return(roll);
  };

  function Player(name) {
    this.name = name;
    this.score = 0;
    this.wins = 0;
  }

  function reset(){
    player1.score = 0;
    player2.score = 0;
    gameState.player1Turn = true;
    gameState.currentTotal = 0;

  }

  function computerTurn(){
    document.getElementById("rollButton").click();
  };


  var player1 = new Player("Player 1");
  var player2 = new Player("Player 1");



  // User Interface

  function toggleTurn(){
    if (gameState.player1Turn) {
      gameState.player1Turn = false;
      $("#p1flag").css({"color": "red"});
      $("#p2flag").css({"color": "green"});
    }
    else {
      gameState.player1Turn = true;
      $("#p1flag").css({"color": "green"});
      $("#p2flag").css({"color": "red"});
      }
  };

  function updateTotal(newTotal){
      $("#totalOutput").text(newTotal);
  };

  $("#resetButton").click(function(event){
    reset();
    $("#p1flag").css({"color": "green"});
    $("#p2flag").css({"color": "red"});
    $("#p1ScoreOutput").text(player1.score);
    $("#p2ScoreOutput").text(player2.score);
    $("#d1Output").text("-");
    $("#d2Output").text("-");
    $("#totalOutput").text(0);
    $("#rollButton").css({"display": "inline"});
    $("#holdButton").css({"display": "inline"});
    $("#p1Wins").css({"display": "none"});
    $("#p2Wins").css({"display": "none"});
  });

  $("#rollButton").click(function(event){
    var temp = rollDice();
    $("#d1Output").text(temp[0]);
    $("#d2Output").text(temp[1]);
    event.preventDefault();
  });

  $("#holdButton").click(function(event){
    if(gameState.player1Turn) {
      player1.score = player1.score + gameState.currentTotal;
      $("#p1ScoreOutput").text(player1.score);
      if(player1.score>=20) {
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
          console.log("test");
        }
      }
    }
    else  {
      player2.score = player2.score + gameState.currentTotal;
      $("#p2ScoreOutput").text(player2.score);
      if(player2.score>=20) {
        $("#p2flag").css({"color": "blue"});
        $("#p2Wins").css({"display": "inline"});
        $("#rollButton").css({"display": "none"});
        $("#holdButton").css({"display": "none"});
      }
      else {
        gameState.currentTotal = 0;
        $("#totalOutput").text(gameState.currentTotal);
        toggleTurn();
      }
    }

    });
});
