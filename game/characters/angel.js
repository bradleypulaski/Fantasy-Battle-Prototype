function status() {
    this.name;
    this.description;
    this.type;
    this.turns;
}
function angel() {
    this.id;
    this.maximumhealth = 600;
    this.health = 350;
    this.magic = 30;
    this.armor = 50;
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
        "holylight": function (target) {
            
            if (this.status.hasOwnProperty('illusion')) {
                var irng = arng(0, 100);
                if (irng < 51) {
                    return true
                }
            }
            var damage = 150;
            if (this.status.hasOwnProperty('slow')) {
                damage = Math.floor(damage * .66666);
            }
            target.takeDamage("light", damage);
        },
        "wingguard": function () {
            
            if (this.status.hasOwnProperty('illusion')) {
                var irng = arng(0, 100);
                if (irng < 51) {
                    return true
                }
            }
            if (this.parent.magic < 10) {
                return false;
            }
            this.parent.magic -= 10;
            this.parent.health += 200;
            if (this.parent.health > this.parent.maximumhealth) {
                this.parent.health = this.parent.maximumhealth;
            }
            this.parent.armor += 200;
        },
        "revive": function (target) {
            
            if (this.status.hasOwnProperty('illusion')) {
                var irng = arng(0, 100);
                if (irng < 51) {
                    return true
                }
            }
            if (this.parent.magic < 20) {
                return false;
            }
            this.parent.magic -= 20;
            target.dead = 0;
            target.health = target.maximumhealth;
        }
    }
    this.abilities.status = this.status;
    this.abilities.parent = this;

}
 