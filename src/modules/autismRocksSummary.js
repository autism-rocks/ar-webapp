import {
    JetView
} from 'webix-jet';
import i18n from 'locales/i18n';
import palette from 'google-palette';


const colors = palette(['tol', 'qualitative'], 8);

const layout = {
    rows: [{
        type: 'header',
        template: "<span class='webix_icon fa-sign-in'></span>" + i18n.t('sidebar.participant.autismrocks'),
        height: 45
    },
        {
            view: "chart",
            type: "radar",
            height: 300,
            xAxis: {
                template: "#group#"
            },
            yAxis: {
                start: 1,
                end: 5,
                step: 1
                // ,
                // template:function(obj){return 6-obj}
            },
            origin: 0
        }
    ]
};

export default class AutismRocksSummaryView extends JetView {
    config() {
        return layout;
    }

    urlChange(view, url) {
        // TODO: locale fix
        let dataUrl = '/ar/development_model/pt/autism-rocks/' + url[0].params.id + '/scoring?groupByUser=true';
        webix.ajax(dataUrl).then((res) => res.json())
            .then((summary) => {
                let seriesDataTmp = {};
                let legend = [];

                let chart = view.queryView({
                    view: 'chart'
                });

                chart.removeAllSeries();

                for (let i = 0; i < summary.length; i++) {
                    let userId = summary[i].label.id;
                    let userNmame = summary[i].label.name;
                    let serie = {
                        value: `#user_${userId}#`,
                        tooltip: {
                            template: `#user_${userId}_name#: #user_${userId}#`
                        },
                        line: {
                            color: `#${colors[i]}`,
                            width: 2
                        },
                        areaColor: `#${colors[i]}`,
                        item: {
                            color: "#ffffff",
                            borderColor: `#${colors[i]}`,
                            radius: 3,
                            borderWidth: 2,
                            type: ['r', 'd', 's'][(i % 3)]
                        }
                    };

                    legend.push({
                        text: userNmame,
                        color: `#${colors[i]}`
                    });
                    chart.addSeries(serie);
                    for (let j = 0; j < summary[i].data.length; j++) {
                        let g = summary[i].data[j].group;
                        let score = summary[i].data[j].score;
                        if (!seriesDataTmp[g]) {
                            seriesDataTmp[g] = {}
                        }
                        seriesDataTmp[g][`user_${userId}`] = score;
                        seriesDataTmp[g][`user_${userId}_name`] = userNmame;
                        seriesDataTmp[g][`user_${userId}_inverted`] = 6 - score;
                    }
                }

                let seriesData = Object.keys(seriesDataTmp).map(k => {
                    let row = {group: k};
                    Object.keys(seriesDataTmp[k]).forEach((uId) => {
                        row[uId] = seriesDataTmp[k][uId]
                    });
                    return row
                });

                chart.define('legend', {
                    layout: "y",
                    width: 110,
                    align: "right",
                    valign: "middle",
                    marker: {
                        type: "item"
                    },
                    values: legend
                });
                chart.parse(seriesData);
                chart.refresh();
            });

    }
}
