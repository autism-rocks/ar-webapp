import {JetView} from 'webix-jet';
import i18n from '../locales/i18n';
import User from 'models/user'
import profileMenu from 'menus/profile';

export default class UserMenu extends JetView {
    config() {
        // return layout;
        return User.getProfile().then((profile) => {
            profileIcon.data = profile;
            return layout;
        })
    }

    init() {
        this.ui(profileMenu)
    }
}

let profileIcon = {
    height: 46,
    css: 'header_person',
    borderless: true,
    align: "right",
    width: 150,
    template: function (obj) {
        return '<img class="photo" src="' + obj.profile_photo + '" /><span class="display_name">'+obj.display_name+'</span>';
    }
};

let layout = {
    cols: [
        {},
        profileIcon,
        {
            view: "icon",
            align: "right",
            icon: "bars",
            click: function () {
                if ($$("userProfileMenu").config.hidden) {
                    $$("userProfileMenu").show();
                }
                else
                    $$("userProfileMenu").hide();
            }
        }
    ]
};
