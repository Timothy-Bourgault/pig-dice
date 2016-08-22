$(document).ready(function(){

  var placeList = [];
  var state = null;
  // Business Logic Section
  function addPlace(city, country, date, activities, notes) {
    this.City = city;
    this.Country = country;
    this.Date = date;
    this.Activities = activities;
    this.Notes = notes;
  };

  function updateNewPlace(city, country, date, activities, notes) {
    var newPlace = new addPlace(city, country, date, activities, notes);
    placeList.push(newPlace);
    $("#display_places").append("<p class=\"places\">" + newPlace.City + "</p>");
    $(".places").last().click(function()  {
      $("#showCity").text(newPlace.City);
      $("#showCountry").text(newPlace.Country);
      $("#showDate").text(newPlace.Date);
      $("#showActivities").text(newPlace.Activities);
      $("#showNotes").text(newPlace.Notes);
      state = newPlace.City;

    });
  };

  function addNote(cityName, newNote){
    for(i=0; i<placeList.length; ++i){
      if (placeList[i].City === cityName) {
        placeList[i].Notes = placeList[i].Notes + newNote;
        $("#showNotes").text(placeList[i].Notes);
      }
    }
  };

  updateNewPlace("Paris", "France", "July", "Eating and Drinking", "I like smelly cheese");
  updateNewPlace("Berlin", "Germany", "June", "Eating and Drinking", "I like smelly schnitzel");
  updateNewPlace("New York", "USA", "August", "Eating and Drinking", "I like smelly pizza");
  updateNewPlace("London", "England", "September", "Eating and Drinking", "I like smelly fish and chips");
  updateNewPlace("Portland", "USA", "June", "Eating and Drinking", "I like smelly beer");




  $("#add_place").submit(function(event){
    var country = $("input#country").val();
    var city = $("input#city").val();
    var date = $("input#date").val();
    var activities = $("input#activities").val();
    var notes = $("input#notes").val();

    updateNewPlace(city, country, date, activities, notes);

    event.preventDefault();
  });



  $("#add_note").submit(function(event){
    var newNote = $("input#newNote").val();
    //var city = placeList[state].City;
    addNote(state, newNote);


    console.log(state);


    event.preventDefault();
  });
});
