import {
  JetView
} from 'webix-jet';
import User from 'models/user'
import i18n from 'locales/i18n'

let org = null;

const usersTable = {
  id: 'usersTable',
  editable: true,
  view: 'datatable',
  rowHeight: 50,
  columns: [{
      id: 'profile_photo',
      header: {
        text: i18n.t('Photo')
      },
      template: "<img src='#profile_photo#' width='50' height='50' />"
    },
    {
      id: "name",
      fillspace: true,
      header: [{
        text: i18n.t('Name')
      }, {
        content: "textFilter"
      }]
    },
    {
      id: "email",
      width: 250,
      header: [{
        text: i18n.t('Email')
      }, {
        content: "textFilter"
      }]
    },
    {
      id: "phone",
      width: 150,
      header: [{
        text: i18n.t('Phone')
      }, {
        content: "textFilter"
      }]
    },
    {
      id: "country",
      width: 150,
      header: [{
        text: i18n.t('Country')
      }, {
        content: "selectFilter"
      }]
    },
    {
      id: "city",
      width: 150,
      header: [{
        text: i18n.t('City')
      }, {
        content: "selectFilter"
      }]
    },
    {
      id: "role",
      width: 150,
      editor: 'select',
      options: [{
        id: 'ADMIN',
        value: i18n.t('Admin')
      }, {
        id: 'HELPDESK',
        value: i18n.t('Helpdesk')
      }, {
        id: 'TERAPEUT',
        value: i18n.t('Terapeut')
      }, {
        id: 'MEMBER',
        value: i18n.t('Member')
      }],
      header: [{
        text: i18n.t('Role')
      }, {
        content: "selectFilter"
      }]
    },
    {
      id: 'details',
      width: 150,
      template: function(obj) {
          return '<a route="/app/user_details?id='+ obj.id +'&org=' + org + '"">'+i18n.t('users.details.link')+'</a>'
      }
    }
  ],
  on: {

    onAfterEditStop: function(change, id) {
      let item = this.getItem(id.row);
      let self = this;
      webix.ajax()
        .headers({
          'Content-type': 'application/json'
        })
        .post(this.config.url + '/' + item.id, JSON.stringify(item))
        .fail((res) => {
          window.console.error(res);
          let errorMessage = i18n.t('ERROR_SAVING_USER');
          if (res.responseText) {
            errorMessage = i18n.t(JSON.parse(res.responseText).message);
          }
          webix.message({
            text: errorMessage,
            type: 'error',
            expire: 4000
          });
          self.clearAll();
          self.load(self.config.url)
        });
    },
  }
}

const layout = {
  rows: [usersTable]
}

export default class UsersView extends JetView {
  config() {
    return layout;
  }

  init(ui, url) {
    // console.log(url);
  }

  urlChange(view, url) {

    org = url[0].params.org;

    User.getProfile().then((p) => {
      $$("title").parse({
        title: i18n.t('sidebar.organization.members'),
        details: p.organizations.filter(o => org == o.name).map(o => o.display_name).join()
      });
    });

    $$('usersTable').clearAll();
    $$('usersTable').define('url', '/ar/organization/' + org + '/users');
  }
}
