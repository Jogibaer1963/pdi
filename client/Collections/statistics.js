


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


        let fuelConsumption = fuelAverage.findOne();
        consumptionData = fuelConsumption.consumption;
        console.log(consumptionData);
        return {
            chart: {
                plotBackgroundColor: '#6978ff',
                linearGradient: [0, 0, 500, 500],
                stops: [
                    [0, 'rgb(255, 255, 255)'],
                    [1, 'rgb(200, 200, 255)']
                ],
                plotBorderWidth: null,
                plotShadow: true
            },
            title: {
                text: "Fuel consumption per PDI"
            },
            tooltip: {
                pointFormat: '<b>{point.percentage:.1f}</b>'
            },
            plotOptions: {
                pie: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    dataLabels: {
                        enabled: true,
                        format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                        style: {
                            color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                        },
                        connectorColor: 'silver'
                    }
                }
            },
            series: [{
                type: 'line',
                name: 'fuel consumption',
                data: consumptionData
            }]
        };
    };


