import { Component, OnInit } from '@angular/core';

import { GraphService } from '../../services/graph.service';
import { D3Service } from '../../services/d3.service';
import { blob } from 'd3';


@Component({
  selector: 'app-graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.scss']
})
export class GraphComponent implements OnInit {

  allCoinsArray: Array<any> = [];
  coinsInfo: object = {};
  coinsHistory: object = {};
  coinsStat: Array<any> = [];

  currenciesToAdd: Array<any> = []; //first 10 by default

  message: string = '';

  priceReverse: boolean = false;
  dateReverse: boolean = false;


  constructor(
    private graphService: GraphService,
    private d3Service: D3Service
  ) { }

  ngOnInit(): void {
    this.getCoins();
  }
  
  public getCoins(): void {
    // fetching all coins
    this.graphService.getAllCoins()
      .subscribe((res: any) => {
        this.allCoinsArray = res.data.coins;
        this.message = res.status;

        this.addOptions(this.allCoinsArray);
      });
  }

  addOptions(allCoins) {
    // adding coins info to select elem (first 10 by deafault)
    for (let i = 0; i < 10; i++) {
      this.currenciesToAdd.push(allCoins[i].name);
    }
  }

  selectOption(event: any) {
    // when option selected

    let currencyName = event.target.value;

     this.getSingleCoin(this.allCoinsArray, currencyName);

     this.getSingleCoin(this.allCoinsArray, currencyName, 'history');

     if (this.currenciesToAdd.indexOf(currencyName) > -1) this.currenciesToAdd.splice(this.currenciesToAdd.indexOf(currencyName), 1);
  }

  public getSingleCoin(coinsArray: Array<any>, name: string, histReq?: string): void {
    // fetching single coin information or history

    this.graphService.getSingleCoin(coinsArray, name, histReq)
    .subscribe((res: any) => {

      let price: string;
      let timestamp: number;
      let date: string;
      
      if (!!histReq) {
        this.coinsHistory[name] = res.data.history;
        this.message+=` ${name} history downloaded`;
        this.plot(this.coinsHistory);
        return;
      }

      this.coinsInfo[name] = res.data;
      price = res.data.coin.allTimeHigh.price;
      timestamp = res.data.coin.allTimeHigh.timestamp;
      date = this.dateFormat(res.data.coin.allTimeHigh.timestamp);
      this.coinsStat.push({name: name, price: price, date: date});
    });
  }

  public removeCoinHistory(name: string) {

    delete this.coinsHistory[name];

    this.coinsStat.forEach((item, num) => {
      if (item.name === name) {
        this.coinsStat.splice(num, 1);
      }
      });

    this.plot(this.coinsHistory);
  }

  public plot(histories: object) {

    this.d3Service.getPlot(histories);
  }

  public sort(coinsStat: Array<{ name: string, info: any }>, property: string) { // sorting

    switch (property) {
      case 'price':
        if (this.priceReverse) { // reverse sorting
          coinsStat.sort(this.priceSortReverse);
        } else {
          coinsStat.sort(this.priceSortStrict); // strict sorting
        }
        this.priceReverse = !this.priceReverse;
        break;

      case 'date':
        if (this.dateReverse) {
          coinsStat.sort(this.dateSortReverse);
        } else {
          coinsStat.sort(this.dateSortStrict);
        }
        this.dateReverse = !this.dateReverse;
        break;
    }
  }

  priceSortStrict(a: any, b: any) {
    return +a.info.coin.allTimeHigh.price - +b.info.coin.allTimeHigh.price;
  }

  priceSortReverse(a: any, b: any) {
    return +b.info.coin.allTimeHigh.price - +a.info.coin.allTimeHigh.price;
  }

  dateSortStrict(a: any, b: any) {
    return +a.info.coin.allTimeHigh.timestamp - +b.info.coin.allTimeHigh.timestamp;
  }

  dateSortReverse(a: any, b: any) {
    return +b.info.coin.allTimeHigh.timestamp - +a.info.coin.allTimeHigh.timestamp;
  }

  dateFormat(timestamp: number): string {
    let date = new Date(timestamp);
    let options = {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    };

    return date.toLocaleDateString("en-us", options);
  }
  
  download() {

    // convert chart to csv
    let csvRows = [];
    let headers = Object.keys(this.coinsStat[0]);
    let values = [];

    csvRows.push(headers.join(','));

    for (let row of this.coinsStat) {
      values = headers.map(header => {
        let escaped = (''+row[header]).replace(/"/g, '\\"');

        return `"${escaped}"`;
      });
      csvRows.push(values.join(','));
    }
    
    let csvData = csvRows.join('\n');
    
    this.downloadCsv(csvData); // downloading file


  }

  downloadCsv(data) {

    let blob = new Blob([data], { type: 'text/csv' });
    let url = window.URL.createObjectURL(blob);
    let a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', 'download.csv');
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

}
