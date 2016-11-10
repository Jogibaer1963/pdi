if (Meteor.isClient) {

    Template.overViewWashList.helpers({
        overView: function() {
            return MachineReady.find({$and:[{machineId: {$gt: 'C000000'}},
                {$or: [{washStatus: 0},{washStatus: 2}]},
                {$or: [{pdiStatus:0}, {pdiStatus: 1}]},
                {$or: [{repairStatus: 0}, {repairStatus: 1}]}
                ]}, {sort: {date: 1}});

        },

        'selectedClass': function() {
            var checkPoint = this._id;
            var selectedMachineId = Session.get('selectedMachineId');
            if (selectedMachineId == checkPoint) {
                return "selected_2"
            }
        },

       'inActive': function() {
          var status = MachineReady.find({'washStatus': 2}).count();
            if (status > 0) {
              return 'inActiveButton';
               } else {
            }
        },

        'forbiddenButton': function() {
            var washId = MachineReady.findOne({washStatus: 2}, {fields: {_id:1}});
            if(typeof washId !== 'undefined') {
                var washMeId = JSON.stringify(washId);
                var res = washMeId.slice(8, 25);
                var selectedMachine = Session.get('selectedMachineId');
                    if(selectedMachine != res ) {
                        return 'inActiveButton';
                       } else {}
            } else { return 'inActiveButton'}
        }
    });

    Template.overViewWashList.events({
        'click .readyWash': function () {
            var checkPoint = this._id;
            Session.set('selectedMachineId', checkPoint);
        },

        'click .machineInWashBay': function() {
            event.preventDefault();
            var selectedMachineId = Session.get('selectedMachineId');
            var dateStart = Date.now();
            Meteor.call('updateWashList', selectedMachineId, dateStart);
        },

        'click .stopWashProcess': function() {
            event.preventDefault();
            var selectedMachineId = Session.get('selectedMachineId');
            Meteor.call('stopWashing', selectedMachineId);
        },

        'click .machineOutWashBay': function() {
            event.preventDefault();
            var dateStop = Date.now();
            var selectedMachineId = Session.get('selectedMachineId');
            var startTime = MachineReady.findOne({_id: selectedMachineId}, {fields: {startWashDate: 1, _id: 0}});
            var startWashTime = JSON.stringify(startTime).slice(-14);
            var startRealWashTime = startWashTime.slice(0,13);
            var diffTime = dateStop - startRealWashTime;
            var washDuration = convertMS(diffTime);
            var unixTime = MachineReady.findOne({_id: selectedMachineId}, {fields: {unixTime: 1, _id: 0}});
            var startUnixTime = JSON.stringify(unixTime).slice(-14);
            var startAfterCreateTime = startUnixTime.slice(0,13);
            var diffCreateTime = startRealWashTime - startAfterCreateTime;
            var waitWashTime = convertMS(diffCreateTime);
            Meteor.call('finishWashing', selectedMachineId, dateStop, washDuration, waitWashTime);
        },

        'submit .locationId': function(event) {
            event.preventDefault();
            var selectedPdiMachine = Session.get('selectedMachineId');
            if(typeof selectedPdiMachine === 'undefined') {
                alert('Mark the Machine first before update the Location');
            }
            var locationId = event.target.locationId.value;
            Meteor.call('locationUpdate', selectedPdiMachine, locationId);
            event.target.locationId.value="";
            Session.set('selectedMachineId', '');
        },

        'submit .washBayMessanger': function(event) {
            event.preventDefault();
            var messageId = event.target.messageId.value;
            Meteor.call('messageToWashBay_2', messageId);
            event.target.messageId.value="";
        }
    });


    Template.messageTemplate.helpers({
        washMessage: function() {
            return washBayText.find({active: 1});

        },

        'selectedClass': function() {
            var message = this._id;
            var selectedMessage = Session.get('selectedMessage');
            if (selectedMessage == message) {
                return "selected_2"
            }
        }
        
    });
        
    Template.messageTemplate.events({
        'click .textMessage': function () {
            var message = this._id;
            Session.set('selectedMessage', message);
        },
        
        'click .messageButton': function() {
            event.preventDefault();
            userWashBay = Meteor.userId();
            var removeId = Session.get('selectedMessage');
            Meteor.call('removeText', removeId, userWashBay);
        }
        
    });

    
 function convertMS(ms) {
     var d, h, m, s;
     s = Math.floor(ms / 1000);
     m = Math.floor(s / 60);
     s = s % 60;
     h = Math.floor(m / 60);
     m = m % 60;
     d = Math.floor(h / 24);
     h = h % 24;
     return(   d + ' d '  + h + ' h ' + m + ' m '  + s +' s');
 }


}


