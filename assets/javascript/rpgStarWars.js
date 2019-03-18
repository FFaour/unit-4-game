$(document).ready(function() { 
  
  //VAriables here
  //------------------------------------------------------------------
  // Creates an object with all of the playable characters in the list

  var characterSelected;
  var combatants = [];

  var characters = {
    "Kenobi": {
      name: "Obi Wan Kenobi",
      health: 120,
      Attack: 8,
      imageURL: "assets/images/Kenobi.jpg", 
      enemyAttackBack: 15
    },
    "Skywalker": {
      name: "Luke Skywalker",
      health: 100,
      Attack: 14,
      imageURL: "assets/images/Skywalker.jpg", 
      enemyAttackBack: 5
    },
    "Yoda": {
      name: "Master Yoda",
      health: 120,
      Attack: 8,
      imageURL: "assets/images/Yoda.jpg", 
      enemyAttackBack: 15
    },
    "Qui-Gon": {
      name: "Qui-Gon Jinn",
      health: 120,
      attack: 8,
      imageURL: "assets/images/QuiGon.jpeg", 
      enemyAttackBack: 15
    }
  }
  console.log(characters);

  // Functions here
  //------------------------------------------------------------------
  // renders the cards for characters into the available area
  var renderOne = function(character, renderArea) {
    var charDiv = $("<div class='character' 'data-name='" + character.name + "'>");
    var charName = $("<div class'character-name'>").text(character.name);
    var charImage = $("<img alt='image' class='character-image'>").attr("src", character.imageURL);
    var charHealth = $("<div class='character-health'>").text("Health: " + character.health);
    charDiv.append(charName).append(charImage).append(charHealth);
    $(renderArea).append(charDiv);
  }
  // This function renders the characters as cards creating divs, attributes, and classes
  var renderCharacters = function(charObj, areaRender) {
    if (areaRender === "#characters-section") {
      $(areaRender).empty();
      for (var key in charObj) {
        if (charObj.hasOwnProperty(key)) {
          renderOne(charObj[key], areaRender);
        }
      }
    }
  }
  renderCharacters(characters, "#characters-section");
  // On click event for saving the selected characters name
  $(document).on("click", ".character", function() {
    console.log("click is working");
  // save the clicked characters name 
    var nameClicked = $(this).attr("data-name");
    console.log(nameClicked);
    // if a character has not been selected
    if (!characterSelected) {
      for (var key in characters) {
        // push them into an array of combatants to fight later
        if (key !== nameClicked) {
          combatants.push(characters[key]);
        }
      }
      console.log(combatants);
    }
  })
});