import { Injectable } from '@angular/core';
import { Headers, Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/Rx';
import {CONFIG} from './config';

@Injectable()
export class RFQService {

  constructor(private http: Http) {
  }

  getRFQ(id: string) {
    return this.http.get(CONFIG.endpoints.getRFQ + id);
  }

  sendRFQ(RFQ) {
    return this.http.post(CONFIG.endpoints.sendRFQ, RFQ);
  }

  getPending() {
    return this.http.get(CONFIG.endpoints.getPending);
  }

  startPricing(RFQ) {
    return this.http.post(CONFIG.endpoints.startPricing, RFQ);
  }

  price(RFQ) {
    return this.http.post(CONFIG.endpoints.price, RFQ);
  }

  confirm(id) {
    return this.http.post(CONFIG.endpoints.confirm, id);
  }
}
