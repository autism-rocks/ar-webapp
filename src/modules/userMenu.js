import {JetView} from 'webix-jet';
import i18n from '../locales/i18n';
import User from 'models/user'
import profileMenu from 'menus/profile';

export default class UserMenu extends JetView {
    config() {
        // return layout;
        return User.getProfile().then((profile) => {
            layout.data = profile;
            return layout;
        })
    }

    init() {
        this.ui(profileMenu)
    }
}

const layout = {
    height: 46,
    css: 'header_person',
    borderless: true,
    width: 180,
    // data: {id: 3, name: 'Oliver Parr'},
    template: function (obj) {
        var html = '<div style="height:100%;width:100%;" onclick=\'webix.$$("profilePopup").show(this)\'>';
        html += '<img class="photo" src="'+ obj.profile_photo +'" /><span class="name">' + obj.display_name + '</span>';
        html += '<span class="webix_icon fa-angle-down"></span></div>';
        return html;
    }
};


