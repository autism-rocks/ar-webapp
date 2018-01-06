import {
  JetView
} from 'webix-jet';
import User from 'models/user'
import i18n from 'locales/i18n'

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
        value: 'Admin'
      }, {
        id: 'HELPDESK',
        value: 'Helpdesk'
      }, {
        id: 'TERAPEUT',
        value: 'Terapeut'
      }, {
        id: 'MEMBER',
        value: 'Member'
      }],
      header: [{
        text: i18n.t('role')
      }, {
        content: "selectFilter"
      }]
    }
  ]
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
    User.getProfile().then((p) => {
      $$("title").parse({
        title: i18n.t('sidebar.organization.members'),
        details: p.organizations.filter(o => url[0].params.name == o.name).map(o => o.display_name).join()
      });
    });

    $$('usersTable').clearAll();
    $$('usersTable').define('url', '/ar/organization/' + url[0].params.name + '/users')
    // this.show(url[2].page)
    // console.log(url);
    // // console.log(url);
    //   if (url.length > 1) {
    //     console.log(url);
    //   }
    //       // view.queryView({view:"segmented"}).setValue(url[1].page);
  }
}
