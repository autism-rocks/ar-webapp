import {
  JetView
} from 'webix-jet';
import Participant from 'models/participant';
import i18n from 'locales/i18n'

const layout = {
  rows: [{
      type: 'header',
      template: "<span class='webix_icon fa-sign-in'></span>" + i18n.t('sidebar.participant.autismrocks'),
      height: 45
    },
    {
      view: "chart",
      type: "radar",
      // width: 800,
      height: 300,
      value: "#average_level#",
      preset: "area",
      xAxis: {
        template: "#group#",
        lineColor: "#A5A5A5"
      },
      yAxis: {
        start: 0,
        end: 5,
        step: 1
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
    let dataUrl = '/ar/development_model/pt/autism-rocks/' + url[0].params.id + '/summary';
    webix.ajax(dataUrl).then((res) => res.json())
      .then((summary) => {
        view.queryView({
          view: 'chart'
        }).parse(summary);
      });

  }
}
