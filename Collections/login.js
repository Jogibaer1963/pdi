if (Meteor.isClient) {


    Template.login.events({
        'submit form': function (event) {
            event.preventDefault();
            var userVar = event.target.loginUser.value;
            var passwordVar = event.target.loginPassword.value;
            Meteor.loginWithPassword(userVar, passwordVar, function(error){
               if(Meteor.userId()){
                   console.log('Loading');
                   FlowRouter.go('/');
               } else {
                   Session.set('errorLogIn', error.reason);
                   }
            });
        }
    });


    Template.login.helpers({
        errorLogIn: function() {
            var errorLogIn = Session.get('errorLogIn');
            return errorLogIn;
        }

    });


    Template.MainLayout.events({
        'click .logout': function (event) {
            event.preventDefault();
            Meteor.logout();
            FlowRouter.go('/');
        }
    });

    Template.shippingLayout.events({
        'click .logout': function (event) {
            event.preventDefault();
            Meteor.logout();
            FlowRouter.go('/');
        }
    });

    Template.pdiLayout.events({
        'click .logout': function (event) {
            event.preventDefault();
            Meteor.logout();
            FlowRouter.go('/');
        }
    });

    Template.repairLayout.events({
        'click .logout': function (event) {
            event.preventDefault();
            Meteor.logout();
            FlowRouter.go('/');
        }
    });

    Template.washLayout.events({
        'click .logout': function (event) {
            event.preventDefault();
            Meteor.logout();
            FlowRouter.go('/');
        }
    });

}
