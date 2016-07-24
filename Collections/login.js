if (Meteor.isClient) {


    Template.login.events({
        'submit form': function (event) {
            event.preventDefault();
            var userVar = event.target.loginUser.value;
            var passwordVar = event.target.loginPassword.value;
            if (userVar == 'sandbox') {

            } else {
                Meteor.loginWithPassword(userVar, passwordVar);
                FlowRouter.go('/');
            }

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
