function player() {
    this.party = new party();
    this.lexicon = {};


    this.setEnemy = function (enemy) {
        this.enemy = enemy;
    }

    this.addPartyMember = function (character) {
        this.party.addMember(character);
    }

    this.startTurn = function () {
        this.party.startTurn();
        var first = this.party.moveQeue[0];
        var id = first.id;
        $(".characterpanel[data-id='" + id + "']").addClass("active");
    }
    this.endTurn = function () {
        var end = this.party.endTurn();
        console.log(this.party.moveQeue);
        
        if (!end) {
            var first = this.party.moveQeue[0];

            var id = first.id;
            $(".characterpanel[data-id='" + id + "']").addClass("active");
        }
        return end;
    }
}