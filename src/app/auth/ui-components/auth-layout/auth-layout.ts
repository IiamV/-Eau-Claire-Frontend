import { Component, Input } from '@angular/core';
import { environment } from '../../../../environments/environment.dev';

@Component({
    selector: 'app-auth-layout',
    imports: [],
    templateUrl: './auth-layout.html',
    styleUrls: ['./auth-layout.css']
})

export class AuthLayout {
    assetUrl = environment.assetUrl;
    logo = this.assetUrl.concat('/logo/eau-claire-logo.png');
    loginPicture = this.assetUrl.concat('images/login-page.png');
}