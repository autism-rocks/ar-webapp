import {JetView} from "webix-jet";
import i18n from 'locales/i18n'


export default class LoginMenuView extends JetView {
    config() {
        return {
            view: "menu",
            // layout: 'y',
            // css: "menu", select: true,
            data: [
                {
                    id: "facebookLogin",
                    href: '/ar/auth/facebook',
                    value: i18n.t('login.button.facebook'),
                    icon: "facebook"
                },
                {
                    id: "googleLogin",
                    href: '/ar/auth/google',
                    value: i18n.t('login.button.google'),
                    icon: "google"
                }
            ]
        };
    }
}
