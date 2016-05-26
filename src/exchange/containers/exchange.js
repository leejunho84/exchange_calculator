'use strict';

import React, { Component } from 'React';
import SelectComponent from '../components/select_component';
import CountryRates from '../components/countryrates_component';

export default class Exchange extends Component {
	constructor(){
		super();

		const DATE = new Date();
		let year = DATE.getFullYear();
		let month = DATE.getMonth() + 1;
		let day = DATE.getDate();

		this.state = {
			url:'./js/dummy.js',
			symbols:'KRW,USD,EUR,JPY,CNY,AUD,CAD,NZD',
			rates:new Map(),
			unit:['none'],
			currentCountry:{to:'USD', from:'KRW'},
			exchangePrice:{to:0, from:0}
		}
	}

	_promise(){
		return new Promise((resolve, reject) => {
			$.ajax({
				method:'GET',
				url:this.state.url,
				data:{base:this.state.currentCountry.from, symbols:this.state.symbols},
				type:'JSON',
				complete:function(result){
					if(result.status == 200){
						resolve(JSON.parse(result.responseText));
					}else if(result.status == 403){
						reject(result.responseText);
					}else if(result.status == 404){
						reject(result.responseText);
					}else if(result.status == 500){
						reject(result.responseText);
					}
				}
			});
		});
	}

	_countryChange(country, type){
		this.setState(state => {
			state.exchangePrice.to = 0;
			state.exchangePrice.from = 0;
			state.currentCountry[type] = country;
		});
	}

	_exchange(val, type){
		var value = (val) ? parseInt(val) : 0;
		var ratesTo = this.state.rates.get(this.state.currentCountry.to);
		var ratesFrom = this.state.rates.get(this.state.currentCountry.from);

		if(type == 'to'){
			let exchange = ((ratesTo / ratesFrom) * value).toFixed(2);
			this.setState({exchangePrice:{to:value, from:exchange}});
		}else if(type == 'from'){
			let exchange = ((ratesFrom / ratesTo) * value).toFixed(2);
			this.setState({exchangePrice:{to:exchange, from:value}});
		}
	}

	componentDidMount(){
		this._promise().then((data) => {
			return data.rates;
		}).then((rates) => {
			var ratesMap = new Map();
			var arrUnit = [];

			arrUnit.push('KRW'); //기준값인 원에 대한 초기값
			ratesMap.set('KRW', 1); //기준값인 원에 대한 초기값

			for(let key in rates){
				arrUnit.push(key);
				ratesMap.set(key, (1 / rates[key]).toFixed(2));
			}
			this.setState({
				rates:ratesMap,
				unit:arrUnit
			});
		}).catch((error) => {
			throw new Error(error);
		});
	}

	render(){
		return (
			<div className="calculator">
				<div className="excr_cal">
					<SelectComponent 
						selectType='to'
						change={(country, type) => this._countryChange(country, type)}
						exchange={(value, type) => this._exchange(value, type)}
						unit={this.state.unit}
						currentCountry={this.state.currentCountry.to}
						exchangePrice={this.state.exchangePrice.to} />

					<span className="excr_eq"></span>

					<SelectComponent 
						selectType='from'
						change={(country, type) => this._countryChange(country, type)}
						exchange={(value, type) => this._exchange(value, type)}
						unit={this.state.unit} 
						currentCountry={this.state.currentCountry.from} 
						exchangePrice={this.state.exchangePrice.from} />
				</div>
				<CountryRates rates={this.state.rates} unit={this.state.unit} />
			</div>
		)
	}
}