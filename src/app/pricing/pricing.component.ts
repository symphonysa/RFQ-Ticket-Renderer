import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RFQService } from '../rfq.service';

@Component({
  selector: 'app-pricing',
  templateUrl: './pricing.component.html',
  styleUrls: ['./pricing.component.css']
})
export class PricingComponent implements OnInit {
  RFQ;
  constructor(private activatedRoute: ActivatedRoute, private rfqService: RFQService) {
  }

  ngOnInit() {
    this.RFQ = {};
    this.activatedRoute.params.subscribe(params => {
          const id = params['id'];
          console.log(id); // Print the parameter to the console.
          this.rfqService.getRFQ(id).subscribe((data) => {
            this.RFQ = JSON.parse( data['_body']);
            console.log(this.RFQ);
            this.RFQ.action = this.RFQ.action.toUpperCase();
          });
      });
  }

  submit() {
    console.log(this.RFQ);
    delete this.RFQ['id']['timeSecond'];
    delete this.RFQ['id']['time'];
    delete this.RFQ['id']['date'];
    this.rfqService.price(this.RFQ).subscribe((data) => {
      console.log(data);
      this.RFQ = JSON.parse( data['_body']);
    });
  }

}
