
var taapi = new Taapi("ws://localhost:8081");

taapi.init();

const candlesKey = "btcusdt_candles_1m";

var chart = null;

taapi.connect(chart, function (snapshot) {

    $("#rsi_container").html(snapshot.btcusdt_rsi_1m.value);
    $("#ema200_container").html(snapshot.btcusdt_ema_200_1m.value);
    
    // create the chart
    chart = Highcharts.stockChart('container', {

        title: {
            //text: 'TAAPI.IO + HighCharts (BTC/USDT)'
        },

        chart: {
            events: {
                load: function() {

                    // Wait for chart to load
                    setTimeout( () => {
                        taapi.setChart(chart, candlesKey);

                        document.addEventListener("taapi-data", function(e) {
                            taapi.updatePriceChart(e.detail[candlesKey]);
                            $("#rsi_container").html(e.detail.btcusdt_rsi_1m.value);
                            $("#ema200_container").html(e.detail.btcusdt_ema_200_1m.value);
                        });
                        
                        
                    }, 2000);                    
                }
            },
        },

        navigator: {
            enabled: false
        },

        exporting: {
            enabled: false
        },

        tooltip: {
            //enabled: false,
            split: false,
            //shared: true,
        },

        scrollbar: {
            enabled: false
        },

        rangeSelector: {
            buttons: [],
            selected: 1,
            inputEnabled: false
        },

        yAxis: {
            visible: false,
            /* crosshair: {
                enabled: false
            } */
        },

        xAxis: {
            visible: false,
            left: -30,
            scrollbar: { enabled: false },
            crosshair: {
                enabled: false
            }
        },

        series: [{
            name: 'BTC/USDT',
            type: 'candlestick',
            data: snapshot[candlesKey],
            tooltip: {
                valueDecimals: 2
            }
        }]
    });
});