function status() {
    this.name;
    this.description;
    this.type;
    this.turns;
}

function lrng() {
    return Math.floor(Math.random() * (100 - 1 + 1)) + 1;
}
function vampire() {
    this.id;
    this.maximumhealth = 700;
    this.health = 300;
    this.magic = 20;
    this.armor = 100;
    this.type = "dark";
    this.weaknesses = ["light", "fire"];
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
        "siphon": function (target) {
            
            if (this.status.hasOwnProperty('illusion')) {
                var irng = arng(0, 100);
                if (irng < 51) {
                    return true
                }
            }
            var damage = 100;
            if (this.status.hasOwnProperty('slow')) {
                damage = Math.floor(damage * .66666);
            }
            target.takeDamage("dark", damage);

            var type = target.type;
            if (type == "light") {
                damage = Math.floor(damage * 1.5);
            }
            var heal = Math.floor(damage / 2);
            this.parent.health += heal;
        },
        "mistform": function () {
            
            if (this.status.hasOwnProperty('illusion')) {
                var irng = arng(0, 100);
                if (irng < 51) {
                    return true
                }
            }
            if (this.parent.magic < 5) {
                return false;
            }
            this.parent.magic -= 5;
            var invisibility = new status();
            invisibility.name = "invisibility";
            invisibility.description = "character cannot be targeted by attack";
            invisibility.turns = 2;
            invisibility.type = "buff";
            this.parent.status[invisibility.name] = invisibility;
        },
        "soulsnare": function (target) {
            
            if (this.status.hasOwnProperty('illusion')) {
                var irng = arng(0, 100);
                if (irng < 51) {
                    return true
                }
            }
            if (this.parent.magic < 15) {
                return false;
            }
            var damage = 250;
            if (this.status.hasOwnProperty('slow')) {
                damage = Math.floor(damage * .66666);
            }
            this.parent.magic -= 15;
            target.takeDamage("dark", damage);

            var type = target.type;
            if (type == "light") {
                damage = Math.floor(damage * 1.5);
            }
            var heal = Math.floor(damage / 2);
            this.parent.health += heal;
        }
    }
    this.abilities.status = this.status;
    this.abilities.parent = this;

}