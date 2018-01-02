import i18n from '../locales/i18n.js';
import User from '../models/user';
import {JetView} from 'webix-jet';
import userForm from '../modules/userDetailsForm';
import organizationForm from '../modules/organizationDetailsForm';

let userProfile = null;

const registration = {
    view: 'accordion',
    multi: false,
    rows: [
        {
            header: '<span class="webix_icon fa-male"></span>' + i18n.t('registration.connect.title'),
            body: {
                rows: [
                    userForm,
                    {
                        margin: 10,
                        borderless: true,
                        cols: [
                            {},
                            {
                                view: 'button',
                                label: i18n.t('registration.connect.continue'),
                                gravity: 0.3,
                                type: 'form',
                                align: 'right',
                                click: function () {
                                    var form = $$('userDetailsForm');

                                    if (form.validate()) {
                                        webix.ajax()
                                            .headers({
                                                'Content-type': 'application/json'
                                            })
                                            .post('/ar/user/profile', JSON.stringify(form.getValues()))
                                            .then((res) => {
                                                res = res.json();
                                                webix.message({
                                                    text: i18n.t(res.message),
                                                    type: res.status.toLocaleLowerCase(),
                                                    expire: 4000
                                                });
                                                if (res.status == 'SUCCESS') {
                                                    form.$scope.app.show('/app/dashboard');
                                                }
                                            })
                                            .fail((res) => {
                                                window.console.error(res);
                                                let errorMessage = i18n.t('ERROR_UPDATING_PROFILE');
                                                if (res.responseText) {
                                                    errorMessage = i18n.t(JSON.parse(res.responseText).message);
                                                }
                                                webix.message({
                                                    text: errorMessage,
                                                    type: 'error',
                                                    expire: 4000
                                                });
                                            });
                                    }
                                }
                            }
                        ]
                    }
                ]
            }
        },
        {
            header: '<span class="webix_icon fa-users"></span>' + i18n.t('registration.create.title'),
            body: {
                rows: [
                    organizationForm,
                    {
                        margin: 10,
                        paddingX: 2,
                        borderless: true,
                        cols: [
                            {},
                            {
                                id: 'submitOrgButton',
                                disabled: true,
                                view: 'button',
                                label: i18n.t('registration.create.continue'),
                                gravity: 0.3,
                                type: 'form',
                                align: 'right',
                                click: function () {
                                    var form = $$('organizationDetailsForm');

                                    if (form.validate()) {
                                        webix.ajax()
                                            .headers({
                                                'Content-type': 'application/json'
                                            })
                                            .post('/ar/organizations', JSON.stringify(form.getValues()))
                                            .then((res) => {
                                                res = res.json();
                                                webix.message({
                                                    text: i18n.t(res.message),
                                                    type: res.status.toLocaleLowerCase(),
                                                    expire: 4000
                                                });
                                                if (res.status == 'SUCCESS') {
                                                    form.$scope.app.show('/app/dashboard');
                                                }
                                            })
                                            .fail((res) => {
                                                console.error(res);
                                                let errorMessage = i18n.t('ERROR_CREATING_ORGANIZATION');
                                                if (res.responseText) {
                                                    errorMessage = i18n.t(JSON.parse(res.responseText).message);
                                                }
                                                webix.message({
                                                    text: errorMessage,
                                                    type: 'error',
                                                    expire: 4000
                                                });
                                            });
                                    }
                                }
                            }
                        ]
                    }]
            },
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

    init() {
        User.getProfile().then((profile) => {
            if (profile.organizations.length > 0) {
                this.show('/app/dashboard');
            }
        });
    }
}