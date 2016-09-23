


    Template.login.events({
        'submit form': function (event) {
            event.preventDefault();
            var userVar = event.target.loginUser.value;
            var passwordVar = event.target.loginPassword.value;
            Meteor.loginWithPassword(userVar, passwordVar, function(){
               if(Meteor.userId()){
                   FlowRouter.go('/');
               } else {
                  Bert.alert('User or Password wrong', 'danger', 'growl-top-right');
                   }
            });
        },

        'click .loginSubmit': function() {
            Bert.alert('Loading', 'success', 'growl-top-right');
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


