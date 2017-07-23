
Template.adminViewUser.helpers({

    userResult: function () {
        Meteor.call('adminUserLoggedIn', function(error, usersReturn) {
            if (error) {
                console.log('error', error)
            } else {
                Session.set('usersReturn', usersReturn);
            }
        });
          const usersReturn = Session.get('usersReturn');
          return usersReturn;
    }

});