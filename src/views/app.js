import {JetView, plugins} from 'webix-jet';
import i18n from 'locales/i18n';
import User from 'models/user';
import mainToolbar from 'modules/mainToolbar'
import sidebar from "menus/sidebar";

// let sidebarMenu = new SidebarMenuView()


let body = {
    rows: [
        {
            height: 49,
            id: 'title',
            css: 'title',
            template: function(obj) {
                let html = '<div class="header">'+ obj.title +'</div>';
                if (obj.details) {
                  html += '<div class="details">(' + obj.details + ')</div>'
                }
                return html;
            },
            data: {text: '', title: ''}
        },
        {
            view: 'scrollview',
            body: {
                cols: [{
                    $subview: true
                }]
            }
        }
    ]
};

let layout = {
    id: 'app',
    rows: [
        mainToolbar,
        {
            cols: [
                sidebar,
                body
            ]
        }
    ]
};

export default class AppView extends JetView {
    config() {
        return layout;
    }

    init() {
        webix.$$("title").parse({title: i18n.t('dashboard.welcome.title'), details: i18n.t('dashboard.welcome.details')});
        return User.refreshProfile().then((profile) => {
          // console.log(sidebar);
            this.use(plugins.Menu, 'app:sidebar');
            if (!profile || profile.organizations.length == 0) {
                this.show('/registration');
            }
        }).catch((err) => {
            window.console.error(err);
            this.show('/home');
        });
    }

}
