anychart.onDocumentReady(function () {
    let pair = document.querySelector(".sele4").value;
    let bal1 = document.querySelector('.balanceNumber41');
    let bal2 = document.querySelector('.balanceNumber42');
    let Label =  document.querySelector(".sele4")
    let coinLabel = (Label.options[Label.selectedIndex].text)
    let coins = coinLabel.split('/')
    let title4 = ""

    document.querySelector(".sele4").addEventListener('change', function (e) {
        pair = e.target.value;
        updateChart(pair,"notFirst");
        getPriceForlabel(pair);
        coinLabel = (Label.options[Label.selectedIndex].text)
        coins = coinLabel.split('/')
        updateBalance(coins)
    })
    function updateBalance(coins){
        fetch('http://localhost:8080/getBalance/' + coins[0], {
            method : "GET",
            mode: 'cors',
            headers: {
                'Access-Control-Allow-Origin': 'http://localhost:8080',
                Accept: 'application/json',
                mode: 'no-cors',
                'Content-Type': 'application/json'
            }
        })
        .then(r => r.json())
        .then(bal => {
            bal1.textContent = bal+ ' ' + coins[0];
        })

        fetch('http://localhost:8080/getBalance/' + coins[1], {
            method : "GET",
            mode: 'cors',
            headers: {
                'Access-Control-Allow-Origin': 'http://localhost:8080',
                Accept: 'application/json',
                mode: 'no-cors',
                'Content-Type': 'application/json'
            }
        })
        .then(r => r.json())
        .then(bal => {
            bal2.textContent = bal+ ' ' + coins[1];
        })

    }
    updateBalance(coins)
    let dataCh = []
    var chart4 = anychart.box();
    var upColor =   {
        fill: "#00bfa5 0.3",
        stroke: "#00bfa5",
        medianStroke: "0.5 #00bfa5",
        stemStroke: "0.5 #00bfa5"
      }
      var downColor = {
       fill: "#ff0000 0.3",
        stroke: "#ff0000",
        medianStroke: "0.5 #ff0000",
        stemStroke: "0.5 #ff0000"
      }
    

    function updateChart(pair,param){
        fetch('http://localhost:3002/prices?symbol=' + pair + '&time=1m&count=12', {
            method : "GET",
            mode: 'cors',
            headers: {
                'Access-Control-Allow-Origin': 'http://localhost:3002',
                Accept: 'application/json',
                'Content-Type': 'application/json'
            }
        })
    .then(r => r.json())
    .then(prices => {
        dataCh = []
        for(let i = 0; i < prices.length;i++){
            let col;
            if(parseFloat(prices[i]["close"])>parseFloat(prices[i]["open"])){
                col = upColor;
            }
            else{
                col = downColor
            }
            let med = (parseFloat(prices[i]["close"]) + parseFloat(prices[i]["open"])) / 2;
            dataCh.push({x:prices[i]["time"],low:parseFloat(prices[i]["low"]),q1:parseFloat(prices[i]["open"]),median:parseFloat(med),q3:parseFloat(prices[i]["close"]),high:parseFloat(prices[i]["high"]),normal:col});
        }
        if(param!="first"){
            chart4.data(dataCh)
            title4= chart4.title(pair);
        }else{
            chart4.background().fill("black");
            series = chart4.box(dataCh);
            title4= chart4.title(pair);
            chart4.interactivity("by-x");
            chart4.container("chartWindow4");
            chart4.labels().fontColor("black");
            chart4.width('100%');
            chart4.height('100%');
            chart4.draw();
        }
        
    })}


    function getPriceForlabel(pair){
        fetch('http://localhost:3004/price?symbol='+pair, {
            method : "GET",
            mode: 'cors',
            headers: {
                'Access-Control-Allow-Origin': 'http://localhost:3004',
                Accept: 'application/json',
                'Content-Type': 'application/json'
            }
          })
      .then(r => r.json())
      .then(price => {
        let label = document.querySelector('.priceNumber4');
        let oldValue = parseFloat(label.textContent)
        label.textContent = price;
        if(oldValue > price){
            label.style.color = "rgb(236, 46, 46)";
        }else{
            label.style.color = "rgb(37, 210, 37)";
        }
      })
    }
    getPriceForlabel(pair)
    updateChart(pair,"first")
    setInterval(function print(param) {
        getPriceForlabel(pair)
      }, 5000,pair)
    
    setInterval(function print(param) {
        updateChart(pair,"notFirst")
        
      }, 5000,pair)
    
      setInterval(function print(param) {
        updateBalance(coins)
        
      }, 1000,pair)





    let buyBT = document.querySelector('.b4buy');
    let sellBT = document.querySelector('.b4sell');

    buyBT.addEventListener("click",function(){
        let range = document.querySelector('.range4');
        let number = range.value / 100;

        let label = document.querySelector('.priceNumber4');
        console.log()
        let count =  parseFloat(bal1.textContent)*number;
        count = count.toFixed(11);
        fetch('http://localhost:8080/buy?coin1=' + coins[0]+"&coin2="+coins[1]+"&number="+count, {
            method : "GET",
            mode: 'cors',
            headers: {
                'Access-Control-Allow-Origin': 'http://localhost:8080',
                Accept: 'application/json',
                mode: 'no-cors',
                'Content-Type': 'application/json'
            }
        })
        .then(bal => {
            updateBalance(coins)
        })

    })

    sellBT.addEventListener("click",function(){
        let range = document.querySelector('.range4');
        let number = range.value / 100;
        let label = document.querySelector('.priceNumber4');
        let count = parseFloat(bal2.textContent)*number;
        count = count.toFixed(11);
        fetch('http://localhost:8080/sell?coin1=' + coins[0]+"&coin2="+coins[1]+"&number="+count, {
            method : "GET",
            mode: 'cors',
            headers: {
                'Access-Control-Allow-Origin': 'http://localhost:8080',
                Accept: 'application/json',
                mode: 'no-cors',
                'Content-Type': 'application/json'
            }
        })
        .then(bal => {
            updateBalance(coins)
        })
    })

})



