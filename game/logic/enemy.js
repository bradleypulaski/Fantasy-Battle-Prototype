

function enemy() {
    this.party = new party();
    this.lexicon = {};


    this.setEnemy = function (player) {
        this.enemy = player;
    }

    this.addPartyMember = function (character) {
        this.party.addMember(character);
    }

    this.operations = function () {
        this.startTurn();
        this.declareMoves();
        this.endTurn();
    }

    this.startTurn = function () {
        console.log("enemy turn started");
        this.party.startTurn();
    }

    this.endTurn = function () {
        var end = this.party.endTurn();
        if (!end) {
            this.declareMoves();
        }
        resetUI();
        player.startTurn();
 
    }
    this.declareMoves = function () {
        var key;
         for (key in this.party.moveQeue) {
            var character = this.party.moveQeue[key];
            // TODO get character and ability json objects and choose appropriate moves for ai
            var success = this.attemptMove(character);
            while (success == false) {
                success = this.attemptMove(character);
            }
            this.party.moveQeue.slice(key, 1);
            resetUI();
        }
    }

    this.findSingleAllyTarget = function () {

        var acceptabletargets = [];
        var key;
        for (key in this.party.party) {

            var character = this.party.party[key];
            if (character.dead === 0) {
                acceptabletargets.push(key);
            }
        }

        var rng = arng(0, acceptabletargets.length - 1);

        return acceptabletargets[rng];

    }


    this.findSingleEnemyTarget = function () {

        var acceptabletargets = [];
        var key;
        for (key in this.enemy.party.party) {
            var character = this.enemy.party.party[key];

            if (character.dead === 0 && !character.status.hasOwnProperty("invisibility")) {
                acceptabletargets.push(key);
            }
        }

        var rng = arng(0, acceptabletargets.length - 1);

        return acceptabletargets[rng];

    }

    this.attemptMove = function (character) {
        var charactername = character.constructor.name;
        var movelength = Object.keys(character.abilities).length - 2; // account for parent and status
        var rng = arng(0, movelength - 1);
        var move = this.lexicon["characters"][charactername]["abilities"][rng];
        var moveObject = this.lexicon["abilities"][move];



        var movetype = moveObject.type;
        var movescope = moveObject.scope;
        var success = false;
        var targets = "";

        if (move == "revive") {
            return false;
        }

        if (movetype == "offensive") {
            if (movescope == "AOE") {
                success = character.abilities[move](this.enemy.party.party);
                targets = "ally party";
            } else if( movescope == "single") {
                var target = this.findSingleEnemyTarget();
                success = character.abilities[move](this.enemy.party.party[target]);
                targets = "ally " + this.enemy.party.party[target].constructor.name;
            }

        }
        if (movetype == "support") {
            if (movescope == "AOE") {
                success = character.abilities[move](this.party.party);
                targets = "enemy party";

            } else if (movescope == "single") {
                var target = this.findSingleAllyTarget();
                success = character.abilities[move](this.party.party[target]);
                targets = "enemy " + this.party.party[target].constructor.name;

            }
        }
        if (movescope == "self") {
            success = character.abilities[move]();
            targets = "self";
        }
        if (typeof success == "undefined") {
            success = true;
        }
        if (success === true) {
            $("#gamelog").append("<p class='logelement'>Enemy's " + charactername + " used " + move + " on target " + targets + "</p>");
        }
        
        console.log(charactername + " Status " + success.toString());
        return success;
    }

}
