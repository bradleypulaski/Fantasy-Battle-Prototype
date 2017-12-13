function status() {
    this.name;
    this.description;
    this.type;
    this.turns;
}
function lightmage() {
    this.id;
    this.maximumhealth = 300;
    this.health = 300;
    this.magic = 40;
    this.armor = 0;
    this.type = "light";
    this.weaknesses = ["dark"];
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
        "lightpierce": function (target) {
            var damage = 130;
            if (this.status.hasOwnProperty('slow')) {
                damage = Math.floor(damage * .66666);
            }
            target.takeDamage("light", damage);
        },
        "heal": function (target) {
            if (this.parent.magic < 9) {
                return false;
            }
            this.parent.magic -= 9;
            target.health += 200;
            if (target.health > target.maximumhealth) {
                target.health = target.maximumhealth;
            }
        },
        "healinglight": function (party) {
            if (this.parent.magic < 11) {
                return false;
            }
            var healinglight = new status();
            healinglight.name = "healinglight";
            healinglight.description = "character gains 1/10 of maximum health each turn";
            healinglight.turns = 12;
            healinglight.type = "buff";
            this.parent.magic -= 11;
            var key;
            for (key in party) {
                party[key].status[healinglight.name] = healinglight;
            }
        }
    }
    this.abilities.status = this.status;
    this.abilities.parent = this;

}