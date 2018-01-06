import {JetView, plugins} from 'webix-jet';
import i18n from 'locales/i18n';
import User from 'models/user';
import userMenu from 'modules/userMenu'

let layout = {
    view: 'toolbar',
    id: 'mainToolbar',
    css: 'maintoolbar',
    cols: [

        {
            view: 'label',
            align: 'left',
            label: i18n.t('application.title'),
            width: 200
        },
        {},
        userMenu
    ]
};


export default class MainToolbar extends JetView {
    config() {
        return layout;
    }
}
