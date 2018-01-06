import {JetView} from 'webix-jet';
import i18n from 'locales/i18n';
import User from '../models/user';
import LoginUserMenu from 'menus/login'

let layout = {
    cols: [
        {
            template: '<img src="/assets/imgs/logo.png" width="100%" />',
            gravity: 0.4
        },
        {
            gravity: 0.6,
            rows: [
                {
                    template: '<h1>' + i18n.t('login.title') + '</h1>', 'css': 'title',
                    borderless: true,
                    height: 100
                },
                {
                    template: '<p>' + i18n.t('login.info') + '</p>',
                    maxHeight: 150
                },
                LoginUserMenu
            ]
        }
    ]
};

export default class Home extends JetView {
    config() {
        return layout;
    }


    init() {
        User.getProfile().then((profile) => {
            if (profile.organizations.length > 0) {
                this.show('/app/dashboard');
            } else {
                this.show('/registration');
            }
        }).catch(() => {
        });
    }

}
