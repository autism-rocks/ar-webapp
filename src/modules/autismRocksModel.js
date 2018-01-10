import i18n from 'locales/i18n'
import Participant from 'models/participant'
import {
  JetView
} from 'webix-jet'


function scaleCellTemplate(obj, level) {
  if (obj.scale) {
    return '<span class="scale-header-option">' + i18n.t('scale.' + obj.scale + '.' + level) + '</span>'
  } else if (obj.question) {
    let checked = '';
    if (obj.current_level == level || (obj.previous_level == level && !obj.current_level)) {
      checked = 'checked'
    }
    return '<input type="radio" name="modelRowOption' + obj._id + '" value="' + level + '" ' + checked + '/>'
  } else {
    return '';
  }
}

const treetable = {
  view: "treetable",
  id: "developmentModelTreeTable",
  editable: true,
  hover: "hover",
  scheme: {

    $change: function(obj) {
      if (obj.question && !obj.current_level) {
        obj.$css = 'devmodel-required';
      } else {
        obj.$css = '';
      }

      if (obj.scale) {
        obj.$css += ' scale-header';
        obj.$height = 50;
      }
    }
  },

  columns: [{
      id: 'ref',
      header: 'Ref',
      width: 50
    },
    {
      id: "group",
      header: i18n.t('development_model.form.question'),
      fillspace: true,
      template: function(obj, common) {
        return common.treetable(obj, common) + "<span>" + (obj.group ? obj.group : obj.question) + "</span>";
      }
    },
    {
      id: "level1",
      header: '',
      width: 100,
      template: function(obj) {
        return scaleCellTemplate(obj, 1)
      }
    },
    {
      id: "level2",
      header: '',
      width: 100,
      template: function(obj) {
        return scaleCellTemplate(obj, 2)
      }
    },
    {
      id: "level3",
      header: '',
      width: 100,
      template: function(obj) {
        return scaleCellTemplate(obj, 3)
      }
    },
    {
      id: "level4",
      header: '',
      width: 100,
      template: function(obj) {
        return scaleCellTemplate(obj, 4)
      }
    },
    {
      id: "level5",
      header: '',
      width: 100,
      template: function(obj) {
        return scaleCellTemplate(obj, 5)
      }
    }
  ],
  on: {

    onBeforeEditStart: function(id) {
      if (id.column.indexOf('level') == 0) {
        return true;
      } else {
        return false;
      }
    },


    onEditorChange: function(id, value) {
      var item = this.getItem(id.row);
      $$("developmentModelTreeTable").editStop();
    },

    onItemClick: function(id) {
      var item = this.getItem(id.row);

      if (id.column.indexOf('level') == 0) {
        item.current_level = id.column.replace('level', '');
        item.$css = '';
        let table = $$("developmentModelTreeTable");
        webix.ajax()
          .headers({
            'Content-type': 'application/json'
          })
          .post(table.config.url, JSON.stringify(item))
          .then((res) => {
            var enableSaveButton = true;
            table.eachRow(
              function(row) {
                let item = table.getItem(row);
                if (item.question) {
                  enableSaveButton = enableSaveButton && item.current_level;
                }
              }
            );

            if (enableSaveButton) {
              $$('saveDevelopmentModel').define('disabled', false);
            }

          })
          .fail((res) => {
            window.console.error(res);
            let errorMessage = i18n.t('ERROR_UPDATING_EVALUATION');
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
};

const toolbar = {
  view: "toolbar",
  cols: [{},
    {
      id: "saveDevelopmentModelDate",
      view: "datepicker",
      options: [{
        id: null,
        value: 'Today'
      }],
      width: 150,
      align: "right"
    },
    {
      view: "button",
      id: "saveDevelopmentModel",
      value: i18n.t('development_model.form.save'),
      align: "right",
      width: 200,
      disabled: true,
      click: function() {
        webix.ajax()
          .headers({
            'Content-type': 'application/json'
          })
          .post($$("developmentModelTreeTable").config.url + '/record', {
            date: $$("saveDevelopmentModelDate").getValue()
          })
          .then((res) => res.json())
          .then((res) => {
            $$('saveDevelopmentModel').define('disabled', true);
            webix.message({
              text: i18n.t(res.message),
              type: 'success',
              expire: 4000
            });
            $$('developmentModelTreeTable').load($$("developmentModelTreeTable").config.url);
            // $$('developmentModelTreeTable').refresh();
          })
          .fail((res) => {
            window.console.error(res);
            let errorMessage = i18n.t('ERROR_RECORDING_PROGRESS');
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
  ]
};

const layout = {
  id: 'developmentModelForm',
  type: 'clean',
  rows: [toolbar, treetable]
};


export default class AutismRocksModel extends JetView {
  config() {
    return layout;
  }

  init(ui, url) {
    // console.log(url);
  }

  urlChange(view, url) {
    let treetableUrl = '/ar/development_model/pt/' + url[0].params.ref + '/' + url[0].params.id;
    // treetable.url = treetableUrl;
    $$('saveDevelopmentModel').define('disabled', true);
    $$("developmentModelTreeTable").clearAll();
    $$("developmentModelTreeTable").editCancel();
    $$('developmentModelTreeTable').define('url', treetableUrl);
    $$('developmentModelTreeTable').refresh();
  }
}
