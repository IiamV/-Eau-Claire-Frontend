import { Component, Input } from '@angular/core';
import { environment } from '../../../environments/environment.dev';

@Component({
    selector: 'app-auth-layout',
    imports: [],
    templateUrl: './auth-layout.html',
    styleUrls: ['./auth-layout.css']
})

export class AuthLayout {
    assetUrl = environment.assetUrl;
    logoUrl = this.assetUrl + '/logo/eau-claire-logo.png';
    pictureUrl = this.assetUrl + '/images/login-page.png';


    constructor() {}
}