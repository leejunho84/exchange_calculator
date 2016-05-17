'use strict';

import React, {Component} from 'react';

export default class CountryRates extends Component {
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
	}

	render(){
		let {rates, unit} = this.props;
		let templete = unit.map((prop, counter) => {
			return (
				<tr className="down" key={counter}>
					<th scope="row"><a>{this.countryName[prop]}<em>{prop}</em></a></th>
					<td>{rates.get(prop)}</td>
					<td><span className="ico">하락</span>0.47</td>
					<td>-0.05%</td>
				</tr>
			)
		});

		return(
			<div className="excr_tb">
				<table className="tb_lst">
					<caption>주요국가 환율정보</caption>
					<colgroup>
						<col width="34%" />
						<col width="24%" />
						<col width="22%" />
						<col width="20%" />
					</colgroup>
					<thead>
						<tr>
							<th scope="col">통화명</th>
							<th scope="col">매매기준율</th>
							<th scope="col">전일대비</th>
							<th scope="col">등락률</th>
						</tr>
					</thead>
					<tbody>{templete}</tbody>
				</table>
			</div>
		)
	}
}