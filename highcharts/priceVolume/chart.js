
var taapi = new Taapi();

taapi.init();

var chart = null;

taapi.getCandles(function (candles) {

    // create the chart
    chart = Highcharts.stockChart('container', {

        chart: {
            events: {
                load: function() {
                    setTimeout( () => {
                        taapi.loadVolumes(chart)
                    }, 2000);                    
                }
            },
        },

        title: {
            text: 'TAAPI.IO + HighCharts (BTC/USDT)'
        },

        rangeSelector: {
            buttons: [],
            selected: 1,
            inputEnabled: false
        },

        xAxis: {
            left: -40,
        },

        yAxis: [{
            labels: {
                align: 'right',
                x: -3
            },
            title: {
                text: 'OHLC'
            },
            height: '80%',
            lineWidth: 2,
            resize: {
                enabled: true
            }
        }, {
            labels: {
                align: 'right',
                x: -3
            },
            title: {
                text: 'Volume'
            },
            top: '85%',
            height: '15%',
            offset: 0,
            lineWidth: 2
        }],

        series: [{
            name: 'BTC/USDT',
            type: 'candlestick',
            data: candles,
            tooltip: {
                valueDecimals: 2
            }
        }, {
            name: 'Volume',
            type: 'column',
            data: [],
            yAxis: 1,
        }]
    });
});