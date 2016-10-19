if(Meteor.isServer){

    Meteor.startup( function() {

        Meteor.publish("overView", function () {
            return MachineReady.find({}, {fields: {machineId: 1, date: 1, pdiStatus: 1,
            repairStatus: 1, washStatus: 1, shipStatus: 1, locationId: 1}});
        });

        Meteor.publish("MachineReady", function () {
            return MachineReady.find()
        });

        Meteor.publish("machineReadyToGo", function(){
            return MachineReady.find();
        });

        Meteor.publish("failures", function(){
            return FailuresList.find();
        });

        Meteor.publish("checkpoints", function(){
            return checkPoints.find();
        });

        Meteor.publish("inspectedMachines", function() {
            return InspectedMachines.find();
        });

        Meteor.publish("pdiCheckList", function(){
            return pdiCheckPoints.find();
        });

        Meteor.publish("headerTrailer", function(){
            return headerTrailer.find();
        });

        Meteor.publish("washBayText", function(){
            return washBayText.find();
        });

        Meteor.publish("repairOrderPrint", function(){
            return repairPrint.find();
        });

        Meteor.publish("siList", function(){
            return siList.find();
        });

        Meteor.publish("ommMain", function(){
            return ommMain.find();
        });

        Meteor.publish("ommSupp", function(){
            return ommSupp.find();
        });

        Meteor.publish("ommUnload", function(){
            return ommUnload.find();
        });

        Meteor.publish("ommCebisMo", function(){
            return ommCebisMo.find();
        });

        Meteor.publish("ommTeraTrack", function(){
            return ommTeraTrack.find();
        });

        Meteor.publish("ommProfiCam", function(){
            return ommProfiCam.find();
        });
    });

    Meteor.methods({

        'remove_Fields': function() {
            var count = repairPrint.find().count();
            console.log(count);
            repairPrint.updateMany({}, {$unset: {Repair_Comments: ''}});

        },

        'removeSiMachine': function(removeSiItem) {
            siList.remove({_id: removeSiItem});
        },

        'siList': function(machine, siItemText) {
            siList.insert({machineNr: machine, errorDescription: siItemText});
        },

        'download_2': function (machineNr) {
            var collection = repairPrint.find({Machine_Nr: machineNr}, {fields: {Machine_Nr: 0, _id: 0}}).fetch();
            var heading = true;
            var delimiter = ";";
            return exportcsv.exportToCSV(collection, heading, delimiter);
        },

        'download_statistics': function () {
        var collection = MachineReady.find({}, {fields: {machineId: 1, dateOfCreation: 1, waitPdiTime: 1, date: 1,  pdiDuration: 1, _id: 0 }}).fetch();
        var heading = true;
        var delimiter = ";";
        return exportcsv.exportToCSV(collection, heading, delimiter);
    },

        'removeText': function(removeId, userWashBay) {
            washBayText.update({_id: removeId}, {$set: {active: 0, user: userWashBay}});
        },

        'messageToWashBay': function(machineNr, washMessage, machine_id) {
            washBayText.insert({machineNr: machineNr, washBayMessage: washMessage, active: 1});
            MachineReady.update({_id: machine_id}, {$set: {washStatus: 0}});
        },

        'accountRole': function(userVar, role) {
            var id = Meteor.users.find({username: userVar}, {fields: {_id: 1}}).fetch();
            var idString = JSON.stringify(id);
            var idResult = idString.slice(9, 26);
            Meteor.users.update({_id: idResult}, {$set: {roles: [role]}});
        },

        'truckRemoved': function(machineId, truckStatus) {
            MachineReady.update({_id: machineId}, {$set: {truckStatus: truckStatus}});
        },

        'truckOrdered': function(machineId, truckStatus) {
            MachineReady.update({_id: machineId}, {$set: {truckStatus: truckStatus}});
        },

        'insertHeadTrailer': function(headTransporter, trailerId) {
            headerTrailer.insert({status: '1', headTransporter: headTransporter, newTrailer: trailerId});
        },

        'updateHeadTrailer': function(trailerId, newStatus) {
            headerTrailer.update({_id: trailerId}, {$set: {status: newStatus}});
        },

        'deleteTrailer': function(trailerId) {
            headerTrailer.remove({_id: trailerId});
        },

        'cancelPdi': function(pdiMachineId) {
            InspectedMachines.remove({_id: pdiMachineId});
            pdiCheckPoints.remove({_id: pdiMachineId});
            MachineReady.update({_id: pdiMachineId}, {$set: {pdiStatus: 0}});
        },

        'finnishPdi': function(pdiMachineId) {
            pdiCheckPoints.remove({});
            MachineReady.update({_id: pdiMachineId}, {$set: {pdiStatus: 1}});
        },

        'inputNewCheckPoint': function(status, errorPos, errorNr, errorDescription, range) {
            checkPoints.insert({status: status, errorPos: errorPos, errorNr: errorNr,
                errorDescription: errorDescription, machineRange: range});
        },

        'editCheckPoint': function(checkId, status, errorPos, errorNr, errorDescription, machineRange) {
            checkPoints.update({_id: checkId}, {$set: {status: status, errorPos: errorPos, errorNr: errorNr,
                errorDescription: errorDescription, machineRange: machineRange}});
        },

        'deactivateCheckPoint': function(deactivateCheck, status) {
            checkPoints.update({_id: deactivateCheck}, {$set: {status: status}})
        },

        'reActiveCheck': function(reActiveCheck, status) {
            checkPoints.update({_id: reActiveCheck}, {$set: {status: status}})
        },

        'editCheckpoint': function(checkPointId, status, errorPos, errorNr, errorDescription, machineRange) {
            checkPoints.update({_id: checkPointId}, {$set: {status: status, errorPos: errorPos, errorNr: errorNr,
                errorDescription: errorDescription, machineRange: machineRange}});
        },

        'generatePdiList': function(selectedPdiMachineId, dateStart, selectedPdiMachineNr, range) {
            pdiCheckPoints.insert({_id: selectedPdiMachineId});
            InspectedMachines.remove({_id: selectedPdiMachineId});
            MachineReady.update({_id: selectedPdiMachineId}, {$set: {pdiStatus: 2, startPdiDate: dateStart}});
            InspectedMachines.insert({_id: selectedPdiMachineId, machineId: selectedPdiMachineNr});
            checkPoints.find({status: 1, machineRange: {$in: range}}, {sort: {errorPos: 1}}).forEach(function(copy){
                pdiCheckPoints.update({_id: selectedPdiMachineId}, {$addToSet: {checkList: (copy)}});
            });
            pdiCheckPoints.update({_id: selectedPdiMachineId}, {$pull: {checkList: {status: 0}}});
            var list = siList.find({machineNr: selectedPdiMachineNr}, {limit:1}).fetch();
            if(list == '') {
            } else {
                siList.find({machineNr: selectedPdiMachineNr}).forEach(function(repOrder){
                    InspectedMachines.upsert({_id: selectedPdiMachineId}, {$addToSet: {repOrder}});
                });
            }
        },

        'removeRepairItem': function(id, id2) {
            InspectedMachines.update({_id: id}, {$pull: {repOrder: {_id: id2}}});
        },

        'removeCheckPoint': function(selectedPdiMachineId, selectedCheckPoint) {
            pdiCheckPoints.update({_id: selectedPdiMachineId}, {$pull: {checkList: {_id: selectedCheckPoint}}});
        },

        'addToCheckList': function(selectedPdiMachineId, repOrder, selectedCheckPoint, machineNr) {
            InspectedMachines.upsert({_id: selectedPdiMachineId}, {$addToSet: {repOrder}});
            pdiCheckPoints.update({_id: selectedPdiMachineId}, {$pull: {checkList: {_id: selectedCheckPoint}}});
            var errorNr = checkPoints.find({_id:selectedCheckPoint}, {fields: {errorNr: 1}}).fetch();
            var stringError = JSON.stringify(errorNr).slice(39,-3);
            var descriptionNr = checkPoints.find({_id:selectedCheckPoint}, {fields: {errorDescription: 1}}).fetch();
            var stringDescription = JSON.stringify(descriptionNr).slice(48,-3);
            repairPrint.insert({Machine_Nr: machineNr, Error_Nr: stringError, Error_Description: stringDescription, Repair_Comments: " ", Issue_Resolved: " "});
        },

        'addToCheckListNew': function(selectedPdiMachineId, repOrder, machineNr) {
            InspectedMachines.upsert({_id: selectedPdiMachineId}, {$addToSet: {repOrder}});
            var stringError = JSON.stringify(repOrder).slice(42,46);
            var stringDescription = JSON.stringify(repOrder).slice(68,-2);
            repairPrint.insert({Machine_Nr: machineNr, Error_Nr: stringError, Error_Description: stringDescription, Repair_Comments: " ", Issue_Resolved: " "});
        },

        'pdiMachineInspected': function(selectedPdiMachineId, loggedInUser, ommMain, ommSupp, ommFitting, ommTerra, ommCebis, ommProfiCam) {
            InspectedMachines.update({_id: selectedPdiMachineId}, {$set: {user: loggedInUser, ommMain: ommMain, ommSupp: ommSupp,
                ommFitting: ommFitting, ommTerra: ommTerra, ommCebis: ommCebis, ommProfiCam: ommProfiCam}})
        },

        'removeFailureId': function(selectedFailurePoint) {
            FailuresList.remove({_id: selectedFailurePoint});
        },

        'insertFailureId': function(newErrorId, newErrorDescribe) {
            FailuresList.insert({errorid: newErrorId, error_describ: newErrorDescribe});
        },

        'stopWashing': function(selectedCheckPoint) {
            MachineReady.update({_id:selectedCheckPoint}, {$set: {washStatus: 0}});
        },

        'stopPdi': function(selectedCheckPoint) {
            MachineReady.update({_id:selectedCheckPoint}, {$set: {pdiStatus: 0}});
        },

        'stopRepair': function(selectedCheckPoint) {
            MachineReady.update({_id:selectedCheckPoint}, {$set: {repairStatus: 0}});
        },

        'skipPdi': function(pdiMachineId) {
            MachineReady.update({_id: pdiMachineId}, {$set: {pdiStatus: 1}});
        },

        'finishWashing': function(selectedCheckPoint, dateStop, washDuration, waitWashTime) {
            MachineReady.update({_id:selectedCheckPoint}, {$set: {washStatus: 1, stopWashDate: dateStop, washDuration: washDuration, waitWashTime: waitWashTime}});
        },

        'locationUpdate': function(selectedPdiMachine, locationId) {
            MachineReady.update({_id: selectedPdiMachine}, {$set: {locationId: locationId}});
        },

        'reserveUpdate': function(selectedPdiMachine, reservedId) {
            MachineReady.update({_id: selectedPdiMachine}, {$set: {reservedFor: reservedId}});
        },

        'machineInspected': function(selectedPdiMachine, dateStop, pdiDuration, waitPdiTime) {
            MachineReady.update({_id:selectedPdiMachine}, {$set: {pdiStatus: 1, stopPdiDate: dateStop, pdiDuration: pdiDuration, waitPdiTime: waitPdiTime}});
            pdiCheckPoints.remove({_id: selectedPdiMachine});
            var repairOrder = InspectedMachines.findOne({_id: selectedPdiMachine});
            MachineReady.upsert({_id: selectedPdiMachine}, {$addToSet: {repairOrder: repairOrder}});
        },

        'machineRep': function(machineRepaired) {
            InspectedMachines.remove({_id: machineRepaired});
            MachineReady.update({_id: machineRepaired}, {$set: {repairStatus: 1}});
        },


        //    'machineRep': function(selectedMachineId, dateStop, repairDuration, waitRepairTime) {
        //        MachineReady.update({_id:selectedMachineId}, {$set: {repairStatus: 1, stopRepairDate: dateStop, repairDuration: repairDuration, waitRepairTime: waitRepairTime}});
        //        InspectedMachines.remove({_id: selectedMachineId});
        //    },

        'updateWashList': function(selectedCheckPoint, dateStart) {
            MachineReady.update({_id:selectedCheckPoint}, {$set: {washStatus: 2, startWashDate: dateStart}});
        },


        'updateRepairList': function(selectedCheckPoint, dateStart) {
            MachineReady.update({_id:selectedCheckPoint}, {$set: {repairStatus: 2, startRepairDate: dateStart}});
        },

        'shipMeInProcess': function(selectedCheckPoint) {
            MachineReady.update({_id:selectedCheckPoint}, {$set: {shipStatus: 2}});
        },

        'machineIsGone': function(selectedCheckPoint) {
            MachineReady.update({_id:selectedCheckPoint}, {$set: {shipStatus: 1}});
        },

        'removeFromShipList': function(selectedMachine) {
            MachineReady.remove(selectedMachine);
        },

        'addToShipList': function(newMachineInput, newShippingDate, createUnixTime, createDate, createTime,
                                  newShippingDestination, newShippingTransporter, newShippingKit, newShippingTireTrack, newShippingComment ) {

            MachineReady.insert({
                machineId: newMachineInput,
                dateOfCreation: createDate,
                timeOfCreation: createTime,
                pdiStatus: 0,
                repairStatus: 0,
                washStatus: 0,
                shipStatus: 0,
                unixTime: createUnixTime,
                date: newShippingDate,
                destination: newShippingDestination,
                transporter: newShippingTransporter,
                kit: newShippingKit,
                tireTrack: newShippingTireTrack,
                shippingComment: newShippingComment
            });
        },

        'addHeadToShipList': function(newHeadInput, newShippingDate, createUnixTime, createDate, createTime,
                                      newShippingDestination, newShippingTransporter, newShippingKit, newShippingComment ) {
            MachineReady.insert({
                newHeadId: newHeadInput,
                dateOfCreation: createDate,
                timeOfCreation: createTime,
                pdiStatus: 1,
                repairStatus: 1,
                washStatus: 1,
                shipStatus: 0,
                unixTime: createUnixTime,
                date: newShippingDate,
                destination: newShippingDestination,
                transporter: newShippingTransporter,
                kit: newShippingKit,
                shippingComment: newShippingComment
            });
        },

        'editShipInfo': function(selectedMachine, newMachine, newShippingDate, newShippingDestination, newShippingTransporter,
                                 newShippingTireTrack, newShippingKit, newShippingComment) {
            MachineReady.update({_id:selectedMachine},
                {$set: {machineId: newMachine,
                    date: newShippingDate,
                    destination: newShippingDestination,
                    transporter: newShippingTransporter,
                    tireTrack: newShippingTireTrack,
                    kit: newShippingKit,
                    shippingComment: newShippingComment}

                });
        },

        'editShipHead': function(selectedHead, newHead, newShippingDate, newShippingDestination, newShippingTransporter,
                                 newShippingTireTrack, newShippingKit, newShippingComment) {
            MachineReady.update({_id:selectedHead},
                {$set: {newHeadId: newHead,
                    date: newShippingDate,
                    destination: newShippingDestination,
                    transporter: newShippingTransporter,
                    tireTrack: newShippingTireTrack,
                    kit: newShippingKit,
                    shippingComment: newShippingComment}
                });
        }


    });




}

