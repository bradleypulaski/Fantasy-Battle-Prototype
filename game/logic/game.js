function resetUI() {
    var playerparty = player.party.party;
    var enemyparty = enemy.party.party;
    var i = 1;
    $("#player").html("");
    $("#enemy").html("");
    var key1;
    var palldead = 0;
    for (key1 in playerparty) {
        var character = playerparty[key1];
        character.id = i;
        var dead = character.dead;
        var deadclass = "";
        if (dead === 1) {
            deadclass = "dead";
            palldead++;
        }
        var html = "<div class='characterpanel " + deadclass + " ' data-id='" + i + "' data-character='" + character.constructor.name + "' data-owner='player'>";
        html += "<div class=' characterimg " + character.constructor.name + "'>";
        html += "</div>";
        html += "<div class='characterpanelright'>";
        html += "<div class='characterpanelrightinfo'>";
        html += "<h3>" + character.constructor.name + "</h3>";
        html += "<p>" + "Health: " + "<span class='health'>" + character.health + "</span><p>";
        html += "<p>" + "Armor: " + "<span class='armor'>" + character.armor + "</span><p>";
        html += "<p>" + "Magic: " + "<span class='magic'>" + character.magic + "</span><p>";
        html += "</div>";
        html += "<div class='actions'>";
        html += "<div class='attack'>Attack</div>";
        html += "</div>";
        html += "</div>";
        html += "</div>";

        $("#player").append(html);
        i++;
    }
    if (palldead == 3) {
        alert("you lose");
        location.reload();
    }
    var ealldead = 0;

    var key2;
    for (key2 in enemyparty) {

        var character = enemyparty[key2];
        character.id = i;
        var dead = character.dead;
        var deadclass = "";
        if (dead === 1) {
            deadclass = "dead";
            ealldead++;
        }
        var html = "<div class='characterpanel " + deadclass + " ' data-id='" + i + "' data-character='" + character.constructor.name + "' data-owner='enemy'>";
        html += "<div class='characterimg " + character.constructor.name + "'>";
        html += "</div>";
        html += "<div class='characterpanelright'>";
        html += "<h3>" + character.constructor.name + "</h3>";
        html += "<p>" + "Health: " + "<span class='health'>" + character.health + "</span><p>";
        html += "<p>" + "Armor: " + "<span class='armor'>" + character.armor + "</span><p>";
        html += "<p>" + "Magic: " + "<span class='magic'>" + character.magic + "</span><p>";
        html += "</div>";
        html += "</div>";

        $("#enemy").append(html);
        i++;
    }
    if (ealldead == 3) {
        alert("you win");
        location.reload();
    }
}

