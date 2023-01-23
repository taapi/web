
var taapi = new Taapi()

taapi.init();

taapi.getCandles(function (candles) {

    // create the chart
    Highcharts.stockChart('container', {


        title: {
            text: 'TAAPI.IO + HighCharts (BTC/USDT)'
        },

        rangeSelector: {
            buttons: [],
            selected: 1,
            inputEnabled: false
        },

        xAxis: {
            left: -30,
        },

        series: [{
            name: 'BTC/USDT',
            type: 'candlestick',
            data: candles,
            tooltip: {
                valueDecimals: 2
            }
        }]
    });
});