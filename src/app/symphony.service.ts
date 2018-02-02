import { Injectable } from '@angular/core';
import { Headers, Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/Rx';
declare var SYMPHONY: any;
import {CONFIG} from './config';
let podId;

@Injectable()
export class SymphonyService {
    podid: string;

  constructor() {
  }

  authenticate(resp) {
    console.log(resp);
    console.log(this);
    const podid = resp.pod;
    podId = resp.pod;
        return new Promise(function(resolve, reject) {
            const request = {
                podid : podid
            };
            // /authenticate should return app token
            const xhr = new XMLHttpRequest();
            xhr.open('POST', CONFIG.endpoints.authInit);
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.onload = function() {
                if (xhr.status === 200) {
                    const authResponse = JSON.parse(xhr.responseText);
                    const appToken = authResponse.appToken;
                    const symToken = authResponse.symphonyToken;
                    resolve({ appId: CONFIG.appId, tokenA: authResponse.appToken});
                } else {
                    reject(Error(xhr.status + ' : ' + xhr.responseText || xhr.statusText));
                }
            };
            xhr.send(JSON.stringify(request));
        });
  }

  register(resp) {
    return SYMPHONY.application.register(resp, ['extended-user-info'], ['authexample:controller']);
  }

  connect(resp) {
    return SYMPHONY.application.connect(CONFIG.appId, ['extended-user-info'], []);
  }

  getUserInfo(resp) {
    const userService = SYMPHONY.services.subscribe('extended-user-info');
    if (userService) {
        return userService.getJwt()
            .then((response) => {
                const jwt = response;
                console.log(jwt);
                return new Promise(function(resolve, reject) {
                    const request = {
                        podId : podId,
                        jwt: jwt
                    };
                    // /authenticate should return app token
                    const xhr = new XMLHttpRequest();
                    xhr.open('POST', CONFIG.endpoints.authVerify);
                    xhr.setRequestHeader('Content-Type', 'application/json');
                    xhr.onload = function() {
                        if (xhr.status === 200) {
                            const authResponse = JSON.parse(xhr.responseText);
                            resolve(authResponse);
                        } else {
                            reject(Error(xhr.status + ' : ' + xhr.responseText || xhr.statusText));
                        }
                    };
                    xhr.send(JSON.stringify(request));
                });
            });
    }
  }

  getSessionInfo() {
    return SYMPHONY.remote.hello()
    .then(this.authenticate)
    .then(this.register)
    .then(this.connect)
    .then(this.getUserInfo);
  }

}
