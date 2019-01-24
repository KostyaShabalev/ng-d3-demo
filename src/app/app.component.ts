import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as d3 from 'd3';

// class D3Widget {

// 	widget;

// 		constructor(data1, data2) {

// 			this.widget = d3.select('svg');
// 			this.widget.attr('width', '500px');
// 			this.widget.attr('height', '500px');
// 			this.widget.attr('fill', 'red');
// 		}

// }

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
	title = 'd3-demo';

	baseUrl: string = 'https://api.coinranking.com/v1/public/coins';
	bitcoinUrl: string = 'https://api.coinranking.com/v1/public/coin/1/history/30d';
	xrpUrl: string = 'https://api.coinranking.com/v1/public/coin/3/history/30d';

	coins: any;

	bitcoinInfo: object;
	xrpInfo: object;

	bitcoinId: string;
	xrpId: string;

	bitcoinHistory: Array<any> = [];
	xrpHistory: Array<any> = [];

	constructor(
		private http: HttpClient
		) {
			// let wid = new D3Widget(1, 2);
		}
	
	// ngAfterContentInit() {
	// 	d3.select('p').style('color', 'red');
	// }

	getCoins():void {
		this.http.get<any>(this.baseUrl)
		.subscribe((res:any) => {
			this.coins = res.data.coins;
			
			this.bitcoinInfo = this.coins[0];
			this.xrpInfo = this.coins[1];

			this.bitcoinId = this.bitcoinInfo['id'];
			this.xrpId = this.xrpInfo['id'];

			// console.log(this.bitcoinId);
			// console.log(this.xrpId);
			this.getCoinHistory();
		});

		
	}

	getCoinHistory() {
		let bitcoinUrlHistory: string = this.bitcoinUrl;
		let xrpUrlHistory: string = this.xrpUrl;

		this.http.get<any>(bitcoinUrlHistory)
		.subscribe(res => {
			this.bitcoinHistory = res.data.history;
			console.log(this.bitcoinHistory);
		});

		this.http.get<any>(xrpUrlHistory)
		.subscribe(res => {
			this.xrpHistory = res.data.history;
			console.log(this.xrpHistory);
		});
	}




}
