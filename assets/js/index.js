//var settingsContractAddress="{{contract}}";
//var abi = JSON.parse("{{contract_abi|escapejs}}");


function betBlur(){
    var n = document.getElementById('bidNumber');
    if(n.valueAsNumber > 5) n.value = 5;
    if(n.valueAsNumber < 0.01) n.value = 0.01;
}

async function checkMetamask(){
/*    var error = null;
    if (window.ethereum) {
        window.web3 = new Web3(ethereum);
        try {
            await ethereum.enable();
        } catch (e) {
            error = 'private';
        }
    } else {
        if (typeof web3 === 'undefined') {
            error =  'missing';
        }
        else if (web3.eth.accounts.length === 0) {
            error = 'notLoggedIn';
        }
        else if (web3.version.network !== "3"){
            error =  'wrongNetwork';
        }
    }
    if(error === null) return true;
    var modal = document.getElementById("error-overlay");
    modal.style.display = 'flex';
    modal.style.width = "900";
    document.getElementById("stop_button").classList.add('down');
    document.getElementById('popup-error-content').innerHTML = metamaskErrors[error].content;
    document.getElementById('popup-error-heading').innerHTML = metamaskErrors[error].title;*/
    return false;
}



function sendTxData(txHash, amount, wallet){
    var formData = new FormData();
    formData.append("wallet", wallet);
    formData.append("value", txHash);
    formData.append("amount", amount);
    choicedVals.forEach(function(v){
        formData.append('numbers[]', v);
    });
    fetch('/ajax/bet/', {
        method: "POST", // *GET, POST, PUT, DELETE, etc.
        headers: {
            'X-CSRFToken': "{{csrf_token}}"
        },
        body: formData
    })
}

function appendNotification(transactionHash, winText){
    var txInfo = document.getElementById('txInfo');
    var node = document.createElement('div');
    if(winText){
        if(winText.search('lostNotif') > -1){
            node.classList.add('lostNotif');
        } else{
            node.classList.add('winNotif');
        }
    }
    var close = document.createElement('div');
    close.classList.add('closeNotif');
    close.innerHTML = 'X';
    if(winText){
        node.innerHTML = '<div class="notifText">' + winText + '</div>';
    } else {
        node.innerHTML = '<div class="notifText">Your transaction <a href=http://ropsten.etherscan.io/tx/'+transactionHash+' target="_blank"> <font color="#C0C0C0">'+transactionHash+'</font></a> was added on the blockchain.</div>';
    }
    node.appendChild(close);
    //txInfo.appendChild(node);
    txInfo.prepend(node);
    close.onclick = function() {
        if(this.parentNode.parentNode !== null) this.parentNode.parentNode.removeChild(this.parentNode);
    }
    setTimeout(function(){
        close.click();
    },  3 * 60 * 1000)

}

function playAgain(){
    console.log(document.getElementsByClassName('result').length);
    document.getElementById("play_again_button").classList.add('down');
    document.getElementById("roll_button").classList.remove('down');
    var platform = document.getElementById("platform");
    var dice = document.getElementById("dice");
    platform.className = "";
    platform.setAttribute('style', '');
    dice.className = "";
    dice.setAttribute('style', '');
    var sel = document.getElementsByClassName('selected');
    while (sel.length) sel[0].classList.remove('selected');
    var dis = document.getElementsByClassName('disabledVal');
    while (dis.length) dis[0].classList.remove('disabledVal');
    var bidPays = document.getElementById('bid-pays');
    bidPays.classList.add('darker');
    bidPays.innerText = "5.89";
    document.getElementById('bidNumber').value = '0.15';
    document.getElementById('bid-area').classList.add('area_hidden');
    document.getElementById('amount_area').classList.add('area_hidden');
    startDate = null;
    diff = null;
    choiced = null;
    choicedVals = [];
    if(document.getElementsByClassName('result').length > 0) onRoll();
    if(document.getElementsByClassName('result').length > 0)document.getElementsByClassName('result')[0].classList.remove('result')
}





function onEnd(e){
    var platform = document.getElementById("platform");
    if(e.animationName === 'roll' && choiced !== null){
        var res = Math.floor(Math.random() * 6) + 1;
        platform.classList.add(choiced + 'Anim');
    }
    if(e.animationName === 'endAnim'){
        var res = document.getElementsByClassName(choiced)[0];
        res.classList.add('result');
        document.getElementById("play_again_button").classList.remove('down');
    }
}

function getTables(){
    if(typeof web3 !== 'undefined' && web3.eth.accounts.length > 0){
        var formData = new FormData();
        formData.append("wallet", web3.eth.accounts[0]);
        fetch('/ajax/games/', {
            method: "POST",
            headers: {
                'X-CSRFToken': "{{csrf_token}}"
            },
            body: formData
        }).then(function (response) {
            if(!response.ok) return null;
            return response.text();
        })
            .then(function (text) {
                if(text){
                    document.getElementById("my_games_header").style.display = "unset";
                    document.getElementById("my_games").innerHTML = text;
                }
            });
        fetch('/ajax/notifications/', {
            method: "POST",
            headers: {
                'X-CSRFToken': "{{csrf_token}}"
            },
            body: formData
        }).then(function (response) {
            if(!response.ok) return null;
            return response.text();
        })
            .then(function (text) {
                if(text){
                    appendNotification(null, text);
                }
            });
    }
    fetch('/ajax/games/', {
        method: "GET",
        headers: {
            'X-CSRFToken': "{{csrf_token}}"
        },
    }).then(function (response) {
        if(!response.ok) return null;
        return response.text();
    })
        .then(function (text) {
            if(text){
                document.getElementById("all_games_loader").style.display = "none";
                document.getElementById("all_games").innerHTML = text;
            }
        });
}

/*
var platform = document.getElementById("platform");
platform.addEventListener("webkitAnimationEnd", onEnd);
platform.addEventListener("animationend", onEnd);

setInterval(getTables, 10000);
getTables();

window.addEventListener('load', function() {
    if(typeof web3 !== 'undefined'){
        web3.eth.getAccounts(function(error, accounts) {
            var formData = new FormData();
            formData.append("wallet", accounts[0]);
            formData.append('player_session_key', '{{player_session_key}}');
            fetch('/ajax/player/update/', {
                method: "POST",
                headers: {
                    'X-CSRFToken': "{{csrf_token}}"
                },
                body: formData
            })
        });
    }
});*/
