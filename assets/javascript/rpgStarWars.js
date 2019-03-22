$(document).ready(function() { 
  
  //VAriables here
  //------------------------------------------------------------------
  // Creates an object with all of the playable characters in the list

  var characterSelected;
  var enemyArr = [];
  var nameClicked;
  var defenderSelected;
  var turnCounter = 1;
  var killCounter = 0;

  var characters = {
    "Obi Wan Kenobi": {
      name: "Obi Wan Kenobi",
      health: 120,
      attack: 8,
      imageURL: "assets/images/Kenobi.jpg", 
      enemyAttackBack: 15
    },
    "Luke Skywalker": {
      name: "Luke Skywalker",
      health: 100,
      attack: 14,
      imageURL: "assets/images/Skywalker.jpg", 
      enemyAttackBack: 5
    },
    "Master Yoda": {
      name: "Master Yoda",
      health: 120,
      attack: 8,
      imageURL: "assets/images/Yoda.jpg", 
      enemyAttackBack: 15
    },
    "Qui-Gon Jinn": {
      name: "Qui-Gon Jinn",
      health: 120,
      attack: 8,
      imageURL: "assets/images/QuiGon.jpeg", 
      enemyAttackBack: 15
    }
  }
  //console.log(characters);

  // Functions here
  //------------------------------------------------------------------
  // renders the cards for characters into the available area
  var renderOne = function(character, renderArea, charStatus) {
    var charDiv = $("<div class='character' data-name='" + character.name + "'>");
    var charName = $("<div class='character-name'>").text(character.name);
    var charImage = $("<img alt='image' class='character-image'>").attr("src", character.imageURL);
    var charHealth = $("<div class='character-health'>").text("Health: " + character.health);
    charDiv.append(charName).append(charImage).append(charHealth);
    $(renderArea).append(charDiv);

    // If the rendered character is an enemy or defender (active opponent)
    if (charStatus === "enemy") {
      $(charDiv).addClass("enemy");
    }
    else if (charStatus === "defender") {
        //populate the defender section with the chosen opponent
        defenderSelected = character;
        $(charDiv).addClass("target-enemy");
    }
  }
  
  // allows the user to restart the game
  var restartGame = function(inputGameEnd) {
    var restart = $("<button>Restart</button>").click(function(){
      location.reload();
    });
    var gameState = $("<div>").text(inputGameEnd);
    $("body").append(gameState);
    $("body").append(restart);
  }

  // Function to handle rendering game messages.
  var renderMessage = function(message) {
    // Builds the message and appends it to the page.
    if (message === "clearMessage") {
      $("#message-section").text("");
    } else {
    var gameMessageSet = $("#message-section");
    var newMessage = $("<div>").text(message);
    gameMessageSet.append(newMessage);
    }
  };

  // This function renders the characters as cards creating divs, attributes, and classes
  var renderCharacters = function(charObj, areaRender) {
    if (areaRender === "#characters-section") {
      //$(areaRender).empty();
      for (var key in charObj) {
        if (charObj.hasOwnProperty(key)) {
          renderOne(charObj[key], areaRender, "");
        }
      }
    }
    // if it is the selected character we only need to render it once
    if (areaRender === "#chosen-character") {
      renderOne(charObj, areaRender, "");
    }
    // if rendering enemies then loop through the enemies array.
    if (areaRender === "#enemies-available") {
      for (var i = 0; i < enemyArr.length; i++) {
      renderOne(enemyArr[i], "#enemies-available", "enemy");
      }
    
      $(document).on("click", ".enemy", function() {
        var name = ($(this).attr("data-name"));
        console.log("Enemy name is " + name);
        //if the defender section has no divs then hide the character and render it in the new section
        if ($("#defender-section").children().length <= 1) {
          renderCharacters(name, "#defender-section");
          $(this).hide();
          renderMessage("clearMessage");
          $("#enemies-available").hide();
        }
      });
    }
    if (areaRender === "#defender-section") {
      $(areaRender).empty();
      for (i = 0; i < enemyArr.length; i++) {
        if (enemyArr[i].name === charObj) {
          renderOne(enemyArr[i], areaRender, "defender");
        }
      }
    }
    // redraw enemy when damaged
    if (areaRender === "playerDamage") {
      $("#defender-section").empty();
      renderOne(charObj, "#defender-section", "defender");
    }
    // render selected character when damaged
    if (areaRender === "enemyDamage") {
      $("#chosen-character").empty();
      renderOne(charObj, "#chosen-character", "");
    }
    if (areaRender === "enemyDefeated") {
      $("#defender-section").empty();
      var gameStateMessage = ("You have defeated " + charObj.name + " , you can choose to fight another enemy!");
      renderMessage(gameStateMessage);
      $("#enemies-available").show();
      killCounter++;
      console.log("Kill count is " + killCounter);
      if (killCounter >= 3) {
        renderMessage("clearMessage");
        restartGame("You won!!!! Game over!");
        $("#attack").hide();
      }
    }
  }

  renderCharacters(characters, "#characters-section");
  // On click event for saving the selected characters name

  $(document).on("click", ".character", function() {
    // save the clicked characters name 
    var nameClicked = $(this).attr("data-name");
    console.log("Clicked on " + nameClicked);
    console.log(enemyArr);
    // if a character has not been selected
   
    if (!characterSelected) {
      characterSelected = characters[nameClicked];
      console.log("Player selected " + characterSelected);
      for (var key in characters) {
        // push them into an array of combatants to fight later
        if (characters[key].name !== nameClicked) {
          enemyArr.push(characters[key]);
        }
      }
      //Hide the selected character div
      $("#characters-section").hide();
      // Now render the selected character and enemies in the new positions
      renderCharacters(characterSelected, "#chosen-character");
      renderCharacters(enemyArr, "#enemies-available");
    }
  })

  // attack button functionality
  $("#attack").on("click", function() {
    console.log("Attack was clicked!");
    if ($("#defender-section").children().length <= 1 ) {
      // remove the calculated attack value from the defenders health
      defenderSelected.health -= (characterSelected.attack * turnCounter);
      // defender removes attackers health
      characterSelected.health -= defenderSelected.enemyAttackBack;
      // set up damage messages
      var attackMessage = ("You attacked " + defenderSelected.name + " for " + (characterSelected.attack * turnCounter) + " damage!");
      var counterAttackMessage = (defenderSelected.name + " attacked you for " + (defenderSelected.enemyAttackBack) + " damage!");
      // render the combat messages
      renderMessage("clearMessage");
      renderMessage(attackMessage);
      renderMessage(counterAttackMessage);
      // update the damage done to the characters
      renderCharacters(characterSelected, "enemyDamage");
      renderCharacters(defenderSelected, "playerDamage");
      // is the defender still alive?
      console.log("D health=" + defenderSelected.health);
      console.log("C health=" + characterSelected.health);
      if (defenderSelected.health <= 0 ) {        
        renderMessage("clearMessage");
        renderCharacters(defenderSelected, "enemyDefeated");
      }
      if (characterSelected.health <= 0 ) {
        renderMessage("clearMessage");
        restartGame("GAME OVER!!!! You have been defeated!");
        $("#attack").hide();
      }
    }
    else {
      // remove opponents character card
      renderCharacters(defenderSelected, "enemyDefeated");
    }
    turnCounter++;
  });
});