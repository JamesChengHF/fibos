import React, {Component} from 'react'
import PropTypes from 'prop-types';
import TodoItem from './todo-item'
import Footer from './footer'
//import { Spin } from 'antd';

const TODO_FILTERS = {
    SHOW_ALL: () => true,
    SHOW_ACTIVE: todo => !todo.completed,
    SHOW_COMPLETED: todo => todo.completed
}
var choice_Val = []

const winMultiplication = {
    1: 5.89,
    2: 5.89,
    3: 2.93,
    4: 1.95,
    5: 1.42,
    6: 1.07
}
const winRate = {
    1: 16.67,
    2: 33.33,
    3: 50.00,
    4: 66.67,
    5: 83.33
}
const metamaskErrors = {
    missing: {
        title: 'Install Metamask',
        content: '<div><img id=\"popup-error-image\" src=\"/static/images/metamask.png\"></img>You need to install Metamask to play this game.<br/><br/><br/></div>',
        popupWidth: -1
    },
    notLoggedIn: {
        title: 'Metamask is Locked',
        content: '<div><img id=\"popup-error-image\" src=\"/static/images/metamask.png\"></img><br/>Simply open up Metamask and follow the instructions to unlock it.<br/><br/><br/></div>',
        popupWidth: -1
    },
    wrongNetwork: {
        title: 'Metamask Network',
        content: "<div><img id=\"popup-error-image\" src=\"/static/images/metamask-main-network.png\"></img><br/><br/>Oops, you're on the wrong network.<br/><br/>Simply open Metamask and switch over to Main Ethereum Network.</br><br/></br></div>",
        popupWidth: -1
    },
    private: {
        title: 'Metamask private',
        content: "<div><img id=\"popup-error-image\" src=\"/static/images/metamask-main-network.png\"></img><br/><br/>Oops, you're on the wrong network.<br/><br/>Simply open Metamask and switch over to Main Ethereum Network.</br><br/></br></div>",
        popupWidth: -1
    },
}

export default class MainSection extends Component {
    static propTypes = {
        todos: PropTypes.array.isRequired,
        actions: PropTypes.object.isRequired,
        rollDice: PropTypes.func.isRequired,
        gameTip: PropTypes.string,
        changeGameTip: PropTypes.func.isRequired
    }

    state = {
        bid_pays_text: '2.93',
        win_pay: '0.293',
        dice: '',
        winRate: 50,
        game: false
    }

    constructor(props) {
        super(props);
        this.randChoice()
    }

    randChoice() {
        console.log(choice_Val)
        let arr = [0, 1, 2, 3, 4, 5];
        let num = 3;
        while (choice_Val.length < num) {
            let temp = (Math.random() * arr.length) >> 0;
            choice_Val.push(arr.splice(temp, 1)[0]);
        }
    }

    renderField() {
        return <div className="field" ref="bet_area">
            <label className="dice-option option-0" onClick={(e) => this.selectBet(e, 0)}/>
            <label className="dice-option option-1" onClick={(e) => this.selectBet(e, 1)}/>
            <label className="dice-option option-2" onClick={(e) => this.selectBet(e, 2)}/><br/>
            <label className="dice-option option-3" onClick={(e) => this.selectBet(e, 3)}/>
            <label className="dice-option option-4" onClick={(e) => this.selectBet(e, 4)}/>
            <label className="dice-option option-5" onClick={(e) => this.selectBet(e, 5)}/>
            <span>选择骰子数来进行投注</span>
        </div>
    }

    renderBets() {
        return <div className="bets">
            <div className="quick-bets">
                <button className="" onClick={(e) => this.quickBet(e, 0.05)}>0.05</button>
                <button className="" onClick={(e) => this.quickBet(e, 0.10)}>0.10</button>
                <button className="" onClick={(e) => this.quickBet(e, 0.15)}>0.15</button>
                <button onClick={(e) => this.quickBet(e, 1000)}>最大</button>
            </div>
            <div className="field">
                <button onClick={(e) => this.decreaseBid(e)}>−</button>
                <input type="text" ref="bidNumber" onBlur={this.betBlur} defaultValue="0.10"/>
                <button onClick={(e) => this.increaseBid(e)}>+</button>
                <span>您的赌注</span>
            </div>
        </div>
    }

