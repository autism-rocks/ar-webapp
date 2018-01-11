import {
  JetView
} from 'webix-jet';
import i18n from 'locales/i18n'

const datatable = {
  editable: true,
  view: 'datatable',
  rowHeight: 50,
  columns: [{
      id: 'profile_photo',
      header: {
        text: i18n.t('Photo')
      },
      template: function(obj) {
        return '<img src="'+ (obj.profile_photo ? obj.profile_photo : '/assets/imgs/nophoto.jpg') +'" width="50" height="50" />';
      }
    },
    {
      id: "name",
      width: 200,
      header: [{
        text: i18n.t('Name')
      }]
    },
    {
      id: "email",
      width: 250,
      header: [{
        text: i18n.t('Email')
      }]
    },
    {
      id: "role",
      width: 250,
      editor: 'select',
      options: [{
        id: 'ADMIN',
        value: i18n.t('Admin')
      }, {
        id: 'EDITOR',
        value: i18n.t('Editor')
      }, {
        id: 'VIEWER',
        value: i18n.t('Viewer')
      }, {
        id: 'REMOVE',
        value: i18n.t('Remove')
      }],
      header: [{
        text: i18n.t('Role')
      }]
    },
    {
      fillspace: true
    }
  ],
  on: {
    onAfterEditStop: function(value, id) {
      let item = this.getItem(id.row);
      let headers = {
        'Content-type': 'application/json'
      };
      let datatable = this;

      webix.ajax()
        .headers(headers)[item.role == 'REMOVE' ? 'del' : 'post'](this.config.url, JSON.stringify(item))
        .then(res => res.json())
        .then((res) => {
          webix.message({
            text: res.message,
            expire: 4000
          });
          datatable.clearAll();
          datatable.load(datatable.config.url);
        })
        .fail((res) => {
          window.console.error(res);
          let errorMessage = i18n.t('SERVER_ERROR');
          try {
            errorMessage = i18n.t(JSON.parse(res.responseText).message);
          } catch (e) {};
          webix.message({
            text: errorMessage,
            type: 'error',
            expire: 4000
          });
        });
    }
  }
}

var toolbar = {
  view: "toolbar",
  cols: [{
      view: "text",
      name: "email",
      width: 200,
      placeholder: i18n.t("access.user.email.placeholder"),
      value: "",
      align: "left"
    },
    {
      view: "button",
      value: i18n.t("access.user.add"),
      width: 250,
      align: "left",
      on: {
        onItemClick: function() {
          let form = this.queryView({
            view: 'toolbar'
          }, 'parent');

          let userInfo = {
            email: form.queryView({
              name: "email"
            }).getValue()
          }

          let datatable = this.queryView({view: 'layout'}, 'parent').queryView({view:'datatable'});

          webix.ajax()
            .headers({
              'Content-type': 'application/json'
            })
            .post(form.config.url, JSON.stringify(userInfo))
            .then(res => res.json())
            .then((res) => {
              webix.message({
                text: res.message,
                expire: 4000
              });
              form.queryView({
                name: "email"
              }).setValue(null);
              datatable.clearAll();
              datatable.load(datatable.config.url);
            })
            .fail((res) => {
              window.console.error(res);
              let errorMessage = i18n.t('SERVER_ERROR');
              try {
                errorMessage = i18n.t(JSON.parse(res.responseText).message);
              } catch (e) {};
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
};


const layout = {
  view: 'layout',
  rows: [toolbar, datatable]
}


export default class ParticipantUserAccess extends JetView {
  config() {
    return layout;
  }

  init(ui, url) {
    // console.log(url);
  }

  urlChange(view, url) {
    let dataUrl = '/ar/participant/' + url[0].params.id + '/users';

    let table = view.queryView({
      view: 'datatable'
    });

    view.queryView({
      view: 'toolbar'
    }).config.url = dataUrl;

    table.config.url = dataUrl;
    table.load(dataUrl);
  }
}
