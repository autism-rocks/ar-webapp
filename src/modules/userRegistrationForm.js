import {JetView} from 'webix-jet';
import i18n from '../locales/i18n';

export default class UserRegistrationForm extends JetView {
    config() {
        return layout;
    }
}

const layout = {
    view: 'form',
    padding: 16,
    rows: [
        {
            name: 'phone',
            view: 'text',
            label: i18n.t('registration.connect.phone.label'),
            placeholder: i18n.t('registration.connect.phone.placeholder'),
            labelWidth: 200,
            value: ''
        },
        {
            name: 'address',
            view: 'text',
            label: i18n.t('registration.connect.address.label'),
            placeholder: i18n.t('registration.connect.address.placeholder'),
            labelWidth: 200,
            value: ''
        },
        {
            name: 'country',
            view: 'select',
            label: i18n.t('registration.connect.country.label'),
            labelWidth: 200,
            options: '/ar/geo/countries',
            on: {
                onChange: function (country) {
                    $$('cityDropdown').define('options', '/ar/geo/cities?country=' + country);
                    $$('cityDropdown').refresh();

                    $$('orgDropdown').define('options', '/ar/organizations?country=' + country);
                    $$('orgDropdown').refresh();
                }
            }
        },
        {
            id: 'cityDropdown',
            name: 'city',
            view: 'select',
            label: i18n.t('registration.connect.city.label'),
            labelWidth: 200,
            options: []
        },
        {
            name: 'postcode',
            view: 'text',
            label: i18n.t('registration.connect.postcode.label'),
            placeholder: i18n.t('registration.connect.postcode.placeholder'),
            labelWidth: 200,
            options: []
        },
        {
            id: 'orgDropdown',
            name: 'org',
            view: 'select',
            label: i18n.t('registration.connect.organization.label'),
            labelWidth: 200,
            options: '/ar/organizations'
        },
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
                    align: 'right'
                }
            ]
        }
    ]
};


