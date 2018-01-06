import i18n from 'locales/i18n'
import {
  JetView
} from 'webix-jet'

const scale = [{
    id: 1,
    value: i18n.t('scale.never')
  },
  {
    id: 2,
    value: i18n.t('scale.few')
  },
  {
    id: 3,
    value: i18n.t('scale.some')
  },
  {
    id: 4,
    value: i18n.t('scale.many')
  },
  {
    id: 5,
    value: i18n.t('scale.always')
  }
];

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
    }
  },
  // save: '/ar/development_model/pt/autism-rocks/2',
  columns: [{
      id: 'ref',
      header: 'Ref',
      width: 50
    },
    //{ id: "id", header: "", css: { "text-align": "right" }, width: 50 },
    {
      id: "group",
      header: i18n.t('development_model.form.question'),
      fillspace: true,
      template: function(obj, common) {
        return common.treetable(obj, common) + "<span>" + (obj.group ? obj.group : obj.question) + "</span>";
      }
    },
    {
      id: "previous_level",
      header: i18n.t('development_model.form.previous_level'),
      options: scale,
      width: 200
    },
    {
      id: "current_level",
      header: i18n.t('development_model.form.level'),
      options: scale,
      editor: 'select',
      width: 200
    }
  ],
  on: {

    onEditorChange: function(id, value) {
      var item = this.getItem(id.row);
      $$("developmentModelTreeTable").editStop();
    },

    onBeforeEditStart: function(id) {
      var item = this.getItem(id.row);
      if (!item.question) {
        return false;
      } else {
        return true;
      }
    },

    onAfterEditStop: function(change, editor) {
      // console.log(arguments);
      let item = this.getItem(editor.row);
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
	        .then((res) => {
	            $$('saveDevelopmentModel').define('disabled', false);
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


export default class DevelopmentModelView extends JetView {
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
