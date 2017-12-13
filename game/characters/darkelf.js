function status() {
    this.name;
    this.description;
    this.type;
    this.turns;
}
function darkelf() {
    this.id;
    this.maximumhealth = 500;
    this.health = 500;
    this.magic = 20;
    this.armor = 0;
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
        "cutlassstrike": function (target) {
            
            if (this.status.hasOwnProperty('illusion')) {
                var irng = arng(0, 100);
                if (irng < 51) {
                    return true
                }
            }
            var damage = 120;
            if (this.status.hasOwnProperty('slow')) {
                damage = Math.floor(damage * .66666);
            }
            target.takeDamage("dark", damage);
        },
        "darkblizzard": function (target) {
            
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
            var damage = 60;
            if (this.status.hasOwnProperty('slow')) {
                damage = Math.floor(damage * .66666);
            }
            var slow = new status();
            slow.name = "slow";
            slow.description = "Slow lowers damage by 1/3";
            slow.turns = 1;
            slow.type = "debuff";
            target.addStatus(slow);
            target.takeDamage("dark", damage);
        },
        "icyterror": function (target) {
            
            if (this.status.hasOwnProperty('illusion')) {
                var irng = arng(0, 100);
                if (irng < 51) {
                    return true
                }
            }
            if (this.parent.magic < 10) {
                return false;
            }
            var damage = 100;
            if (this.status.hasOwnProperty('slow')) {
                damage = Math.floor(damage * .66666);
            }
            this.parent.magic -= 10;
            var freezing = new status();
            freezing.name = "freezing";
            freezing.description = "character loses 1 turn";
            freezing.turns = 1;
            freezing.type = "ailment";
            target.addStatus(freezing);
            target.takeDamage("water", damage);
        }
    }
    this.abilities.status = this.status;
    this.abilities.parent = this;

}
 