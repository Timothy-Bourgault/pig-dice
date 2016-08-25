$(document).ready(function(){

  var game = new GameState();
  var die = new Die(game.numSides);

  function GameState() {
    this.winningScore = 100;
    this.maxRobotRolls = 2;
    this.maxRobotPoints = 25;
    this.currentTotal = 0;
    this.currentPlayer = 0;
    this.lastRoll = "-";
    this.numDie = 2;
    this.numSides = 6;
    this.players = [];
  }

  GameState.prototype.resetData = function() {
    for(var i=0; i<this.players.length; ++i){
      this.players[i].score = 0;
      this.players[i].lastRoll = "-";
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
    this.wins = 0;
    this.lastRoll = "-";
    this.isHuman = true;
    this.robotAiHard = false;
  }

  //Player.prototype.rollDice = function() {
  function rollDice(){
    //debugger;
    var roll = [];
    for(var i=0; i<game.numDie; ++i){
      roll.push(die.roll());
    }

    $("#currentRoll").text(roll);
    $("#previousRoll").text(game.lastRoll);
    game.lastRoll = roll;
    game.players[game.currentPlayer].lastRoll = roll;

    if(roll.indexOf(1) > -1){   // Player rolled a One
      game.currentTotal = 0;
      updateTotal(game.currentTotal);
      alert(game.players[game.currentPlayer].name + " Crapped Out!!!");
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

      updateScoreboard();

      $(game.players[game.currentPlayer].scoreOutput).text(game.players[game.currentPlayer].score);

      // Win Logic
      if(game.players[game.currentPlayer].score  >= game.winningScore) {

        ++game.players[game.currentPlayer].wins;

        $("#winner_board").slideDown(500);
        $("#game_board").hide(500);
        $("#player_board").hide(500);

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
  function advanceTurn(){
    $("#holdButton").prop('disabled', true);
    if(++game.currentPlayer === game.players.length)
      game.currentPlayer = 0;

    $("#currentPlayer").text(game.players[game.currentPlayer].name);
    $("#currentScore").text(game.players[game.currentPlayer].score);
    $("#pointsToWin").text(game.winningScore - game.players[game.currentPlayer].score);
    $("#currentRoll").text("-");
    $("#previousRoll").text(game.lastRoll);

    for(var i=0; i<game.players.length; ++i) {
      if(game.currentPlayer === i)
        $(game.players[i].flag).css({"color": "green"});
      else
        $(game.players[i].flag).css({"color": "red"});
    }
  }



  function updateScoreboard(){

    // Player 1
    $("#p1name").text(game.players[0].name);
    $("#p1score").text(game.players[0].score);
    $("#p1wins").text(game.players[0].wins);
    $("#p1lastroll").text(game.players[0].lastRoll);

    // Player 2
    $("#p2name").text(game.players[1].name);
    $("#p2score").text(game.players[1].score);
    $("#p2wins").text(game.players[1].wins);
    $("#p2lastroll").text(game.players[1].lastRoll);

    if (game.players.length < 3) {
      $("#p3board").css({"display": "none"});
    }
    else {
      $("#p3name").text(game.players[2].name);
      $("#p3score").text(game.players[2].score);
      $("#p3wins").text(game.players[2].wins);
      $("#p3lastroll").text(game.players[2].lastRoll);

    }
    if (game.players.length < 4) {
      $("#p4board").css({"display": "none"});
    }
    else {
      $("#p4name").text(game.players[3].name);
      $("#p4score").text(game.players[3].score);
      $("#p4wins").text(game.players[3].wins);
      $("#p4lastroll").text(game.players[3].lastRoll);
    }
  }

  $("#rollButton").click(function(event){
    $("#holdButton").prop('disabled', false);
    //debugger;
    // Roll Dice, returns false if a one is rolled

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

  $("#resetButton").click(function(event){
    resetBoard();
    $("#configure_screen").css({"display": "block"});
    $("#game_board").css({"display": "none"});
    $("#player_board").css({"display": "none"});
    $("#winner_board").css({"display": "none"});
  });

  $("#game_board").css({"display": "none"});
  $("#player_board").css({"display": "none"});
  $("#winner_board").css({"display": "none"});

  function resetBoard(){
    game.resetData();

    $("#currentPlayer").text(game.players[game.currentPlayer].name);
    $("#currentScore").text(game.players[game.currentPlayer].score);
    $("#totalOutput").text(0);
    $("#holdButton").prop('disabled', true);
    $("#rollButton").prop('disabled', false);

    updateScoreboard();

  }

  $("#config_fields").submit(function(event){
    var p1Name = $("select#selectplayer1").val();
    var p2Name = $("select#selectplayer2").val();
    var p3Name = $("select#selectplayer3").val();
    var p4Name = $("select#selectplayer4").val();
    var p1Type = parseInt($("select#typeplayer1").val());
    var p2Type = parseInt($("select#typeplayer2").val());
    var p3Type = parseInt($("select#typeplayer3").val());
    var p4Type = parseInt($("select#typeplayer4").val());
    var matchPoint = parseInt($("input#matchpoint").val());
    var numDice = parseInt($("input#dieinput").val());
    var sidesDice = parseInt($('input[name=diesides]:checked').val());

    console.log(numDice + " " + matchPoint + " " + sidesDice);

    addPlayer(game, p1Name);
    addPlayer(game, p2Name);

    if(p3Name === "none")
      $("#p3board").css({"display": "none"});
    else {
      addPlayer(game, p3Name);
      $("#p3board").css({"display": "inline"});
      if(p3Type > 0){
        game.players[2].isHuman = false;
        if(p3Type === 2)
          game.players[2].robotAiHard = true;
      }
    }

    if(p4Name === "none")
      $("#p4board").css({"display": "none"});
    else{
      addPlayer(game, p4Name);
      $("#p3board").css({"display": "inline"});
      if(p4Type > 0){
        game.players[3].isHuman = false;
        if(p4Type === 2)
          game.players[3].robotAiHard = true;
      }
    }

    if(p1Type > 0){
      game.players[0].isHuman = false;
      if(p1Type === 2)
        game.players[0].robotAiHard = true;
    }
    if(p2Type > 0){
      game.players[1].isHuman = false;
      if(p2Type === 2)
        game.players[1].robotAiHard = true;
    }

    game.winningScore = matchPoint;
    game.numDie = numDice;
    game.numSides = sidesDice;

    updateScoreboard();
    resetBoard();

    $("#configure_screen").css({"display": "none"});
    $("#game_board").css({"display": "block"});
    $("#player_board").css({"display": "block"});
    //debugger;

    event.preventDefault();
  });

});
