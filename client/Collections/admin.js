if (Meteor.isClient) {

    Accounts.ui.config({
        passwordSignupFields: "USERNAME_ONLY"
    });



    Template.register.events({
        'submit form': function (event) {
            event.preventDefault();
            const userconst = event.target.registerUser.value;
            const passwordconst = event.target.registerPassword.value;
            const role = event.target.registerRole.value;
            Accounts.createUser({
                username: userconst,
                password: passwordconst
            });
            Meteor.call('accountRole', userconst, role);
        }
    });


    Template.register.helpers({
        firstName: function() {
            return Meteor.user().username;
        }
    });

    Template.dataBase.helpers({
           shipList: function() {
                const remove = repairPrint.find({}).count();
                const  idSearch = [];
                for(i = 0; i > remove; i ++) {
                   const id_Search = repairPrint.find({}, {fields: {_id: 1}}).fetch();
                   idSearch.push(id_Search);
                 }
           }
    });

    Template.emailTest.events({
        'click .emailButton': function (e) {
            e.preventDefault();
            Meteor.call('sendEmail', 'juergen.hauser@claas.com, jogibaer99@gmail.com', 'Claas_Quality@mailgun.com', 'Parts Order request');
        }
    });



}