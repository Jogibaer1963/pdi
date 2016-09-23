if(Meteor.isClient) {


    Template.machineUser.helpers({

        'machineNow': function () {
            event.preventDefault();
            var userLoggedIn = Session.get('currentLoggedInUser');
            Session.set('pdiMachineNumber', localStorage.getItem('pdiMachine'));
            var pdiMachine = Session.get('pdiMachineNumber');
            return {userLoggedIn: userLoggedIn, machine: pdiMachine};
        }
    });

    Template.ommBook.helpers({


        ommMainBooklets: function () {
            return ommMain.find({});
        },

        selectedMainOm: function() {
            event.preventDefault();
            return Session.get('selectedMainOm');
        },
        //-------------------------------------------------------------//
        ommSupplement: function () {
            return ommSupp.find({});
        },

        selectedSuppOm: function() {
            event.preventDefault();
            return Session.get('selectedSuppOm');
        },
        //------------------------------------------------------------//
        ommUnload: function () {
            return ommUnload.find({});
        },

        selectedUnloadOm: function() {
            event.preventDefault();
            return Session.get('selectedUnloadOm');
        },
        //--------------------------------------------------------------//

        ommCebisMo: function () {
            return ommCebisMo.find({});
        },

        selectedCemosOm: function() {
            event.preventDefault();
            return Session.get('selectedCemosOm');
        },
        //--------------------------------------------------------------//

        ommTera: function () {
            return ommTeraTrack.find({});
        },

        selectedTeraOm: function() {
            event.preventDefault();
            return Session.get('selectedTeraTrackOm');
        },

        //--------------------------------------------------------------//

        ommProfi: function () {
            return ommProfiCam.find({});
        },

        selectedProfiCam: function() {
            event.preventDefault();
            return Session.get('selectedProfiCam');
        },

        selectedClass: function() {
            event.preventDefault();
            var omId = this._id;
            var selectedProfiOmId = Session.get('selectedProfiId');
            if(selectedProfiOmId == omId) {
                return "selected";
            } 
        }

    });
    //****************************************************************//
    Template.ommBook.events({
        'click .omMain': function() {
            event.preventDefault();
            Session.set('selectedMainOm', '');
            var omMainPart = this._id;
            var selectedMainOm = ommMain.findOne({_id: omMainPart}).ommMain;
            Session.set('selectedMainOm', selectedMainOm);
        },

        'click .omSupp': function() {
            event.preventDefault();
            Session.set('selectedSuppOm', '');
            var omSupp = this._id;
            var selectedSuppOm = ommSupp.findOne({_id: omSupp}).ommSupp;
            Session.set('selectedSuppOm', selectedSuppOm);
        },

        'click .omUnload': function() {
            event.preventDefault();
            Session.set('selectedUnloadOm', '');
            var omUnload = this._id;
            var selectedUnloadOm = ommUnload.findOne({_id: omUnload}).omUnload;
            Session.set('selectedUnloadOm', selectedUnloadOm);
        },

        'click .omCemos': function() {
            event.preventDefault();
            Session.set('selectedCemosOm', '');
            var omCemos = this._id;
            var selectedCemosOm = ommCebisMo.findOne({_id: omCemos}).ommCebisMobil;
            Session.set('selectedCemosOm', selectedCemosOm);
        },

        'click .omTera': function() {
            event.preventDefault();
            Session.set('selectedTeraTrackOm', '');
            var omTera = this._id;
            var selectedTeraTrackOm = ommTeraTrack.findOne({_id: omTera}).ommTeraTrack;
            Session.set('selectedTeraTrackOm', selectedTeraTrackOm);
        },

        'click .ommProfiCam': function() {
            event.preventDefault();
            Session.set('selectedProfiCam', '');
            var omProfi = this._id;
            Session.set('selectedProfiId', omProfi);
            var selectedProfiCam = ommProfiCam.findOne({_id: omProfi}).ommProfiCam;
            Session.set('selectedProfiCam', selectedProfiCam);
        },

        'submit .omBooklets': function (event) {
            event.preventDefault();
            Session.set('selectedPdiMachine', localStorage.getItem('selectedPdi'));
            var loggedInUser = Session.get('currentLoggedInUser');
            var pdiMachineId = Session.get('selectedPdiMachine');
            var ommMain = event.target.omMain.value;
            var ommSupp = event.target.omSupp.value;
            var ommFitting = event.target.omUnload.value;
            var ommCebis = event.target.omCebis.value;
            var ommTerra = event.target.omTerra.value;
            var ommProfiCam = event.target.omProfiCam.value;
            Meteor.call('pdiMachineInspected', pdiMachineId, loggedInUser, ommMain, ommSupp,
                ommFitting, ommTerra, ommCebis, ommProfiCam);
            Session.set('selectedProfiCam', '');
            Session.set('selectedTeraTrackOm', '');
            Session.set('selectedCemosOm', '');
            Session.set('selectedUnloadOm', '');
            Session.set('selectedSuppOm', '');
            Session.set('selectedMainOm', '');
            event.target.omMain.value = '';
            event.target.omSupp.value = '';
            event.target.omUnload.value = '';
            event.target.omCebis.value = '';
            event.target.omTerra.value = '';
            event.target.omProfiCam.value = '';
            FlowRouter.go('machineInspect_2');
        }
    });
}