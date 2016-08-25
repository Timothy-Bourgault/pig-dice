$(document).ready(function(){

  function GameState() {
    this.winningScore = 100;
    this.maxRobotRolls = 2;
    this.maxRobotPoints = 15;
    this.currentTotal = 0;
    this.currentPlayer = 0;
    this.numDie = 1;
    this.players = [];
    //this.compPlayers =[];
  }

  GameState.prototype.resetData = function() {
    for(var i=0; i<this.players.length; ++i){
      this.players[i].score = 0;
    }
    this.currentPlayer = 0;
    this.currentTotal = 0;
  }

  function Die(numSides) {
    this.numSides = numSides;
    this.currentValue = 1;
  }

  Die.prototype.roll = function() {
    this.currentValue = Math.floor(Math.random() * this.numSides) + 1;
    return(this.currentValue);
  }

  function Player(name) {
    this.name = name;
    this.score = 0;
    this.lastRoll =[];
    this.wins = 0;
    this.isHuman = true;
    this.flag = "#" + name + "Flag";
    this.scoreOutput = "#" + name + "Score";
  }

  Player.prototype.rollDice = function() {
    var roll = [];
    for(var i=0; i<game.numDie; ++i){
      roll.push(die.roll());
    }
    $("#d1Output").text(roll);
    game.players[game.currentPlayer].lastRoll = roll;

    if(roll.indexOf(1) > -1){   // Player rolled a One
      game.currentTotal = 0;
      updateTotal(game.currentTotal);
      return false;
    }
    else {
      var total = 0;
      for(var i=0; i<roll.length; ++i){
        total += roll[i];
      }
      game.currentTotal = game.currentTotal + total;
      updateTotal(game.currentTotal);
    }
    return(true);
  }

  Player.prototype.hold = function() {

      //update the players score
      game.players[game.currentPlayer].score += game.currentTotal;
      $(game.players[game.currentPlayer].scoreOutput).text(game.players[game.currentPlayer].score);

      if(game.players[game.currentPlayer].score  >= game.winningScore) {
        $(game.players[game.currentPlayer].flag).css({"color": "blue"});

        //$("#p2flag").css({"color": "blue"});
        $("#p2Wins").css({"display": "inline"});
        $("#rollButton").css({"display": "none"});
        $("#holdButton").css({"display": "none"});
      }
      else {
        game.currentTotal = 0;
        updateTotal(game.currentTotal);
        $("#rollButton").prop('disabled', false);
        toggleTurn();
        if(game.players[game.currentPlayer].isHuman === false) {
          robotTurn();
        }
      }
  }

  function addPlayer(game, name) {
    var newPlayer = new Player(name);
    game.players.push(newPlayer);
  }

  function robotTurn(){
    $("#holdButton").prop('disabled', true);
    $("#rollButton").prop('disabled', true);

    // Roll Twice
    var i=0;
    var temp;
    do {
      temp = game.players[game.currentPlayer].rollDice();
      ++i;
    } while(i<game.maxRobotRolls && temp)

    $("#rollButton").prop('disabled', false);

    // Hold if One wasn't rolled else toggleTurn
    if(temp) {
      game.players[game.currentPlayer].hold();
    } else {
      toggleTurn();
    }

    //while(advRobotRoll());


  };


  function advRobotRoll(){

     if(game.currentTotal <= 15 && !game.players[game.currentPlayer].isHuman) {


      if(roll.indexOf(1) > -1)   // Player rolled a One
         return true;
      else
        return false;
     }
     else {
        game.players[game.currentPlayer].hold();
        return false;
     }
   }

  // UI
  var game = new GameState();
  var die = new Die(6);
  addPlayer(game, "Rick");
  addPlayer(game, "Steve");
  game.players[1].isHuman = true;

  game.resetData();
  resetBoard();


  function toggleTurn(){
    $("#holdButton").prop('disabled', true);
    if(++game.currentPlayer >= game.players.length)
      game.currentPlayer = 0;

    for(var i=0; i<game.players.length; ++i) {
      if(game.currentPlayer === i)
        $(game.players[i].flag).css({"color": "green"});
      else
        $(game.players[i].flag).css({"color": "red"});
    }
  }

  $("#resetButton").click(function(event){
    game.resetData();
    resetBoard();
  });

  function resetBoard(){
    $(game.players[0].flag).css({"color": "green"});
    $(game.players[1].flag).css({"color": "red"});
    $("#RickScore").text(0);
    $("#SteveScore").text(0);
    $("#d1Output").text("-");
    $("#totalOutput").text(0);
    $("#p1Wins").css({"display": "none"});
    $("#p2Wins").css({"display": "none"});
    $("#holdButton").prop('disabled', true);
    $("#rollButton").prop('disabled', false);
  }

  $("#rollButton").click(function(event){
    $("#holdButton").prop('disabled', false);

    // Roll Dice, returns false if a one is rolled
    if(!game.players[game.currentPlayer].rollDice()) {
      toggleTurn();

      // Start robot turn if next player is one
      if(!game.players[game.currentPlayer].isHuman)
        robotTurn();
    }
    event.preventDefault();
  });

  $("#holdButton").click(function(event){
    game.players[game.currentPlayer].hold();
  });

  function updateTotal(newTotal){
      $("#totalOutput").text(newTotal);
  }















});
