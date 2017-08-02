


    Template.statisticView.helpers({
        overView: function() {
           return MachineReady.find({}, {sort: {date: -1}});
        }
    });


    Template.statistics.events({
        'click #buttonDownload': function () {

            let nameFile = 'fileDownloaded.csv';
            Meteor.call('download_statistics', function (err, fileContent) {
                if (fileContent) {
                    let blob = new Blob([fileContent], {type: "text/plain;charset=utf-8"});
                    saveAs(blob, nameFile);
                }
            });
        }

    });


    Template.fuelChart.topGenresChart = function() {


           Meteor.call('fuelConsumption', function (err, response) {
               if (err) {
                   console.log(err);
               }
               Session.set('elementMachine', response.elementMachine);
               Session.set('elementFuelStart', response.elementFuelStart);
               Session.set('elementFuelAfter', response.elementFuelAfter);
               Session.set('elementConsumption', response.elementConsumption);
           });
        let elementMachine = Session.get('elementMachine');
        let elementFuelStart = Session.get('elementFuelStart');
        let elementFuelAfter = Session.get('elementFuelAfter');
        let elementConsumption = Session.get('elementConsumption');
        return {
            chart: {
                height: 500,
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false,
                type: 'line',
                zoomType: 'x',
                panning: true,
                panKey: 'shift'
            },
            title: {
                text:  "Fuel consumption per PDI"
            },
            tooltip: {
                pointFormat: '{series.name}:<b>{point.y}</b><br/>',
                valueSuffix: ' Gallon',
                shared: true
            },
            plotOptions: {
                series: {
                    color: '#FF0000'
                }
            },
            xAxis: {
              categories: elementMachine,
              labels: {
                  rotation: 30
              }
            },
            series: [{
                name: 'Fuel start',
                data: elementFuelStart
            },
                {
                    name: 'Fuel end',
                    data: elementFuelAfter,
                    color: '#08F'
                },
                {
                    name: 'Consumption',
                    data: elementConsumption,
                    color: '#1aff11'
                }

            ]
        };

       };


