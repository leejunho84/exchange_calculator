'use strict';

import React, { Component } from 'react';

export default class SelectComponent extends Component {
	constructor(){
		super();
		this.countryName = {
			'KRW':'대한민국',
			'USD':'미국',
			'EUR':'유럽연합',
			'JPY':'일본',
			'CNY':'중국',
			'AUD':'호주',
			'CAD':'캐나다',
			'NZD':'뉴질랜드'
		}

		this.currency = {
			'KRW':'원',
			'USD':'달러',
			'EUR':'유로',
			'JPY':'엔',
			'CNY':'위안',
			'AUD':'달러',
			'CAD':'달러',
			'NZD':'달러'
		}
	}

	_replacePrice(val){
		let price = val.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
		return price;
	}

	_onInputChange(){
		let val = this.refs.inputNumber.value.replace(/,/g, '');
		this.props.exchange(val, this.props.selectType);
	}

	_onSelectChange(e){
		this.props.change(e.target.value, this.props.selectType);
	}

	render(){
		let { unit, currentCountry, exchangePrice, selectType } = this.props;
		let templete = unit.map((props, index)=>{
			return <option key={index} value={props}>{this.countryName[props]}</option>;
		});

		return (
			<form className='select-component'>
				<div className='select-container'>
					<label className='hideTxt'>환율을 계산할 국가를 선택</label>
					<select className='select-Box' value={currentCountry} onChange={(e)=>{this._onSelectChange(e)}}>
						{templete}
					</select>
					<span className={'countryflag ' + currentCountry}></span>
					<span className="unit">{currentCountry}</span>
				</div>
				<div className='num-container'>
					<input className='input-number' ref='inputNumber' value={this._replacePrice(exchangePrice)} onChange={(e)=>{this._onInputChange()}} />
					<span className='complete-number'>{this._replacePrice(exchangePrice)} {this.currency[currentCountry]}</span>
				</div>
			</form>
		)
	}
}