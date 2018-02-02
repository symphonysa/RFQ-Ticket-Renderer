import { Component, OnInit } from '@angular/core';

import { ActivatedRoute } from '@angular/router';
import { RFQService } from '../rfq.service';
import { SymphonyService } from '../symphony.service';


@Component({
  selector: 'app-trader',
  templateUrl: './trader.component.html',
  styleUrls: ['./trader.component.css']
})
export class TraderComponent implements OnInit {

  RFQpending;
  last;
  userInfo;
  constructor(private activatedRoute: ActivatedRoute, private rfqService: RFQService, private symphonyService: SymphonyService) {
  }

  ngOnInit() {
    this.RFQpending = [];
    this.activatedRoute.params.subscribe(params => {
          this.rfqService.getPending().subscribe((data) => {
            this.RFQpending = JSON.parse( data['_body']);
            console.log(this.RFQpending);
            this.last = this.RFQpending[this.RFQpending.length - 1];
          });
      });

    this.symphonyService.getSessionInfo().then((result) => {
      this.userInfo = result;
  })
  .catch(function(e) {
      console.error(e);
  });
    console.log(this.userInfo);
  }

  startPricing(RFQ) {
    RFQ.traderEmail = this.userInfo.emailAddress;
    delete RFQ['id']['timeSecond'];
    delete RFQ['id']['time'];
    delete RFQ['id']['date'];
    this.rfqService.startPricing(RFQ).subscribe(() => {
      this.rfqService.getPending().subscribe((data) => {
        this.RFQpending = JSON.parse( data['_body']);
        console.log(this.RFQpending);
      });
    });
  }

}
