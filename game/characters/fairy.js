function status() {
    this.name;
    this.description;
    this.type;
    this.turns;
}

function lrng() {
    return Math.floor(Math.random() * (100 - 1 + 1)) + 1;
}
function fairy() {
    this.id;
    this.maximumhealth = 200;
    this.health = 200;
    this.magic = 60;
    this.armor = 0;
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
        var rng = lrng();
        if (rng > 49) {
            return false;
        }
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

        var rng = lrng();
        if (rng > 49) {
            return false;
        }

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
        "swarm": function (target) {
            
            if (this.status.hasOwnProperty('illusion')) {
                var irng = arng(0, 100);
                if (irng < 51) {
                    return true
                }
            }
            var rng = lrng();
            while (rng > 0) {
                var damage = 20;
                if (this.status.hasOwnProperty('slow')) {
                    damage = Math.floor(damage * .66666);
                }
                target.takeDamage("water", damage);
                rng -= 19;
            }
        },
        "pheramones": function (target) {
            
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
            var illusion = new status();
            illusion.name = "illusion";
            illusion.description = "character has 50% chance of cancelling attack";
            illusion.turns = 1;
            illusion.type = "ailment";
            target.status[illusion.name] = illusion;
        },
        "manabloom": function (party) {
            
            if (this.status.hasOwnProperty('illusion')) {
                var irng = arng(0, 100);
                if (irng < 51) {
                    return true
                }
            }
            if (this.parent.magic < 30) {
                return false;
            }
            this.parent.magic -= 30;
            var rng = lrng();
            var key;
            for (key in party) {
                party[key].magic += Math.floor(rng / 1.7);
            }
        }
    }
    this.abilities.status = this.status;
    this.abilities.parent = this;

}
 