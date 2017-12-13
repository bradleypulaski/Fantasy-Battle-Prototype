function status() {
    this.name;
    this.description;
    this.type;
    this.turns;
}
function liche() {
    this.id;
    this.maximumhealth = 200;
    this.health = 200;
    this.magic = 70;
    this.armor = 300;
    this.type = "dark";
    this.weaknesses = ["light", "fire"];
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
    this.takeDamage = function (element, damage) {
        // liche cannot panic
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

    this.takeSoulDamage = function (element, damage) {
        // ignores armors and buffs/debufs
        if (this.weaknesses.indexOf(element) !== -1) {
            damage = Math.floor(damage * 1.5);
        }
        this.health -= damage;
    }

    this.abilities = {
        "soulstrike": function (target) {
            
            if (this.status.hasOwnProperty('illusion')) {
                var irng = arng(0, 100);
                if (irng < 51) {
                    return true
                }
            }
            if (this.parent.magic < 15) {
                return false;
            }
            this.parent.magic -= 15;
            var damage = 200;
            // liche cannot be slowed
            target.takeSoulDamage("dark", damage);
        },
        "entropy": function (target) {
            
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
            var entropy = new status();
            entropy.name = "entropy";
            entropy.description = "character loses 1/8 of maximum health each turn";
            entropy.turns = 3;
            entropy.type = "ailment";
            target.status[entropy.name] = entropy;
        },
        "absorb": function (target) {
            
            if (this.status.hasOwnProperty('illusion')) {
                var irng = arng(0, 100);
                if (irng < 51) {
                    return true
                }
            }
            var magic = target.magic;
            if (magic > 10) {
                magic = 10;
            }
            target.magic -= magic;
            this.parent.magic += magic;
        }
    }
    this.abilities.status = this.status;
    this.abilities.parent = this;
}