import {JetView} from 'webix-jet';
import i18n from 'locales/i18n';
import User from '../models/user';

let layout = {
    cols: [
        {
            template: 'BigView text',
            gravity: 0.5
        },
        {
            gravity: 0.5,
            rows: [
                {type: 'header', template: i18n.t('login.header')},
                {
                    view: 'button',
                    value: i18n.t('login.facebook.button'),
                    href: '/ar/auth/facebook',
                    type: 'form',
                    click: function () {
                        window.location = this.config.href;
                    }
                },
                {
                    view: 'button',
                    value: i18n.t('login.google.button'),
                    href: '/ar/auth/google',
                    type: 'form',
                    click: function () {
                        window.location = this.config.href;
                    }
                }
            ]
        }
    ]
};

export default class Home extends JetView {
    config() {
        return User.getProfile().then((profile) => {
            if (profile.organizations.length > 0) {
                this.app.show('/app/dashboard');
            } else {
                this.app.show('/registration');
            }

            return null;
        }).catch((err) => {
            console.log(err);
            return layout;
        });
    }

}

