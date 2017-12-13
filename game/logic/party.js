function party() {
    this.party = [];
    this.moveQeue = [];

    this.addMember = function (character) {
        this.party.push(character);
    }
    this.removeMember = function (character) {
        var key;
        for (key in this.party) {
            var c = this.party[key];

            if (c.id === character.id) {
                this.party.splice(key, 1);
            }
        }
    }

    this.removeMemberByName = function (name) {
        var key;
        for (key in this.party) {
            var c = this.party[key];

            if (c.constructor.name === name) {
                this.party.splice(key, 1);
            }
        }
    }



    this.getCharacterById = function (id) {
        var key;
        for (key in this.party) {
            var character = this.party[key];
            if (id == character.id) {
                return character;
            }
        }
    }

    this.getPartyIndexById = function (id) {
        var key;
        for (key in this.party) {
            var character = this.party[key];

            if (id == character.id) {
                return key;
            }
        }
    }

// turn logic

    this.startTurn = function () {
        var key;
        for (key in this.party) {
            var character = this.party[key];

            if (!character.status.hasOwnProperty("freezing") && character.dead == 0) {
                this.moveQeue.push(character);
            }

        }
    }

    this.selectMove = function (id, move) {
        var key;
        for (key in this.moveQeue) {
            var character = this.moveQeue[key];

            if (id === character.id) {
                this.moveQeue[key][move]();
                delete this.moveQeue[key];
            }
        }
    }

    this.selectMoveWithArgument = function (id, move, arg) {
        var key;
        for (key in this.moveQeue) {
            var character = this.moveQeue[key];

            if (id === character.id) {
                this.moveQeue[key][move](arg);
                delete this.moveQeue[key];
            }
        }
    }

    this.endTurn = function () {
        var key;
        for (key in this.party) {
            var character = this.party[key];
            var isHaste = 0;
            if (character.status.hasOwnProperty("haste") && character.dead === 0) {
                this.moveQeue.push(character);
                isHaste = 1;
            }
            if (isHaste === 1) {
                this.hasteCheck(); // remove haste
                return false; // if false turn isnt over
            }
        }
        this.endOfTurnChecks();
        return true; // if true turn is over
    }

/// Checks

    this.endOfTurnChecks = function () {
        this.burningCheck();
        this.entropyCheck();
        this.freezingCheck();
        this.hasteCheck();
        this.healinglightCheck();
        this.illusionCheck();
        this.invisibilityCheck();
        this.panicCheck();
        this.slowCheck();
        this.purgeExpiredStatus();
    }
    this.purgeExpiredStatus = function () {
        var key;
        for (key in this.party) {
            var c = this.party[key];
            var n;
            for (n in c.status) {
                if (c.status[n].turns < 1) {
                     c.removeStatus(c.status[n].name);
                }
            }
        }
    }

    this.burningCheck = function () {
        var key;
        for (key in this.party) {
            var c = this.party[key];

            if (c.status.hasOwnProperty("burning")) {
                c.status.burning.turns -= 1;
                var maxhealth = c.maximumhealth;
                var dmg = maxhealth / 10;


                c.health = c.health - dmg;

                if (this.party[key].health < 1) {
                    this.party[key].death = 1;
                }
            }
        }
    }

    this.slowCheck = function () {
        var key;
        for (key in this.party) {
            var c = this.party[key];

            if (c.status.hasOwnProperty("slow")) {
                c.status.slow.turns -= 1;
            }
        }
    }

    this.panicCheck = function () {
        var key;
        for (key in this.party) {
            var c = this.party[key];

            if (c.status.hasOwnProperty("panic")) {
                c.status.panic.turns -= 1;
            }
        }
    }

    this.freezingCheck = function () {
        var key;
        for (key in this.party) {
            var c = this.party[key];

            if (c.status.hasOwnProperty("freezing")) {
                c.status.freezing.turns -= 1;
            }
        }
    }

    this.hasteCheck = function () {
        var key;
        for (key in this.party) {
            var c = this.party[key];

            if (c.status.hasOwnProperty("haste")) {
                c.status.haste.turns -= 1;
            }
        }
    }

    this.invisibilityCheck = function () {
        var key;
        for (key in this.party) {
            var c = this.party[key];

            if (c.status.hasOwnProperty("invisibility")) {
                c.status.invisibility.turns -= 1;
            }
        }
    }

    this.illusionCheck = function () {
        var key;
        for (key in this.party) {
            var c = this.party[key];

            if (c.status.hasOwnProperty("illusion")) {
                c.status.illusion.turns -= 1;
            }
        }
    }
    this.healinglightCheck = function () {
        var k;
        for (k in this.party) {
            var c = this.party[k];

            if (c.status.hasOwnProperty("healinglight")) {
                c.status.healinglight.turns = c.status.healinglight.turns - 1;
                var maxhealth = c.maximumhealth;
                var heal = maxhealth / 10;
                c.health += heal;
                if (c.health > maxhealth) {
                    c.health = maxhealth;
                }
            }
        }
    }


    this.entropyCheck = function () {
        var key;
        for (key in this.party) {
            var c = this.party[key];

            if (c.status.hasOwnProperty("entropy")) {
                c.status.entropy.turns -= 1;
                if (c.status.entropy.turns === 0) {
                    c.removeStatus("entropy");
                }
                var maxhealth = c.maximumhealth;
                var dmg = Math.floor(maxhealth / 8);
                c.health -= dmg;
                if (c.health < 1) {
                    c.dead = 1;
                }
            }
        }
    }



}