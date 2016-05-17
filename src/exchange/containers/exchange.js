'use strict';

import React, { Component } from 'React';
import SelectComponent from '../components/select_component';
import CountryRates from '../components/countryrates_component';

export default class Exchange extends Component {
	constructor(){
		super();

		this.state = {
			url:'/js/dummy.js',
			symbols:'KRW,USD,EUR,JPY,CNY,AUD,CAD,NZD',
			date:'2016-05-11',
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
				data:{base:this.state.currentCountry.to, symbols:this.state.symbols},
				type:'JSON',
				complete:function(result){
					if(result.status == 200){
						resolve( JSON.parse(result.responseText));
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
			return state.currentCountry[type] = country;
		});
	}

	_exchange(val, type){
		var value = (val) ? parseInt(val) : 0;
		var ratesTo = this.state.rates.get(this.state.currentCountry.to);
		var ratesFrom = this.state.rates.get(this.state.currentCountry.from);

		if(type == 'to'){
			let exchange = ((ratesTo / ratesFrom) * value).toFixed(2);
			this.setState({exchangePrice:{to:this._replacePrice(value), from:this._replacePrice(exchange)}});	
		}else if(type == 'from'){
			let exchange = ((ratesFrom / ratesTo) * value).toFixed(2);
			this.setState({exchangePrice:{to:this._replacePrice(exchange), from:this._replacePrice(value)}});
		}
	}

	_replacePrice(val){
		let price = val.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
		return price;
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