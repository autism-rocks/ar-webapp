import {
  JetView
} from 'webix-jet';
import i18n from 'locales/i18n'
import participantForm from 'forms/participantDetails';
import participantUserAccess from 'modules/participantUserAccess'
import {
  reloadSidebarData
} from 'menus/sidebar';

let currentParticipantDetails = null;


const participantFormTab = {
  rows: [participantForm,
    {
      margin: 10,
      borderless: true,
      cols: [{},
        {
          view: 'button',
          label: i18n.t('Save'),
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
                .post('/ar/participant/' + currentParticipantDetails.id, JSON.stringify(form.getValues()))
                .then((res) => {
                  res = res.json();
                  webix.message({
                    text: i18n.t(res.message),
                    type: res.status.toLocaleLowerCase(),
                    expire: 4000
                  });
                  if (res.status == 'SUCCESS') {
                    reloadSidebarData();
                  }
                })
                .fail((res) => {
                  window.console.error(res);
                  let errorMessage = i18n.t('ERROR_SAVING_PARTICIPANT');
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

const participantDetailsTab = {
  id: 'participantDetailsTab',
  header: "<span class='webix_icon fa-user'></span>" + i18n.t('participant.settings.tab.data'),
  width: 250,
  body: participantFormTab
};


const participantAccessTab = {
  id: 'participantAccessTab',
  header: "<span class='webix_icon fa-user'></span>" + i18n.t('participant.settings.tab.access'),
  width: 250,
  body: {
    rows: [{
        template: i18n.t('access.section.users'),
        type: 'section'
      },
      participantUserAccess,
      {
        template: i18n.t('access.section.institutions'),
        type: 'section'
      }
    ]

  }
};

const layout = {
  id: "participantTabs",
  view: "tabview",
  cells: [participantDetailsTab, participantAccessTab]
}


export default class ParticipantSettingsView extends JetView {
  config() {
    return layout;
  }

  init(ui, url) {
    // console.log(url);
  }

  urlChange(view, url) {
    webix.ajax('/ar/participant/' + url[0].params.id).then((res) => {
      res = res.json();
      $$("title").parse({
        title: res.name,
        details: i18n.t('sidebar.participant.details')
      });

      res.dob = new Date(res.dob);
      currentParticipantDetails = res;
      $$('participantForm').parse(currentParticipantDetails);

    }).catch((e) => {
      console.log(e);
      $$("title").parse({});
    })


  }
}
