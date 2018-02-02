import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RFQService } from '../rfq.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
  RFQ;
  action;
  header: string;
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
            if (this.RFQ.status === 'new') {
              this.RFQ.numShares = undefined;
            } else {
              this.RFQ.action = this.RFQ.action.toUpperCase();
            }
            this.header = this.getCardHeader();
          });
      });
  }

  submit() {
    console.log(this.RFQ);
    delete this.RFQ['id']['timeSecond'];
    delete this.RFQ['id']['time'];
    delete this.RFQ['id']['date'];
    this.rfqService.sendRFQ(this.RFQ).subscribe((data) => {
      console.log(data);
      this.RFQ = JSON.parse( data['_body']);
    });
  }

  confirm() {
    console.log(this.RFQ);
    delete this.RFQ['id']['timeSecond'];
    delete this.RFQ['id']['time'];
    delete this.RFQ['id']['date'];
    this.rfqService.confirm(this.RFQ.id).subscribe((data) => {
      console.log(data);
      this.RFQ = JSON.parse( data['_body']);
    });
  }

  getCardHeader(): string {
    let header;
    switch (this.RFQ.status) {
      case 'new':
        header = 'New RFQ for ' + this.RFQ.targetCompany;
        break;
      case 'pending':
        header = 'RFQ sent to ' + this.RFQ.targetCompany;
        break;
      case 'pricing':
        header = 'RFQ is being priced by ' + this.RFQ.targetCompany;
        break;
      case 'priced':
        header = 'Create Order for RFQ with ' + this.RFQ.targetCompany;
        break;
      case 'confirmed':
        header = 'Order for RFQ sent to  ' + this.RFQ.targetCompany;
        break;
      default:
        break;
    }
    return header;
  }


}
