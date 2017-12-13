function status() {
    this.name;
    this.description;
    this.type;
    this.turns;
}

function lrng() {
    return Math.floor(Math.random() * (100 - 1 + 1)) + 1;
}
function merfolk() {
    this.id;
    this.maximumhealth = 350;
    this.health = 350;
    this.magic = 30;
    this.armor = 100;
    this.type = "water";
    this.weaknesses = ["air", "earth"];
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
        "tritonstab": function (target) {
            
            if (this.status.hasOwnProperty('illusion')) {
                var irng = arng(0, 100);
                if (irng < 51) {
                    return true
                }
            }
            var damage = 90;
            if (this.status.hasOwnProperty('slow')) {
                damage = Math.floor(damage * .66666);
            }
            target.takeDamage("water", damage);
        },
        "icespear": function (target) {
            
            if (this.status.hasOwnProperty('illusion')) {
                var irng = arng(0, 100);
                if (irng < 51) {
                    return true
                }
            }
            if (this.parent.magic < 6) {
                return false;
            }
            this.parent.magic -= 6;
            var damage = 175;
            if (this.status.hasOwnProperty('slow')) {
                damage = Math.floor(damage * .66666);
            }
            target.takeDamage("water", damage);
            var rng = lrng();
            if (rng > 74) {
                var freezing = new status();
                freezing.name = "freezing";
                freezing.description = "character loses 1 turn";
                freezing.turns = 1;
                freezing.type = "ailment";
                target.status[freezing.name] = freezing;
            }
        },
        "coolingwater": function (target) {
            
            if (this.status.hasOwnProperty('illusion')) {
                var irng = arng(0, 100);
                if (irng < 51) {
                    return true
                }
            }
            if (this.parent.magic < 12) {
                return false;
            }
            this.parent.magic -= 12;
            target.health += 100;
            if (target.health > target.maximumhealth) {
                target.health = target.maximumhealth;
            }
            var key;
            for (key in target.status) {
                if (target.status[key].type == "ailment") {
                    target.removeStatus(key);
                }
            }
        }
    }
    this.abilities.status = this.status;
    this.abilities.parent = this;

}
 