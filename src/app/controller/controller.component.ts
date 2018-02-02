import { Component, OnInit } from '@angular/core';
import {CONFIG} from '../config';
declare var SYMPHONY: any;

@Component({
  selector: 'app-controller',
  templateUrl: './controller.component.html',
  styleUrls: ['./controller.component.css']
})
export class ControllerComponent implements OnInit {

  constructor() {

    const helloControllerService = SYMPHONY.services.register(CONFIG.appId + ':controller');
    const messageControllerService = SYMPHONY.services.register(CONFIG.appId + '-message:controller');
    SYMPHONY.remote.hello().then(function(data) {
        SYMPHONY.application.register(CONFIG.appId, ['ui', 'entity'], [CONFIG.appId + ':controller', CONFIG.appId + '-message:controller'])
        .then(function(response) {
            const userId = response.userReferenceId;
            const uiService = SYMPHONY.services.subscribe('ui');
            // var shareService = SYMPHONY.services.subscribe("share");
            const entityService = SYMPHONY.services.subscribe('entity');
            entityService.registerRenderer(
                'com.symphsol.mifid',
                {},
                CONFIG.appId + '-message:controller'
            );
            messageControllerService.tracked = {};
            messageControllerService.implement({
                render: function(type, entityData) {
                    const version = entityData.version;
                    // Generate a id for each entity (unique enough for sampling purposes)
                    // Consider how to translate uuids as list indexing for more robust id marking
                    const instanceId = Math.floor(Math.random() * 1000000);
                    entityData.instanceId = instanceId;
                    const renderTime = new Date();
                    entityData.renderTime = renderTime;

                    if (version === '1.0') {
                        return this.getTemplate(entityData);
                    }
                },
                getTemplate: function(entityData) {
                    const streamId = entityData.streamId;
                    const id = entityData.id;
                    const renderTime = entityData.renderTime;
                    const current = new Date();

                    const client = entityData.client;
                    const status = entityData.status;

                    let template;
                         if (status === 'new') {
                            localStorage.setItem('client', 'true');
template = `<messageML><iframe src="` + CONFIG.URLS.client + id + `" height="300" width="300"></iframe> </messageML>`;
                        } else {
                            if (status === 'pending') {
                              localStorage.clear();
template = `<messageML><iframe src="` + CONFIG.URLS.trader + `" height="410" width="300"></iframe></messageML>`;
                            } else if (status === 'pricing') {
                                if (localStorage.getItem('client')) {
template = `<messageML><div><card accent='tempo-text-color--green'>RFQ Received, pricing in progress<br/></card></div></messageML>`;
                                } else {
template = `<messageML><iframe src="` + CONFIG.URLS.trader + id + `" height="335" width="300"></iframe></messageML>`;
                                }
                            } else if (status === 'priced') {
                                if (localStorage.getItem('client')) {
template = `<messageML><iframe src="` + CONFIG.URLS.client + id + `" height="335" width="300"></iframe></messageML>`;
                                } else {
template = `<messageML><div><card accent='tempo-text-color--green'>RFQ Priced, awaiting confirmation<br/><hr /><b>`
+ entityData.numShares + ` <cash tag='$` + entityData.symbol + `'/> @` + entityData.price + `</b></card></div></messageML>`;
                                }
                            }
                        }
                        const result = {template : template};
                        console.log(result);
                        return result;
                }
            });
        }.bind(this));
    }.bind(this));
  }

  ngOnInit() {
  }

}
