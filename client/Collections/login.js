


    Template.login.events({
        'submit form': function (event) {
            event.preventDefault();
            var userVar = event.target.loginUser.value;
            var passwordVar = event.target.loginPassword.value;
            Meteor.loginWithPassword(userVar, passwordVar, function(){
               if(Meteor.userId()){
                   FlowRouter.go('/');
               } else {
                  Bert.alert('User or Password wrong', 'danger', 'growl-top-left');
                   }
            });
        },

        'click .loginSubmit': function() {
            Bert.alert('Loading', 'success', 'growl-top-left');
        }

    });




    Template.MainLayout.events({
        'click .logout': function (event) {
            event.preventDefault();
            Meteor.logout();
            FlowRouter.go('/');
        }
    });




