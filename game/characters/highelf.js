function status() {
    this.name;
    this.description;
    this.type;
    this.turns;
}
function highelf() {
    this.id;
    this.maximumhealth = 400;
    this.health = 400;
    this.magic = 30;
    this.armor = 20;
    this.type = "light";
    this.weaknesses = ["dark"];
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
        "radiantspear": function (target) {
            var damage = 80;
            if (this.status.hasOwnProperty('slow')) {
                damage = Math.floor(damage * .66666);
            }
            target.takeDamage("light", damage);
        },
        "chromawave": function (target) {
            if (this.parent.magic < 5) {
                return false;
            }
            this.parent.magic -= 5;
            var key;
            for (key in target.status) {
                if (target.status[key].type == "ailment") {
                    target.removeStatus(key);
                }
            }
        },
        "piercingarrows": function (party) {
            if (this.parent.magic < 10) {
                return false;
            }
            var damage = 150;
            this.parent.magic -= 10;
            var key;
            for (key in party) {
                party[key].takeDamage("light", damage);
            }
        }
    }
    this.abilities.status = this.status;
    this.abilities.parent = this;

}
 