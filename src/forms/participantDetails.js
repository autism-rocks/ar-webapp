import i18n from 'locales/i18n';

const form = {
  id: 'participantForm',
  view: 'form',
  padding: 16,
  rows: [{
      name: 'name',
      required: true,
      view: 'text',
      label: i18n.t('participant.form.name.label'),
      placeholder: i18n.t('participant.form.name.placeholder'),
      labelWidth: 200,
      value: ''
    },
    {
      view: "datepicker",
      name: "dob",
      date: new Date(2012, 3, 16),
      label: i18n.t('participant.form.dob.label'),
      placeholder: i18n.t('participant.form.dob.placeholder'),
      weekHeader: true,
      labelWidth: 200
    },
    {
      name: 'gender',
      required: true,
      view: 'select',
      options: [{
        id: 'male',
        value: i18n.t('Male')
      }, {
        id: 'female',
        value: i18n.t('Female')
      }],
      label: i18n.t('participant.form.gender.label'),
      labelWidth: 200
    },
    {
      name: 'country',
      required: true,
      view: 'select',
      label: i18n.t('participant.form.country.label'),
      labelWidth: 200,
      options: '/ar/geo/countries',
      on: {
        onChange: function(country) {
          $$('cityDropdown').define('options', '/ar/geo/cities?country=' + country);
          $$('cityDropdown').refresh();
        }
      }
    },
    {
      id: 'cityDropdown',
      required: true,
      name: 'city',
      view: 'select',
      label: i18n.t('participant.form.city.label'),
      labelWidth: 200,
      options: []
    }
  ]
};


const layout = form;

export default layout;
