/* 

if(Meteor.isClient) {




    var timer = new Chronos.Timer(100);
    var counter = 0;
    var minutes = 0;

    Template.repairPdiMachineStart.helpers({

        time: function () {
            var timeNow = Session.get('timeStamp');
            var timeCount = ((timer.time.get()  / 1000).toFixed(0)) - timeNow;
            if(timeCount < 0) {
                timeCount = 0;
            }
            Session.set('timeCount', timeCount);
            if(timeCount >= 60){
                minutes ++;
                var timeStamp = (Date.now() / 1000).toFixed(0);
                Session.set('timeStamp', timeStamp);
            }
            if(timeCount == 'NaN') {
                timeCount = 0;
            }
            return (minutes + ' : ' +  timeCount);
        },

        machineNr: function() {
            event.preventDefault();
            var user = Meteor.user().username;
            var machineNr = Session.get('machineNr');
            return machineNr + ' performed by ' + user;
        }

    });



    Template.repairPdiMachineStart.events({

        'click .backButton': function() {
            event.preventDefault();
            timer.stop();
            counter = 0;
            Meteor.call('stopRepair');
            FlowRouter.go('repairView');
        },

        'click .startProcessButton': function () {
            event.preventDefault();
            var selectedMachineId = Session.get('selectedMachineId');
            var dateNow = (Date.now());
            var timeStamp = (Date.now() / 1000).toFixed(0);
            Meteor.call('updateRepairList', selectedMachineId, dateNow);
            Session.set('timeStamp', timeStamp);
            timer.start();
            var processStartTime = Date.now();
            Session.set('startProcess', processStartTime);
        },

        'click #stopButton': function() {
                event.preventDefault();
            timer.stop();
            var dateStop = Date.now();
            var selectedMachineId = Session.get('selectedMachineId');
            var startTime = MachineReady.findOne({_id: selectedMachineId}, {fields: {startRepairDate: 1, _id: 0}});
            var startRepairTime = JSON.stringify(startTime).slice(-14);
            var startRealRepairTime = startRepairTime.slice(0,13);
            var diffTime = dateStop - startRealRepairTime;
            var repairDuration = convertMS(diffTime);
            var unixTime = MachineReady.findOne({_id: selectedMachineId}, {fields: {unixTime: 1, _id: 0}});
            var startUnixTime = JSON.stringify(unixTime).slice(-14);
            var startAfterCreateTime = startUnixTime.slice(0,13);
            var diffCreateTime = startRealRepairTime - startAfterCreateTime;
            var waitRepairTime = convertMS(diffCreateTime);
            counter = 0;
            minutes = 0;
            Meteor.call('machineRep', selectedMachineId, dateStop, repairDuration, waitRepairTime);
            FlowRouter.go('repairView');
        },

        'click #myonoffswitch': function() {
            if(counter == 0) {
                counter ++;
                timer.stop();
            } else {
                counter = 0;
                timer.start();
                var pauseTime = Session.get('timeCount');
                var timeStamp = (Date.now() / 1000).toFixed(0);
                var newTimeStart = timeStamp - pauseTime;
                Session.set('timeStamp', newTimeStart);
            }
        }

    });

    Template.repairOrder.helpers({

        'selectedClass': function() {
            var repairList = this._id;
            var selectedRepairPoint = Session.get('selectedCheckPoint');
            if (selectedRepairPoint == repairList) {
                return "selected"
            }
        },

        foundNewFailure: function() {
            event.preventDefault();
            var selectedPdiMachineId = Session.get('selectedMachineId');
            return  InspectedMachines.findOne({_id: selectedPdiMachineId});
        }

    });

    Template.repairOrder.events({

        'click .showCheckList': function() {
                var openRepair = this._id;
                Session.set('selectedCheckPoint', openRepair);
        },

        'click .repairButton': function() {
            event.preventDefault();
            var id = Session.get('selectedMachineId');
            var id2 = Session.get('selectedCheckPoint');
            Meteor.call('removeRepairItem', id, id2);
        }


    });



}


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

*/    