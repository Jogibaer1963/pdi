if(Meteor.isClient) {

    Template.statisticView.helpers({
        overView: function() {
           return MachineReady.find({}, {sort: {date: -1}});
        }
    });
}
