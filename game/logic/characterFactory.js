function characterFactory() {
    
    
    
    
    this.getCharacter = function(name) {
        switch(name) {
            case "airelemental":
                return new airelemental();
                break;
            case "angel":
                return new angel();
                break;
            case "darkelf":
                return new darkelf();
                break;
            case "darkmage":
                return new darkmage();
                break;
            case "fairy":
                return new fairy();
                break;
            case "fireelemental":
                return new fireelemental();
                break;
            case "firemage":
                return new firemage();
                break;
            case "golem":
                return new golem();
                break;
            case "griffin":
                return new griffin();
                break;
            case "highelf":
                return new highelf();
                break;
            case "liche":
                return new liche();
                break;
            case "lightmage":
                return new lightmage();
                break;
            case "merfolk":
                return new merfolk();
                break;
            case "vampire":
                return new vampire();
                break;
            case "warrior":
                return new warrior();
                break;
            case "watermage":
                return new watermage();
                break;
            default:
                return new warrior();
                break;
        }
    }
}