    renderOdds() {
        return <div className="odds"><h3>获胜机会</h3><span>{this.state.winRate}%</span></div>
    }

    renderGameTables() {
        const historyElements = []
        if (this.props.todos.length > 0) {
            for (let todo of this.props.todos) {
                let bet_point = todo.bet_point.split(',')

                let bet_point_node = bet_point.map((item, i) => (
                    <i className={"dice-option option-" + (item - 1)} key={item}/>
                ))
                let win_class = todo.bet_point.toString().indexOf(todo.random) !== -1 ? "settled won" : "settled"
                historyElements.push(
                    <li className={win_class} key={todo.id}>
                        <span className="address ">
                            {todo.address_from}
                        </span>
                        <span className="amount"><span className="ethers">{todo.amount / 1000000}</span></span>
                        <span className="bet dice">
                            {bet_point_node}
                        </span>
                        <span className="result dice">
                            <i className={"dice-option option-" + (todo.random - 1)}/>
                        </span>
                        <span className="win">
                            <span className="ethers">{todo.dice_payment / 1000000}</span>
                        </span>
                        <span className="lose">—</span>
                        <span className="jackpot">—</span>
                        <button className=""/>
                    </li>
                )
            }
        }

        return <section className="history">
            <div className="history">
                <h3>游戏历史
                    <button className="">只有我</button>
                </h3>
                <div>
                    <header>
                        <label>玩家</label>
                        <label>赌注</label>
                        <label></label>
                        <label>结果</label>
                        <label></label>
                        <label className="jackpot"></label>
                        <label></label>
                    </header>
                    <div className="scrollbar-container ps">
                        <ul>
                            {historyElements}
                        </ul>
                    </div>
                </div>
            </div>
        </section>
    }

    renderBetReturn() {
        return <div className="bet-return">
            <h3>赢得投注</h3>
            <span>{this.state.bid_pays_text}×</span>
            <label>
                您将赢得
                <span>{this.state.win_pay}</span>
                <small>以太幣</small>
            </label>
            <i>1% 费用，
                <span className="ethers">
                    0.001<small>以太幣</small>
                </span>累积大奖
            </i>
        </div>
    }

    renderCanvas() {
        return <div className="top-bar">
            <a className="logo" href="/">dice2.win</a>

        </div>
    }

    renderJackpot() {
        return <div className="jackpot">
            <h3>大奖包括1</h3>
            <span>
                <span>0.702</span>
                <small>以太幣</small>
            </span>
            <label className="qualified">幸运数字是888!</label>
        </div>
    }

    renderPlaceBet() {
        return <div className="place-bet" onClick={(e) => this.completeBet(e)}>
            <button>下注！</button>
        </div>
    }

    renderGamePlay() {
        return <div className="game-play"><i></i><label>{this.props.gameTip}</label>
            <button onClick={(e) => this.playAgain(e)} disabled={this.props.play}>再玩一次</button>
        </div>
    }

    checkMetamask = (e) => {
        return new Promise((resolve, reject) => {
            let error = null;
            // error = 'private';
            if (error == null) resolve(true)
            reject(new Error(metamaskErrors[error].content));
        });
    }

    playAgain = () => {
        this.setState({
            dice: '',
            game: false,
            bid_pays_text: '5.89',
        })
        choice_Val = []
        this.randChoice()
        this.changeBet()
        this.props.changeGameTip('请确认投注交易:')
    }

    completeBet = () => {
        if (choice_Val.length === 0) {
            this.selectBet(null, Math.floor(Math.random() * 5));
            return;
        }
        let r = this.checkMetamask()
        if (!r) return;
        this.setState({game: true})
        const {rollDice} = this.props
        choice_Val.forEach(function (item, key) {
            choice_Val[key] = item + 1
        })
        choice_Val.sort()
        //console.log(choice_Val)
        let dice_payment = (this.state.bid_pays_text * this.refs.bidNumber.value * 1000000).toFixed(0)
        let transaction_id = rollDice(this.refs.bidNumber.value * 1000000, choice_Val, dice_payment, this.state.bid_pays_text)
        /*        setTimeout(function () {
                    this.appendNotification(transaction_id);
                }.bind(this), 4200)*/
    }

