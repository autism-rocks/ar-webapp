import {
  JetView
} from 'webix-jet';
import User from 'models/user'
import i18n from 'locales/i18n'

const resourcesTable = {
  id: 'resourcesTable',
  editable: true,
  view: 'datatable',
  hover: 'hover',
  columns: [{
      id: "title",
      fillspace: true,
      editor: 'text',
      header: [{
        text: i18n.t('Title')
      }, {
        content: "textFilter"
      }]
    },
    {
      id: "description",
      width: 150,
      fillspace: true,
      editor: 'popup',
      header: [{
        text: i18n.t('Description')
      }, {
        content: "textFilter"
      }]
    },
    {
      id: "url",
      width: 200,
      editor: 'popup',
      header: [{
        text: i18n.t('Url')
      }, {
        content: "textFilter"
      }]
    },
    {
      id: "id_lang",
      options: '/ar/langs',
      editor: 'select',
      header: [{
        text: i18n.t('Language')
      }, {
        content: "selectFilter"
      }]
    },
    {
      id: "tags",
      width: 350,
      editor: 'popup',
      header: [{
        text: i18n.t('Tags')
      }, {
        content: "textFilter"
      }],
      template: function(obj) {

        return obj.tags ? obj.tags.split(' ').map((tag) => {
          return '<span class="status status2">' + tag + '</span>';
        }).join(' ') : '';
      }
    },
    {
      width: 50,
      template: '<a href="#url#" target="_blank">' + i18n.t('resources.details.link') + '</a>'
    },
    {
      width: 50,
      template: '<button type="button" class="remove webix_img_btn_abs webixtype_base" style="width:100%;"><span class="webix_icon fa-trash"></span></button>'
    }
  ],
  onClick: {
    remove: function(ev, id) {
      var item = this.getItem(id.row);
      var table = this;

      webix.confirm({
        title: i18n.t('resources.alert.remove.title'),
        ok: i18n.t('Yes'),
        cancel: i18n.t('No'),
        text: item.title,
        callback: function(result) { //setting callback
          if (result) {
            webix.ajax()
              .headers({
                'Content-type': 'application/json'
              })
              .del(table.config.url + '/' + item.id)
              .then(() => {
                table.remove(id);
              })
              .fail((res) => {
                window.console.error(res);
                let errorMessage = i18n.t('ERROR_SAVING_RESOURCE');
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
      });
    }
  },
  on: {

    onAfterEditStop: function(change, id) {
      var item = this.getItem(id.row);
      webix.ajax()
        .headers({
          'Content-type': 'application/json'
        })
        .post(this.config.url + '/' + item.id, JSON.stringify(item))
        .fail((res) => {
          window.console.error(res);
          let errorMessage = i18n.t('ERROR_SAVING_RESOURCE');
          if (res.responseText) {
            errorMessage = i18n.t(JSON.parse(res.responseText).message);
          }
          webix.message({
            text: errorMessage,
            type: 'error',
            expire: 4000
          });
        });
    },
  }
}


const toolbar = {
  view: "toolbar",
  cols: [{
    view: "button",
    type: 'iconButton',
    icon: 'plus',
    label: i18n.t('resources.new.add'),
    width: 250,
    click: function() {
      webix.ajax()
        .headers({
          'Content-type': 'application/json'
        })
        .post($$("resourcesTable").config.url)
        .then((res) => res.json())
        .then((res) => {
          $$('resourcesTable').clearAll();
          $$('resourcesTable').load($$("resourcesTable").config.url);
          // $$('developmentModelTreeTable').refresh();
        })
        .fail((res) => {
          window.console.error(res);
          let errorMessage = i18n.t('ERROR_ADDING_RESOURCE');
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
  }]
};

const layout = {
  rows: [toolbar, resourcesTable]
}

export default class ResourcesView extends JetView {
  config() {
    return layout;
  }

  init(ui, url) {
    // console.log(url);
  }

  urlChange(view, url) {
    User.getProfile().then((p) => {
      $$("title").parse({
        title: i18n.t('sidebar.organization.resources'),
        details: p.organizations.filter(o => url[0].params.org == o.name).map(o => o.display_name).join()
      });
    });

    $$('resourcesTable').clearAll();
    $$('resourcesTable').define('url', '/ar/resources/' + url[0].params.org)
    // this.show(url[2].page)
    // console.log(url);
    // // console.log(url);
    //   if (url.length > 1) {
    //     console.log(url);
    //   }
    //       // view.queryView({view:"segmented"}).setValue(url[1].page);
  }
}
