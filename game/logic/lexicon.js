function lexicon() {
    this.characters = {};
    this.abilities = {};
    this.elements = {};
    this.status = {};
    
    this.getLexicon = function() {
        return {
            "characters": this.characters,
            "abilities": this.abilities,
            "elements": this.elements,
            "status": this.status
        };
    }
    
    this.populate = function () {
        var url = "";
        // Set the global configs to synchronous 
        $.ajaxSetup({
            async: false
        });
         $.getJSON(url + "game/json/characters.json", {
            format: "json"
        }).done(function (data) {
            lexicon.characters = data;
        });
        $.getJSON(url + "game/json/abilities.json", {
            format: "json"
        }).done(function (data) {
            lexicon.abilities = data;
        });
        $.getJSON(url + "game/json/elements.json", {
            format: "json"
        }).done(function (data) {
            lexicon.elements = data;
        });
        $.getJSON(url + "game/json/status.json", {
            format: "json"
        }).done(function (data) {
            lexicon.status = data;
        });

    }


}