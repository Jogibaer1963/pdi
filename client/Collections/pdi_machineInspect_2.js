if(Meteor.isClient) {

    Template.pdiCheckList.helpers({

        'selectedClass': function() {
            event.preventDefault();
            const checkPoint = this._id;
            const selectedCheckPoint = Session.get('selectedCheckPoint');
            if (selectedCheckPoint === checkPoint) {
                return "selected"
            }
        },

        'checkMe': function() {
            event.preventDefault();
            const machineId = Session.get('selectedPdiMachine');
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
            const openInspect = this._id;
            Session.set('selectedCheckPoint', openInspect);
            const repOrder = checkPoints.findOne({_id: openInspect});
            Session.set('repairOrder', repOrder);
        },

        'click .good': function(event) {
            event.preventDefault();
            const selectedCheckPoint = Session.get('selectedCheckPoint');
            const selectedPdiMachineId = Session.get('selectedPdiMachine');
            Meteor.call('removeCheckPoint', selectedPdiMachineId, selectedCheckPoint)
        },

        'click .bad': function(event) {
            event.preventDefault();
            const selectedCheckPoint = Session.get('selectedCheckPoint');
            if(selectedCheckPoint === "" ) {
            } else {
                Session.set('selectedPdiMachine', localStorage.getItem('selectedPdi'));
                const selectedPdiMachineId = Session.get('selectedPdiMachine');
                const repOrder = Session.get('repairOrder');
                const machineNr = Session.get('pdiMachineNumber');
                Meteor.call('addToCheckList', selectedPdiMachineId, repOrder, selectedCheckPoint, machineNr);
                Session.set('selectedCheckPoint', '');
                Session.set('repairOrder', '');
            }
        },

        'click .machineNewAtt': function() {
            event.preventDefault();
            const specialAtt = 1;
            Session.set('specialAtt', specialAtt);
         },

        'submit .addCheckPointsToList': function(event) {
            event.preventDefault();
            const errorCodeMissing = "Error Code Missing";
            Session.set('pdiMachineNumber', localStorage.getItem('pdiMachine'));
            Session.set('selectedPdiMachine', localStorage.getItem('selectedPdi'));
            const machineNr = Session.get('pdiMachineNumber');
            const selectedPdiMachineId = Session.get('selectedPdiMachine');
            const failureId = event.target.failureId.value;
            let failureAddDescription = event.target.failureDescription.value;
            const specialAtt = Session.get('specialAtt');
            if(specialAtt === 1) {
               const addText = '**********';
               failureAddDescription = addText + ' ' + failureAddDescription + ' ' + addText;
            }
            if(failureId === "") {
            } else {
            const orderId = machineNr + (new Date().getTime());
            const repOrder = {'_id': orderId, 'errorNr': failureId, 'errorDescription': failureAddDescription};
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
            const checkPoint = this._id;
            const selectedCheckPoint = Session.get('selectedCheckPoint');
            if (selectedCheckPoint === checkPoint) {
                console.log(selectedCheckPoint);
                return "selected"
            }
        },

        foundNewFailure: function() {
            event.preventDefault();
            Session.set('selectedPdiMachine', localStorage.getItem('selectedPdi'));
            const selectedPdiMachineId = Session.get('selectedPdiMachine');
            return  InspectedMachines.findOne({_id: selectedPdiMachineId});
        }

    });


    Template.addPdiItems.events({
        'click .posPdiFinished': function() {
            event.preventDefault();
            window.confirm("PDI Finished ?");
            if(confirm("PDI Finished") === true) {
            } else {
                return false;
            }
            const dateStop = Date.now();
            Session.set('selectedPdiMachine', localStorage.getItem('selectedPdi'));
            const selectedPdiMachine = Session.get('selectedPdiMachine');
            const startTime = MachineReady.findOne({_id: selectedPdiMachine}, {fields: {startPdiDate: 1, _id: 0}});
            const startPdiTime = JSON.stringify(startTime).slice(-14);
            const startRealPdiTime = startPdiTime.slice(0,13);
            const diffTime = dateStop - startRealPdiTime;
            const pdiDuration = convertMS(diffTime);
            const unixTime = MachineReady.findOne({_id: selectedPdiMachine}, {fields: {unixTime: 1, _id: 0}});
            const startUnixTime = JSON.stringify(unixTime).slice(-14);
            const startAfterCreateTime = startUnixTime.slice(0,13);
            const diffCreateTime = startRealPdiTime - startAfterCreateTime;
            const waitPdiTime = convertMS(diffCreateTime);
            Session.set('pdiMachineNumber', localStorage.getItem('pdiMachine'));
            const pdiMachine = Session.get('pdiMachineNumber');
            Meteor.call('machineInspected', selectedPdiMachine, dateStop, pdiDuration, waitPdiTime, pdiMachine);
            FlowRouter.go('inspectionStart');
        },

        'click .showFinalCheck': function() {
            event.preventDefault();
            const openInspect = this._id;
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
            const checkPoint = this._id;
            const selectedCheckPoint = Session.get('selectedFailure');
            if (selectedCheckPoint === checkPoint) {
                return "selected"
            }
        }
    });

    Template.chooseFailureList.events({

        'click .showFailureList': function() {
            event.preventDefault();
            Session.set('selectedErrorId', '');
            const failureId = this._id;
            Session.set('selectedFailure', failureId);
            const errorId = FailuresList.findOne({_id: failureId}).errorid;
            Session.set('selectedErrorId', errorId);
        }

    });


    Template.washBayMessage.helpers({
        

    });

    Template.washBayMessage.events({
        'submit .messageToWashBay': function() {
            event.preventDefault();
            const washMessage = event.target.message.value;
            const machineNr = Session.get('pdiMachineNumber');
            const machine_id = Session.get('selectedPdiMachine');
            Meteor.call('messageToWashBay', machineNr, washMessage, machine_id);
            event.target.message.value = '';
            }
    });

}


function convertMS(ms) {
    let d, h, m, s;
    s = Math.floor(ms / 1000);
    m = Math.floor(s / 60);
    s = s % 60;
    h = Math.floor(m / 60);
    m = m % 60;
    d = Math.floor(h / 24);
    h = h % 24;
    return(   d + ' d '  + h + ' h ' + m + ' m '  + s +' s');
}

