import {JetView} from 'webix-jet';
import i18n from '../locales/i18n';

export default class UserDetailsForm extends JetView {
    config() {
        return layout;
    }
}

const layout = {
    id: 'userDetailsForm',
    view: 'form',
    padding: 16,
    rows: [
        {
            name: 'phone',
            required: true,
            view: 'text',
            label: i18n.t('registration.connect.phone.label'),
            placeholder: i18n.t('registration.connect.phone.placeholder'),
            labelWidth: 200,
            value: ''
        },
        {
            name: 'address',
            required: true,
            view: 'text',
            label: i18n.t('registration.connect.address.label'),
            placeholder: i18n.t('registration.connect.address.placeholder'),
            labelWidth: 200,
            value: ''
        },
        {
            name: 'country',
            required: true,
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
            required: true,
            name: 'city',
            view: 'select',
            label: i18n.t('registration.connect.city.label'),
            labelWidth: 200,
            options: []
        },
        {
            name: 'postcode',
            required: true,
            view: 'text',
            label: i18n.t('registration.connect.postcode.label'),
            placeholder: i18n.t('registration.connect.postcode.placeholder'),
            labelWidth: 200,
            options: []
        },
        {
            id: 'orgDropdown',
            required: true,
            name: 'org',
            view: 'select',
            label: i18n.t('registration.connect.organization.label'),
            labelWidth: 200,
            options: '/ar/organizations'
        }
    ]
};


