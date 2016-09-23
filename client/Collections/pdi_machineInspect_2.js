if(Meteor.isClient) {

    Template.pdiCheckList.helpers({

        'selectedClass': function() {
            event.preventDefault();
            var checkPoint = this._id;
            var selectedCheckPoint = Session.get('selectedCheckPoint');
            if (selectedCheckPoint == checkPoint) {
                return "selected"
            }
        },

        'checkMe': function() {
            event.preventDefault();
            var machineId = Session.get('selectedPdiMachine');
            return pdiCheckPoints.find({_id: machineId}, {sort: {'errorPos': 1}});
        },

        failureId: function() {
            event.preventDefault();
                 return Session.get('selectedErrorId');
        }

    });

    Template.pdiCheckList.events({

        'click .showCheckList': function(event) {
            event.preventDefault();
            var openInspect = this._id;
            Session.set('selectedCheckPoint', openInspect);
            var repOrder = checkPoints.findOne({_id: openInspect});
            Session.set('repairOrder', repOrder);
        },

        'click .good': function(event) {
            event.preventDefault();
            var selectedCheckPoint = Session.get('selectedCheckPoint');
            var selectedPdiMachineId = Session.get('selectedPdiMachine');
            Meteor.call('removeCheckPoint', selectedPdiMachineId, selectedCheckPoint)
        },

        'click .bad': function(event) {
            event.preventDefault();
            var selectedCheckPoint = Session.get('selectedCheckPoint');
            if(selectedCheckPoint == "" ) {
            } else {
                Session.set('selectedPdiMachine', localStorage.getItem('selectedPdi'));
                var selectedPdiMachineId = Session.get('selectedPdiMachine');
                var repOrder = Session.get('repairOrder');
                var machineNr = Session.get('pdiMachineNumber');
                Meteor.call('addToCheckList', selectedPdiMachineId, repOrder, selectedCheckPoint, machineNr);
                Session.set('selectedCheckPoint', '');
                Session.set('repairOrder', '');
            }
        },

        'click .machineNewAtt': function() {
            event.preventDefault();
            var specialAtt = 1;
            Session.set('specialAtt', specialAtt);
         },

        'submit .addCheckPointsToList': function(event) {
            event.preventDefault();
            var errorCodeMissing = "Error Code Missing";
            Session.set('pdiMachineNumber', localStorage.getItem('pdiMachine'));
            Session.set('selectedPdiMachine', localStorage.getItem('selectedPdi'));
            var machineNr = Session.get('pdiMachineNumber');
            var selectedPdiMachineId = Session.get('selectedPdiMachine');
            var failureId = event.target.failureId.value;
            var failureAddDescription = event.target.failureDescription.value;
            var specialAtt = Session.get('specialAtt');
            if(specialAtt == 1) {
               var addText = '**********';
               failureAddDescription = addText + ' ' + failureAddDescription + ' ' + addText;
            }
            if(failureId == "") {
            } else {
            var orderId = machineNr + (new Date().getTime());
            var repOrder = {'_id': orderId, 'errorNr': failureId, 'errorDescription': failureAddDescription};
            Meteor.call('addToCheckListNew', selectedPdiMachineId, repOrder, machineNr);
            event.target.failureId.value = '';
            event.target.failureDescription.value = '';
                Session.set('specialAtt', '');
            }
        }
    });


    Template.addPdiItems.helpers({

        'selectedClass': function() {
            event.preventDefault();
            var checkPoint = this._id;
            var selectedCheckPoint = Session.get('selectedCheckPoint');
            if (selectedCheckPoint == checkPoint) {
                return "selected"
            }
        },

        foundNewFailure: function() {
            event.preventDefault();
            Session.set('selectedPdiMachine', localStorage.getItem('selectedPdi'));
            var selectedPdiMachineId = Session.get('selectedPdiMachine');
            return  InspectedMachines.findOne({_id: selectedPdiMachineId});
        }

    });


    Template.addPdiItems.events({
        'click .posPdiFinished': function() {
            event.preventDefault();
            window.confirm("PDI Finished ?");
            if(confirm("PDI Finished") == true) {

            } else {
                return false;
            }
            var dateStop = Date.now();
            Session.set('selectedPdiMachine', localStorage.getItem('selectedPdi'));
            var selectedPdiMachine = Session.get('selectedPdiMachine');
            var startTime = MachineReady.findOne({_id: selectedPdiMachine}, {fields: {startPdiDate: 1, _id: 0}});
            var startPdiTime = JSON.stringify(startTime).slice(-14);
            var startRealPdiTime = startPdiTime.slice(0,13);
            var diffTime = dateStop - startRealPdiTime;
            var pdiDuration = convertMS(diffTime);
            var unixTime = MachineReady.findOne({_id: selectedPdiMachine}, {fields: {unixTime: 1, _id: 0}});
            var startUnixTime = JSON.stringify(unixTime).slice(-14);
            var startAfterCreateTime = startUnixTime.slice(0,13);
            var diffCreateTime = startRealPdiTime - startAfterCreateTime;
            var waitPdiTime = convertMS(diffCreateTime);
            Meteor.call('machineInspected', selectedPdiMachine, dateStop, pdiDuration, waitPdiTime);
            FlowRouter.go('inspectionStart');
        },

        'click .showFinalCheck': function() {
            event.preventDefault();
            var openInspect = this._id;
            Session.set('selectedCheckPoint', openInspect);
        }

    });


    Template.chooseFailureList.helpers({
        
        failureList: function () {
            event.preventDefault();
            Session.set('selectedFailure', "");
            return FailuresList.find({}, {sort: {error_describ: 1}});
        },

        'selectedClass': function() {
            event.preventDefault();
            var checkPoint = this._id;
            var selectedCheckPoint = Session.get('selectedFailure');
            if (selectedCheckPoint == checkPoint) {
                console.log('entdeckt');
                return "selected"
            }
        }
    });

    Template.chooseFailureList.events({

        'click .showFailureList': function() {
            event.preventDefault();
            Session.set('selectedErrorId', '');
            var failureId = this._id;
            Session.set('selectedFailure', failureId);
            var errorId = FailuresList.findOne({_id: failureId}).errorid;
            Session.set('selectedErrorId', errorId);
        }

    });


    Template.washBayMessage.helpers({
        

    });

    Template.washBayMessage.events({
        'submit .messageToWashBay': function() {
            event.preventDefault();
            var washMessage = event.target.message.value;
            var machineNr = Session.get('pdiMachineNumber');
            var machine_id = Session.get('selectedPdiMachine');
            Meteor.call('messageToWashBay', machineNr, washMessage, machine_id);
            event.target.message.value = '';
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

