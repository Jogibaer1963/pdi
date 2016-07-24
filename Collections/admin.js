if (Meteor.isClient) {

    Accounts.ui.config({
        passwordSignupFields: "USERNAME_ONLY"
    });



    Template.register.events({
        'submit form': function (event) {
            event.preventDefault();
            var userVar = event.target.registerUser.value;
            var passwordVar = event.target.registerPassword.value;
            var role = event.target.registerRole.value;
            Accounts.createUser({
                username: userVar,
                password: passwordVar
            });
            Meteor.call('accountRole', userVar, role);
        }
    });


    Template.register.helpers({
        firstName: function() {
            return Meteor.user().username;
        }
    });

    Template.dataBase.events({
        'click .start': function(e) {
            e.preventDefault();
            console.log('test');
           Meteor.call('remove_Fields');
        }
    });

    Template.dataBase.helpers({
           shipList: function() {
                var remove = repairPrint.find({}).count();
               console.log(remove);
                var  idSearch = [];
                for(i = 0; i > remove; i ++) {
                    console.log(i);
                   var id_Search = repairPrint.find({}, {fields: {_id: 1}}).fetch();
                    console.log('da ' +  id_Search);
                   idSearch.push(id_Search);
                 }
              console.log(idSearch);

           }

    })



}