$(function () {
    var characters = {};

    var url = "";
    // Set the global configs to synchronous 
    $.ajaxSetup({
        async: false
    });
    $.getJSON(url + "game/json/characters.json", {
        format: "json"
    }).done(function (data) {
        characters = data;
    });

    var key3;
    for (key3 in characters) {
        var factory = new characterFactory();
        var character = factory.getCharacter(key3);

        var info = "<h2>" + key3 + "<h2>";
        info += "<h5>Health: " + character.health + "<h2>";
        info += "<h5>Armor: " + character.armor + "<h2>";
        info += "<h5>Magic: " + character.magic + "<h2>";
        info += "<h5>type: " + character.type + "<h2>";
        info += "<h6>Special: " + characters[key3].description + "<h6>";

        $("#characterselectioncontainter").append("<div class='characterchoice' data-character='" + key3 + "'><div class='" + key3 + "'></div><div class='characterinfo'>" + info + "</div></div>");
    }
    $(".characterchoice").click(function () {
        var selected = $(this).hasClass("selected");
        if (selected) {
            $(this).removeClass("selected");
            selected = false;
            var name = $(this).attr("data-character");
            player.party.removeMemberByName(name);
            jQuery("#continue").css("display", "none")

        } else {
            if (player.party.party.length === 3) {
                return false;
            }

            $(this).addClass("selected");
            selected = true;
            var name = $(this).attr("data-character");
            var factory = new characterFactory();
            var character = factory.getCharacter(name);
            player.party.addMember(character);
            if (player.party.party.length === 3) {
                jQuery("#continue").css("display", "block");
            }

        }
    });
    $(".characterchoice").mouseenter(function () {
        var name = $(this).attr("data-character");


        var characters = lexicon.characters;

        var character = characters[name];

        var abilities = lexicon.abilities;
        var characterabilities = character.abilities;



        var html = "<h1>" + name + "</h1>";
        var html = "<h2>" + 'Abilities' + "</h2>";
        var key4;
        for (key4 in characterabilities) {

            html += "<h3>" + characterabilities[key4] + "</h3>";
            html += "<p>" + abilities[characterabilities[key4]].description + "</p>";

        }
        $("#startrightinfo").css("display", "block");

        $("#startrightinfo").css("background-color", "black");

        $("#startrightinfo").html(html);
    });
    $(".characterchoice").mouseleave(function () {

        $("#startrightinfo").html("");
        $("#startrightinfo").css("background-color", "none");
        $("#startrightinfo").css("display", "none");

    });

    jQuery("#continue").click(function () {
        startgame();

        resetUI();

        player.party.startTurn();

        var first = player.party.moveQeue[0];
        var id = first.id;
        $(".characterpanel[data-id='" + id + "']").addClass("active");
        $("#startgame").css("display", "none");
    });



    $(document).on('click', '.attack', function () { // bind event to dynamic elements

        var characters = lexicon.characters;
        var labilities = lexicon.abilities;


        var container = $(this).parent().parent().parent();
        var charactername = container.attr("data-character");
        var abilities = characters[charactername].abilities;
        var id = container.attr("data-id");
        var character = player.party.getCharacterById(id);

        var magic = character.magic;


        $("#abilities").html("<h1>Choose Ability</h1>");
        var key4;
        for (key4 in abilities) {
            var ability = abilities[key4];
            var cost = labilities[ability].cost;
            if (cost <= magic) {
                $("#abilities").append("<div class='ability' data-id='" + id + "' data-ability='" + ability + "'>" + ability + "</div>");
            }
        }
        $("#abilities").css("display", "block");

        $.featherlight($("#abilities"));
    });


    $(document).on('click', '.ability', function () { // bind event to dynamic elements


        var labilities = lexicon.abilities;

        var abilityname = $(this).attr("data-ability");
        var id = $(this).attr("data-id");

        var lability = labilities[abilityname];
        var scope = lability.scope;
        var type = lability.type;
        var cost = lability.cost;

        var character = player.party.getCharacterById(id);
        var index = player.party.getPartyIndexById(id);
        var targets = "";
        if (scope == "self") {
            character.abilities[abilityname]();
            targets = "self";
        }
        if (scope == "AOE") {

            if (type == "offensive") {
                var audio = new Audio('../game/audio/sfx/swordclash.mp3');
                audio.play();

                targets = "enemy team";

                character.abilities[abilityname](enemy.party.party);
            }
            if (type == "support") {
                                var audio = new Audio('../game/audio/sfx/buff.ogg');
                audio.play();
                targets = "ally team";

                character.abilities[abilityname](player.party.party);
            }
        }

        if (scope == "single") {
            if (type == "offensive") {
                $.featherlight.close();
                $("#abilities").css("display", "none");
                var party = enemy.party.party;
                var key5;
                for (key5 in party) {
                    var member = party[key5];
                    var id = member.id;
                    if (member.dead === 0 && !member.status.hasOwnProperty("invisibility")) {
                        $(".characterpanel[data-id='" + id + "']").addClass("enemytarget");
                    }
                }
                var targetOffensiveInterval = setInterval(function () {
                    if (currenttarget !== null) {
                        var id = currenttarget;
                        var target = enemy.party.getPartyIndexById(id);
                        targets = "enemy " + enemy.party.party[target].constructor.name;
                        $("#gamelog").append("<p class='logelement'>Ally " + character.constructor.name + " used " + abilityname + " on target " + targets + "</p>");

                        character.abilities[abilityname](enemy.party.party[target]);
                        player.party.moveQeue.shift();
                        $(".characterpanel[data-id='" + id + "']").removeClass("active");
                        resetUI();
                        if (player.party.moveQeue.length > 0) {
                            var first = player.party.moveQeue[0];
                            var id = first.id;
                            $(".characterpanel[data-id='" + id + "']").addClass("active");
                        }

                        currenttarget = null;

                        if (player.party.moveQeue.length === 0) {
                            var end = player.endTurn();
                            if (end) {
                                enemy.operations();
                            }
                        }
                        clearInterval(targetOffensiveInterval);
                    }
                }, 1000);
            }
            if (type == "support") {
                $.featherlight.close();
                $("#abilities").css("display", "none");
                var party = player.party.party;
                var key6;
                for (key6 in party) {
                    var member = party[key6];
                    var id = member.id;
                    if (member.dead === 0) {
                        $(".characterpanel[data-id='" + id + "']").addClass("allytarget");
                    }
                }
                var targetSupportInterval = setInterval(function () {
                    if (currenttarget !== null) {
                        var id = currenttarget;
                        var target = player.party.getPartyIndexById(id);
                        targets = "ally " + player.party.party[target].constructor.name;
                        $("#gamelog").append("<p class='logelement'>Ally " + character.constructor.name + " used " + abilityname + " on target " + targets + "</p>");

                        character.abilities[abilityname](player.party.party[target]);
                        player.party.moveQeue.shift();
                        $(".characterpanel[data-id='" + id + "']").removeClass("active");
                        resetUI();
                        if (player.party.moveQeue.length > 0) {
                            var first = player.party.moveQeue[0];
                            var id = first.id;
                            $(".characterpanel[data-id='" + id + "']").addClass("active");
                        }
                        currenttarget = null;
                        if (player.party.moveQeue.length === 0) {
                            var end = player.endTurn();
                            if (end) {
                                enemy.operations();
                            }
                        }
                        clearInterval(targetSupportInterval);
                    }
                }, 1000);
            }
        }
        if (scope !== "single") {
            player.party.moveQeue.shift();
            $(".characterpanel[data-id='" + id + "']").removeClass("active");
            resetUI();

            $.featherlight.close();
            $("#abilities").css("display", "none");
            $("#gamelog").append("<p class='logelement'>Ally " + character.constructor.name + " used " + abilityname + " on target " + targets + "</p>");
            if (player.party.moveQeue.length === 0) {
                var end = player.endTurn();
                if (end) {
                    enemy.operations();
                }
            } else {
                var first = player.party.moveQeue[0];
                var id = first.id;
                $(".characterpanel[data-id='" + id + "']").addClass("active");
            }
        }


    });
    $(document).on('click', '.enemytarget', function () { // bind event to dynamic elements
        var audio = new Audio('../game/audio/sfx/swordclash.mp3');
        audio.play();
        var id = $(this).attr("data-id");
        currenttarget = id;
        $(".enemytarget").each(function () {
            $(this).removeClass("target");
        });
    })
    $(document).on('click', '.allytarget', function () { // bind event to dynamic elements
        var audio = new Audio('../game/audio/sfx/buff.ogg');
        audio.play();
        var id = $(this).attr("data-id");
        currenttarget = id;
        $(".allytarget").each(function () {
            $(this).removeClass("allytarget");
        });
    });

    $(document).on('mouseenter', '.characterpanel', function () { // bind event to dynamic elements
        var id = $(this).attr("data-id");
        var name = $(this).attr("data-character");
        var owner = $(this).attr("data-owner");

        var character = null;

        if (owner == "player") {
            character = player.party.getCharacterById(id);
        }
        if (owner == "enemy") {
            character = enemy.party.getCharacterById(id);
        }

        var status = character.status;

        var html = "<h1>" + name + "</h1>";
        var html = "<h3>Status'</h3>";
        var key7;
        for (key7 in status) {
            html += "<p>Status: " + status[key7].name + "</p>";
            html += "<p>Description: " + status[key7].description + "</p>";
            if (status[key7].name == "healinglight") {
                html += "<p>Turns: " + status[key7].turns / 3 + "</p>";
            } else {
                html += "<p>Turns: " + status[key7].turns + "</p>";

            }
        }

        $("#currentstatus").css("display", "block");
        $("#currentstatus").html(html);
    });
    $(document).on('mouseleave', '.characterpanel', function () { // bind event to dynamic elements

        $("#currentstatus").css("display", "none");
        $("#currentstatus").html("");
    });
});