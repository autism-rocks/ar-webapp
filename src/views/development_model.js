import i18n from 'locales/i18n'
import Participant from 'models/participant'
import autismRocks from 'modules/autismRocksModel'
import autismRocksSummary from 'modules/autismRocksSummary'
import {
  JetView
} from 'webix-jet'

const layout = {
  view: "tabview",
  cells: [{
    id: 'developmentSummaryFormTab',
    header: i18n.t('development_model.tab.form'),
    width: 150,
    body: {
      rows: [autismRocks]
    }
  }, {
    id: 'developmentModelFormTab',
    header: i18n.t('development_model.tab.summary'),
    width: 150,
    body: {
      rows: [autismRocksSummary]
    }
  }]
}


export default class DevelopmentModelView extends JetView {
  config() {
    return layout;
  }

  init(ui, url) {
    // console.log(url);
  }

  urlChange(view, url) {

    Participant.getParticipant(url[0].params.id).then((participant) => {
      $$("title").parse({
        title: participant.name,
        details: i18n.t('sidebar.participant.autismrocks')
      });
    }).catch(() => {
      $$("title").parse({});
    })
  }
}
