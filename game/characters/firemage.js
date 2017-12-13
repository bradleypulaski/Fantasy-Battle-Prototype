function status() {
    this.name;
    this.description;
    this.type;
    this.turns;
}

function lrng() {
    return Math.floor(Math.random() * (100 - 1 + 1)) + 1;
}
function firemage() {
    this.id;
    this.maximumhealth = 400;
    this.health = 400;
    this.magic = 40;
    this.armor = 0;
    this.type = "fire";
    this.weaknesses = ["water"];
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
        "flameshot": function (target) {
            var damage = 150;
            if (this.status.hasOwnProperty('slow')) {
                damage = Math.floor(damage * .66666);
            }
            target.takeDamage("fire", damage);
        },
        "incinerate": function (target) {
            if (this.parent.magic < 10) {
                return false;
            }
            this.parent.magic -= 10;
            var damage = 180;
            if (this.status.hasOwnProperty('slow')) {
                damage = Math.floor(damage * .66666);
            }
            target.takeDamage("fire", damage);
            var burning = new status();
            burning.name = "burning";
            burning.description = "at the end of characters turn take 1/10 of maximum health of damage";
            burning.turns = 999;
            burning.type = "ailment";
            target.status[burning.name] = burning;
        },
        "lightningbolt": function (target) {
            if (this.parent.magic < 20) {
                return false;
            }
            this.parent.magic -= 20;
            var damage = 500;
            if (this.status.hasOwnProperty('slow')) {
                damage = Math.floor(damage * .66666);
            }

            var rng = lrng();

            if (rng > 49) {
                target.takeDamage("fire", damage);
                var burning = new status();
                burning.name = "burning";
                burning.description = "at the end of characters turn take 1/10 of maximum health of damage";
                burning.turns = 999;
                burning.type = "ailment";
                target.status[burning.name] = burning;
            } else {
                return "attack missed";
            }

        }
    }
    this.abilities.status = this.status;
    this.abilities.parent = this;

}