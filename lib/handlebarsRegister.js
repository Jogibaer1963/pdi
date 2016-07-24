if (Meteor.isClient) {

    Handlebars.registerHelper('getStatusColor', function(pdiStatus) {
        switch (pdiStatus) {
            case 1 : {
                return '#138b0e';
            } break;
            case 0 : {
                return 'orangered';
            } break;
            case 2 : {
                return 'inProcess';
            }  break;
        }
    });

    Handlebars.registerHelper('getStatusColor', function(repairStatus) {
        switch (repairStatus) {
            case 1 : {
                return '#138b0e';
            } break;
            case 0 : {
                return 'orangered';
            } break;
            case 2 : {
                return 'inProcess';
            }  break;
        }
    });

    Handlebars.registerHelper('getStatusColor', function(washStatus) {
        switch (washStatus) {
            case 1 : {
                return '#138b0e';
            } break;
            case 0 : {
                return 'orangered';
            } break;
            case 2 : {
                return 'inProcess';
            }  break;
        }
    });

    Handlebars.registerHelper('getStatusColor', function(shipStatus) {
        switch (shipStatus) {
            case 1 : {
                return '#138b0e';
            } break;
            case 0 : {
                return 'orangered';
            } break;
            case 2 : {
                return 'inProcess';
            }  break;
        }
    });

    Handlebars.registerHelper('getStatus', function(truckStatus) {
        switch (truckStatus) {
            case 1 : {
                return '#2B42C9';
            } break;
            case 0 : {
                return 'orange';
            } break;
        }
    });

}

