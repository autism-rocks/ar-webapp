import i18n from 'locales/i18n';
import participantForm from 'forms/participantDetails';
import { reloadSidebarData } from 'menus/sidebar';
import {JetView} from 'webix-jet';


const layout = {
  rows: [
    participantForm,
    {
      margin: 10,
      borderless: true,
      cols: [{},
        {
          view: 'button',
          label: i18n.t('participant.form.submit'),
          gravity: 0.3,
          type: 'form',
          align: 'right',
          click: function() {
            var form = $$('participantForm');

            if (form.validate()) {
              webix.ajax()
                .headers({
                  'Content-type': 'application/json'
                })
                .post('/ar/participant', JSON.stringify(form.getValues()))
                .then((res) => {
                  res = res.json();
                  webix.message({
                    text: i18n.t(res.message),
                    type: res.status.toLocaleLowerCase(),
                    expire: 4000
                  });
                  if (res.status == 'SUCCESS') {
                    reloadSidebarData();
                    form.$scope.show('/app/participant?id=' + res.data.id);
                  }
                })
                .fail((res) => {
                  window.console.error(res);
                  let errorMessage = i18n.t('ERROR_CREATING_PARTICIPANT');
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
};


export default class Participant extends JetView {
  config() {
    return layout;
  }

  urlChange(view, url) {
    webix.$$('title').parse({
      title: i18n.t('sidebar.add_participant'),
      details: i18n.t('sidebar.add_participant.description')
    });
  }
}
