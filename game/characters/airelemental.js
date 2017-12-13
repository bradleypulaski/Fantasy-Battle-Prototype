function status() {
    this.name;
    this.description;
    this.type;
    this.turns;
}

function lrng() {
    return Math.floor(Math.random() * (100 - 1 + 1)) + 1;
}
function airelemental() {
    this.id;
    this.maximumhealth = 300;
    this.health = 300;
    this.magic = 50;
    this.armor = 50;
    this.type = "air";
    this.weaknesses = ["fire", "earth"];
    this.dead = 0;
    this.status = {};
    this.addStatus = function (status) {
        this.status[status.name] = status;
        this.abilities.status = this.status;
    }
    this.removeStatus = function (statusname) {
        var has = this.hasStatus(statusname);
        if (has)
            delete this.status[statusname];
        this.abilities.status = this.status;
    }
    this.hasStatus = function (statusname) {
        var has = false;
        if (this.status.hasOwnProperty(statusname)) {
            has = true;
        }
        return has;
    }
    this.getStatusTurns = function (statusname) {
        var has = this.hasStatus(statusname);
        var turns = 0;
        if (has) {
            turns = this.status[statusname].turns;
        }
        return turns;
    }
    this.takeSoulDamage = function (element, damage) {
        // ignores armors and buffs/debufs
        if (this.weaknesses.indexOf(element) !== -1) {
            damage = Math.floor(damage * 1.5);
        }
        this.health -= damage;
        if (this.health <= 0) {
            this.health = 0;
            this.dead = 1;
        }
    }
    this.takeDamage = function (element, damage) {
        if (this.status.hasOwnProperty('panic')) {
            damage = Math.floor(damage * 1.33333);
        }
        if (this.weaknesses.indexOf(element) !== -1) {
            damage = Math.floor(damage * 1.5);
        }
        if (this.armor > 0) {
            this.armor -= damage;
            if (this.armor < 0) {
                this.health += this.armor;
                this.armor = 0;
            }
        } else {
            this.health -= damage;
        }
        if (this.health <= 0) {
            this.health = 0;
            this.dead = 1;
        }
    }

    this.abilities = {
        "gust": function (target) {
            var damage = 80;
            this.parent.magic += 12.5;
            if (this.status.hasOwnProperty('slow')) {
                damage = Math.floor(damage * .66666);
            }
            target.takeDamage("air", damage);
        },
        "haste": function (party) {
            if (this.parent.magic < 25) {
                return false;
            }
            this.parent.magic -= 25;
            var key;
            for (key in party) {
                var rng = lrng();
                if (rng > 49) {
                    var haste = new status();
                    haste.name = "haste";
                    haste.description = "character gains 1 turn";
                    haste.turns = 1;
                    haste.type = "buff";
                    party[key].status[haste.name] = haste;
                }
            }
        },
        "hurricane": function (party) {
            if (this.parent.magic < 25) {
                return false;
            }
            this.parent.magic -= 25;
            var damage = 180;
            if (this.status.hasOwnProperty('slow')) {
                damage = Math.floor(damage * .66666);
            }
            var key;
            for (key in party) {
                party[key].takeDamage("air", damage);
                var rng = lrng();
                if (rng > 49) {
                    var slow = new status();
                    slow.name = "slow";
                    slow.description = "Slow lowers damage by 1/3";
                    slow.turns = 1;
                    slow.type = "debuff";
                    party[key].status[slow.name] = slow;
                }
            }
        }
    }
    this.abilities.status = this.status;
    this.abilities.parent = this;

}
 