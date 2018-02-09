import i18n from 'locales/i18n'
import Participant from 'models/participant'
import {
    JetView
} from 'webix-jet'


function scaleCellTemplate(obj, level) {
    if (obj.scale) {
        return '<span class="scale-header-option">' + i18n.t('scale.' + obj.scale + '.' + level) + '</span>';
    } else if (obj.question) {
        let checked = '';
        if (obj.current_level == level || (obj.previous_level == level && obj.current_level === null)) {
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
    css: 'devmodel-form',
    editable: true,
    hover: "hover",
    scheme: {

        $change: function (obj) {
            if (obj.question && obj.current_level === null) {
                obj.$css = 'devmodel-required';
            } else {
                obj.$css = '';
            }

            if (obj.scale) {
                obj.$css += ' scale-header';
                obj.$height = 50;
            }

            if (obj.id.split('.').length == 1) {
                obj.$css += ' top-level-header';
            }

            // if (obj.question && obj.question.length > 100) {
            //   obj.$height = 55;
            // }
        }
    },
    tooltip: {
        template: function (obj) {
            return obj.description ? '<div class="tooltip-description">' + obj.description + '</div>' : '';
        }
    },
    columns: [{
        id: 'ref',
        header: 'Ref',
        width: 60
    },
        {
            id: "group",
            header: i18n.t('development_model.form.question'),
            fillspace: true,
            template: function (obj, common) {
                let text = '';

                text += "<span class='question-title'>" + (obj.group ? obj.group : obj.question) + "</span>";

                if (obj.description) {
                    text += '<span class="webix_icon fa-question-circle"></span>';
                }

                return common.treetable(obj, common) + text;
            }
        },
        {
            id: "level0",
            header: '',
            width: 90,
            template: function (obj) {
                return scaleCellTemplate(obj, 0)
            }
        },
        {
            id: "level1",
            header: '',
            width: 90,
            template: function (obj) {
                return scaleCellTemplate(obj, 1)
            }
        },
        {
            id: "level3",
            header: '',
            width: 90,
            template: function (obj) {
                return scaleCellTemplate(obj, 3)
            }
        },
        {
            id: "level6",
            header: '',
            width: 90,
            template: function (obj) {
                return scaleCellTemplate(obj, 6)
            }
        },
        {
            id: "level10",
            header: '',
            width: 90,
            template: function (obj) {
                return scaleCellTemplate(obj, 10)
            }
        }
    ],
    on: {

        onBeforeEditStart: function (id) {
            if (id.column.indexOf('level') == 0) {
                return true;
            } else {
                return false;
            }
        },

        onEditorChange: function (id, value) {
            var item = this.getItem(id.row);
            $$("developmentModelTreeTable").editStop();
        },

        onItemClick: function (id) {
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
                            function (row) {
                                let item = table.getItem(row);
                                if (item.question) {
                                    enableSaveButton = enableSaveButton && item.current_level;
                                }
                            }
                        );

                        // if (enableSaveButton) {
                            $$('saveDevelopmentModel').define('disabled', false);
                        // }

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
            click: function () {
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
