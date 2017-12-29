import {JetView} from 'webix-jet';
import i18n from '../locales/i18n';


export default class OrganizationRegistrationForm extends JetView {
    config() {
        return layout;
    }
}

const layout = {
    view: 'form',
    padding: 16,
    rows: [
        {
            name: 'name',
            view: 'text',
            required: true,
            label: i18n.t('registration.create.name.label'),
            placeholder: i18n.t('registration.create.name.placeholder'),
            labelWidth: 200
        },
        {
            name: 'display_name',
            view: 'text',
            required: true,
            label: i18n.t('registration.create.displayName.label'),
            placeholder: i18n.t('registration.create.displayName.placeholder'),
            labelWidth: 200
        },
        {
            name: 'email',
            view: 'text',
            required: true,
            label: i18n.t('registration.create.email.label'),
            placeholder: i18n.t('registration.create.email.placeholder'),
            validate: webix.rules.isEmail,
            labelWidth: 200
        },
        {
            name: 'phone',
            view: 'text',
            required: true,
            label: i18n.t('registration.create.phone.label'),
            placeholder: i18n.t('registration.create.phone.placeholder'),
            labelWidth: 200,
            value: ''
        },
        {
            name: 'address',
            view: 'text',
            required: true,
            label: i18n.t('registration.create.address.label'),
            placeholder: i18n.t('registration.create.address.placeholder'),
            labelWidth: 200,
            value: ''
        },
        {
            name: 'country',
            view: 'select',
            required: true,
            label: i18n.t('registration.create.country.label'),
            labelWidth: 200,
            options: '/ar/geo/countries',
            on: {
                onChange: function (country) {
                    $$('cityOrgDropdown').define('options', '/ar/geo/cities?country=' + country);
                    $$('cityOrgDropdown').refresh();
                }
            }
        },
        {
            id: 'cityOrgDropdown',
            name: 'city',
            required: true,
            view: 'select',
            label: i18n.t('registration.connect.city.label'),
            labelWidth: 200,
            options: []
        },
        {
            name: 'postcode',
            view: 'text',
            required: true,
            label: i18n.t('registration.create.postcode.label'),
            placeholder: i18n.t('registration.create.postcode.placeholder'),
            labelWidth: 200,
            options: []
        },
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
                        var form = this.getFormView();

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
                                        this.$scope.app.show('/app/dashboard');
                                    }
                                })
                                .fail((res) => {
                                    console.log(res);
                                    let errorMessage = i18n.t('ERROR_CREATING_ORGANIZATION');
                                    if (res.responseText) {
                                        console.log(JSON.parse(res.responseText))
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
    ],
    elementsConfig: {
        on: {
            onChange: function () {
                if (this.validate()) {
                    $$('submitOrgButton').define('disabled', false);
                } else {
                    $$('submitOrgButton').define('disabled', true);
                }

            }
        }
    }
};