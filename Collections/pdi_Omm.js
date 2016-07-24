if(Meteor.isClient) {

    Template.pdi_Omm.events({

        'click .mainOm': function() {
            event.preventDefault();
            var om = ommMain.find({}).fetch();
            Session.set('om', om);
        },

        'click .suppOm': function() {
            event.preventDefault();
            var omSupp = ommSupp.find({}).fetch();
            console.log(omSupp);
            Session.set('omSupp', omSupp);
        }


    });

    Template.omMain.helpers({

        mainOm: function() {
            return Session.get('om');
        }    
    });
    
    Template.suppOm.helpers({
        suppOm: function() {
            return Session.get('omSupp');
        }
    });


    Template.mainOmmInput.events({

        'submit .mainOm': function(event) {
            event.preventDefault();
            var omPartNr = event.target.mainOmmPartNr.value;
            console.log('test');
            console.log(omPartNr);
        }
    })
}