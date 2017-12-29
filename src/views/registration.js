import i18n from '../locales/i18n.js';
import User from '../models/user';
import {JetView} from 'webix-jet';
import userForm from '../modules/userRegistrationForm';
import organizationForm from '../modules/organizationRegistrationForm';

let userProfile = null;

const registration = {
    view: 'accordion',
    multi: false,
    rows: [
        {
            header: '<span class="webix_icon fa-male"></span>' + i18n.t('registration.connect.title'),
            body: userForm
        },
        {
            header: '<span class="webix_icon fa-users"></span>' + i18n.t('registration.create.title'),
            body: organizationForm,
            collapsed: true
        }
    ]
};


let layout = {
    cols: [
        {
            margin: 40,
            css: 'registration_profile',
            borderless: true,
            template: () => {
                var html = '';
                html += '<img class="photo" src="' + userProfile.profile_photo + '" />';
                html += '<span class="name">' + userProfile.display_name + '</span>';
                html += '<span class="email">' + userProfile.email + '</span>';
                return html;
            },
            gravity: 0.3
        },
        {
            gravity: 0.7,
            rows: [
                {
                    template: '<h1>' + i18n.t('registration.title') + '</h1>', 'css': 'title',
                    borderless: true,
                    height: 100
                },
                {
                    template: '<p>' + i18n.t('registration.info') + '</p>',
                    maxHeight: 150
                },
                registration
            ]
        }
    ]
};


export default class Registration extends JetView {
    config() {
        return User.getProfile().then((profile) => {
            userProfile = profile;
            return layout;
        });
    }
}