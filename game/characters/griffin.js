function status() {
    this.name;
    this.description;
    this.type;
    this.turns;
}

function lrng() {
    return Math.floor(Math.random() * (100 - 1 + 1)) + 1;
}
function griffin() {
    this.id;
    this.maximumhealth = 500;
    this.health = 500;
    this.magic = 20;
    this.armor = 0;
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
        "razerwind": function (target) {
            var damage = 120;
            if (this.status.hasOwnProperty('slow')) {
                damage = Math.floor(damage * .66666);
            }
            target.takeDamage("air", damage);
        },
        "roost": function (target) {
            if (this.parent.magic < 5) {
                return false;
            }
            this.parent.magic -= 5;
            target.health += 50;
            if (target.health > target.maximumhealth) {
                target.health = target.maximumhealth;
            }
            for (key in target.status) {
                if (target.status[key].type == "ailment" || target.status[key].type == "debuff") {
                    target.removeStatus(key);
                }
            }
        },
        "frenzy": function (target) {
            if (this.parent.magic < 10) {
                return false;
            }
            this.parent.magic -= 10;
            var damage = 200;
            if (this.status.hasOwnProperty('slow')) {
                damage = Math.floor(damage * .66666);
            }
            target.takeDamage("air", damage);
            var rng = lrng();
            if (rng > 74) {
                var panic = new status();
                panic.name = "panic";
                panic.description = "Panic lowers defense by 1/3";
                panic.turns = 2;
                panic.type = "debuff";
                target.status[panic.name] = panic;
            }
        }
    }
    this.abilities.status = this.status;
    this.abilities.parent = this;

}
 