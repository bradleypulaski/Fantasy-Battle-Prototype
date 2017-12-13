function status() {
    this.name;
    this.description;
    this.type;
    this.turns;
}

function lrng() {
    return Math.floor(Math.random() * (100 - 1 + 1)) + 1;
}
function watermage() {
    this.id;
    this.maximumhealth = 400;
    this.health = 400;
    this.magic = 50;
    this.armor = 0;
    this.type = "water";
    this.weaknesses = ["air", "ground"];
    this.status = {};
    this.dead = 0;
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
        "waterjet": function (target) {
            var damage = 110;
            if (this.status.hasOwnProperty('slow')) {
                damage = Math.floor(damage * .66666);
            }
            target.takeDamage("water", damage);
        },
        "illusion": function (target) {
            if (this.parent.magic < 20) {
                return false;
            }
            this.parent.magic -= 20;
            var illusion = new status();
            illusion.name = "illusion";
            illusion.description = "character uses random attack on random target, including allies";
            illusion.turns = 1;
            illusion.type = "ailment";
            target.status[illusion.name] = illusion;
        },
        "invisibility": function (target) {
            if (this.parent.magic < 20) {
                return false;
            }
            this.parent.magic -= 20;
            var invisibility = new status();
            invisibility.name = "invisibility";
            invisibility.description = "character cannot be targeted by attack";
            invisibility.turns = 2;
            invisibility.type = "buff";
            target.status[invisibility.name] = invisibility;
        },
        "blizzard": function (party) {
            if (this.parent.magic < 30) {
                return false;
            }
            this.parent.magic -= 30;
            var damage = 120;
            if (this.status.hasOwnProperty('slow')) {
                damage = Math.floor(damage * .66666);
            }
            var freezing = new status();
            freezing.name = "freezing";
            freezing.description = "character loses 1 turn";
            freezing.turns = 1;
            freezing.type = "ailment";
            var key;
            for (key in party) {
                var rng = lrng();
                if (rng > 49) {
                    party[key].status[freezing.name] = freezing;
                }
                party[key].takeDamage("water", damage);
            }
        }
    }
    this.abilities.status = this.status;
    this.abilities.parent = this;

}