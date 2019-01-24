import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
  })
export class GraphService {

  allBaseUrl: string = 'https://api.coinranking.com/v1/public/coins';
  singleBaseUrl: string = 'https://api.coinranking.com/v1/public/coin/';

  constructor(
    private http: HttpClient
    ) { }

  getAllCoins(): any {
    return this.http.get<any>(this.allBaseUrl);
  }

  public getSingleCoin(coinsArray: Array<any>, name: string, histReq: string): Observable<any> {
    let option: string = '?timePeriod=30d';

    if (!!histReq) {
      option = `/${histReq}/30d`;;
    }

    let id: number = this.findIdByName(coinsArray, name);
    let url: string = `${this.singleBaseUrl}${id}${option}`;

    return this.http.get<any>(url);
  }

  findIdByName(coinsArray: Array<any>, name: string): number {
    let idArray: Array<any>;

    idArray = coinsArray.filter(item => {
      if (item.name === name) {

        return item.id;
      }
      });

    return idArray[0].id;
  }
}
