$(document).ready(function(){

  var game = new GameState();
  function GameState() {
    this.winningScore = 100;
    this.maxRobotRolls = 2;
    this.maxRobotPoints = 25;
    this.currentTotal = 0;
    this.currentPlayer = 0;
    this.numDie = 2;
    this.numSides = 6;
    this.players = [];

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
    console.log(game.currentPlayer + " Die Rolled: " + this.currentValue);
    return(this.currentValue);
  }

  function Player(name) {
    this.name = name;
    this.score = 0;
    this.lastRoll =[];
    this.wins = 0;
    this.isHuman = true;
    this.robotAiHard = false;
    this.flag = "#" + name + "Flag";
    this.scoreOutput = "#" + name + "Score";
    this.winsOutput = "#" + name + "Wins";
  }

  //Player.prototype.rollDice = function() {
  function rollDice(){
    //debugger;
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

      // Win Logic
      if(game.players[game.currentPlayer].score  >= game.winningScore) {
        $(game.players[game.currentPlayer].flag).css({"color": "blue"});
        $("#p2Wins").css({"display": "inline"}); // Wizard Booty Dance
        $("#rollButton").css({"display": "none"});
        $("#holdButton").css({"display": "none"});
      }
      else {
        game.currentTotal = 0;
        updateTotal(game.currentTotal);
        $("#rollButton").prop('disabled', false);
        advanceTurn();
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

    var i=0;
    var cleanRoll = false;

    // Hard Robot AI
    if(game.players[game.currentPlayer].robotAiHard) {
      do {
        cleanRoll = rollDice();
        ++i;
      } while(i<(game.maxRobotRolls +1) && cleanRoll && game.currentTotal <= game.maxRobotPoints)
    }

    // Easy Robot AI
    else {
      do {
        cleanRoll = rollDice();
        ++i;
      } while(i<game.maxRobotRolls && cleanRoll)
    }

    $("#rollButton").prop('disabled', false);

    // Hold if One wasn't rolled else toggleTurn
    if(cleanRoll) {
      game.players[game.currentPlayer].hold();
    } else {
      advanceTurn();
    }
  };

  // UI
  var die = new Die(game.numSides);
  addPlayer(game, "Rick");
  addPlayer(game, "Steve");
  game.players[1].isHuman = false;
  game.players[1].robotAiHard = true;

  game.resetData();
  resetBoard();


  function advanceTurn(){
    $("#holdButton").prop('disabled', true);
    if(++game.currentPlayer === game.players.length)
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
    //if(!game.players[game.currentPlayer].rollDice()) {
    if(!rollDice()) {
      advanceTurn();
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
