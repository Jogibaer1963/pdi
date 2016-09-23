if(Meteor.isClient) {

    Template.statisticView.helpers({
        overView: function() {
           return MachineReady.find({}, {sort: {date: -1}});
        }
    });


    Template.statistics.events({
        'click #buttonDownload': function () {

            var nameFile = 'fileDownloaded.csv';
            Meteor.call('download_statistics', function (err, fileContent) {
                if (fileContent) {
                    var blob = new Blob([fileContent], {type: "text/plain;charset=utf-8"});
                    saveAs(blob, nameFile);
                }
            });
        }

    });
}
