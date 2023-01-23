var Taapi = function(socketEndpoint){
    this.socketEndpoint = socketEndpoint;
};

Taapi.prototype = {

        socketEndpoint: null,

        socketServer: null,
        
        snapshot: null,
        candlesKey: null,
        latestCandleStart: 0,

        chart: null,

    init: function() {

    },

    setChart(chart, candlesKey) {

        this.candlesKey = candlesKey;
        this.latestCandleStart = this.snapshot[this.candlesKey][this.snapshot[this.candlesKey].length - 1].timestamp;

        // Ensure timestamp is in milliseconds
        if(this.latestCandleStart < 9999999999) {
            this.latestCandleStart = this.latestCandleStart * 1000;
        }

        this.chart = chart;
    },

    connect(chart, callback) {

        if ("WebSocket" in window) {

            this.chart = chart;

            let self = this;
            return new Promise(function(resolve, reject) {
                var ws = new WebSocket(self.socketEndpoint);
                ws.onopen = function() {
        
                    if(ws.readyState === 1) {

                        this.socketServer = ws;
        
                        console.log("Sockets supported: Connecting to data feed...");

                        // Server socket ready
                        const connectData = JSON.stringify({
                            "action": "connect",
                        });
                
                        ws.send(connectData);
                        
                        ws.onmessage = function (response) {
                
                            message = JSON.parse(response.data);
                            
                            switch(message.action) {
                                case "welcome":
                                    console.log(`Greetings: ${message.data.greeting}`);
                                    break;
                                case "init":
                                    console.log("Initializing...");        
                                    break;
                                case "snapshot":

                                    self.snapshot = message.data;

                                    callback(message.data);
                                    
                                    break;
                                case "error":
                                    console.log("Error...");        
                                    break;
                                case "data":

                                    // Fire event
                                    document.dispatchEvent(new CustomEvent("taapi-data", {
                                        detail: message.data
                                    }));                                    
                
                                    break;
                            }
                            
                            return false;
                        };
                
                        ws.onclose = function () {
                
                            // websocket is closed.
                            alert("Connection closed. Please refresh to re-connect!");
                        };
        
                        setTimeout( () => {
                            resolve(ws);
                        }, 1000);
                        
                    }
                };

                ws.onerror = function(err) {
                    reject(err);
                };
        
            });
        } else {

            // The browser doesn't support WebSocket
            alert("WebSocket NOT supported by your Browser!");
        }
    },

    convertTaapiCandlesToHighChart(taapiCandles) {

        let candles = [];
        let volumes = [];

        taapiCandles.forEach( candle => {
            candles.push([
                parseInt(candle.timestamp) * 1000,
                parseFloat(candle.open),
                parseFloat(candle.high),
                parseFloat(candle.low),
                parseFloat(candle.close),
            ]);

            volumes.push([
                parseInt(candle.timestamp) * 1000,
                parseFloat(candle.volume),
            ]);
        });

        return {
            candles: candles,
            volumes: volumes
        };
    },

    loadVolumes: function(volumes) {

        this.chart.series[1].setData(volumes);

    },

    updatePriceChart(taapiCandles) {

        if(taapiCandles.length > 2) {
            taapiCandles = taapiCandles.slice(-2);
        }

        let self = this;

        let {candles, volumes} = self.convertTaapiCandlesToHighChart(taapiCandles);

        let currentCandle = candles[1];
        let previousCandle = candles[0];
        
        if(currentCandle[0] > self.latestCandleStart) {

            // Kepp track of the latest timestamp
            self.latestCandleStart = currentCandle[0];

            // As we're polling at an interval, we'll need to update 
            // the final values of what's now the previous candle
            this.chart.series[0].data[this.chart.series[0].data.length - 1].update(previousCandle);
            this.addCandle(currentCandle);
        } else {
            this.chart.series[0].data[this.chart.series[0].data.length - 1].update(currentCandle);
        }
    },

    addCandle: function(candle) {

        this.chart.series[0].addPoint(candle, true, true);

    }
};