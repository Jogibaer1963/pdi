
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


Template.adminViewUser.events({

   "click .adminUserLog": function () {
       event.preventDefault();
        const logOutUser = [];
        $('input[name=logOut]:checked').each(function () {
            logOutUser.push($(this).val());
        });
        Meteor.call('userManualLogout', logOutUser);
   }
});