    appendNotification = (transactionHash, winText) => {
        var txInfo = document.getElementById('txInfo');
        var node = document.createElement('div');
        if (winText) {
            if (winText.search('lostNotif') > -1) {
                node.classList.add('lostNotif');
            } else {
                node.classList.add('winNotif');
            }
        }
        var close = document.createElement('div');
        close.classList.add('closeNotif');
        close.innerHTML = 'X';
        if (winText) {
            node.innerHTML = '<div class="notifText">' + winText + '</div>';
        } else {
            node.innerHTML = '<div class="notifText">Your transaction <a href=http://ropsten.etherscan.io/tx/' + transactionHash + ' target="_blank"> <font color="#C0C0C0">' + transactionHash + '</font></a> was added on the blockchain.</div>';
        }
        node.appendChild(close);
        txInfo.prepend(node);
        close.onclick = function () {
            if (this.parentNode.parentNode !== null) this.parentNode.parentNode.removeChild(this.parentNode);
        }
        setTimeout(function () {
            close.click();
        }, 3 * 60 * 1000)

    }

    increaseBid = (e) => {
        let x = Number(this.refs.bidNumber.value)
        x += 0.01
        this.refs.bidNumber.value = Math.min(5, x).toFixed(2)
        this.changeBet()
    }

    decreaseBid = (e) => {
        let x = Number(this.refs.bidNumber.value)
        x -= 0.01
        this.refs.bidNumber.value = Math.max(0.01, x).toFixed(2)
        this.changeBet()
    }

    betBlur = () => {
        let n = Number(this.refs.bidNumber.value)
        if (n > 5) this.refs.bidNumber.value = 5
        if (n < 0.01) this.refs.bidNumber.value = 0.01

        this.changeBet()
    }

    selectBet = (e, choice) => {
        if (choice_Val.length === 5 && e.currentTarget.getAttribute('data-checked') !== "true") {
            return false
        }
        if (e.currentTarget.getAttribute('data-checked') === "true") {
            if (choice_Val.length > 1) {
                e.currentTarget.removeAttribute('data-checked')
                choice_Val = choice_Val.filter(function (o) {
                    return o !== choice
                })
            }
        } else {
            e.currentTarget.setAttribute('data-checked', true)
            choice_Val.push(choice)
        }
        this.changeBet()
    }

    quickBet = (e, val) => {
        this.refs.bidNumber.value = val
        this.changeBet()
    }

    changeBet() {
        let n = Number(this.refs.bidNumber.value)
        this.setState({
            bid_pays_text: winMultiplication[choice_Val.length],
            win_pay: (winMultiplication[choice_Val.length] * n).toFixed(3),
            winRate: winRate[choice_Val.length]
        })
    }

    render() {
        const {todos, actions} = this.props
        const {filter} = this.state

        /*        const filteredTodos = todos.filter(TODO_FILTERS[filter])
                const completedCount = todos.reduce((count, todo) => {
                    return todo.completed ? count + 1 : count
                }, 0)*/

        return (
            <div>
                <main>
                    {this.renderCanvas()}
                    <div className="game dice">
                        <section className="field">
                            {this.state.game ? this.renderGamePlay() : ''}
                            <h1>骰子</h1>
                            {this.renderField()}
                            {this.renderBets()}
                            {this.renderPlaceBet()}
                        </section>
                        <section className="returns">
                            {this.renderOdds()}
                            {this.renderBetReturn()}
                            {this.renderJackpot()}
                        </section>
                        {this.renderGameTables()}
                    </div>
                </main>
            </div>
        );
    }

    componentDidUpdate() {
        document.querySelectorAll(".game .field .dice-option").forEach(function (item, k) {
            if (choice_Val.indexOf(k) !== -1) {
                item.setAttribute('data-checked', true)
            } else {
                item.removeAttribute('data-checked')
            }
        })
    }

}