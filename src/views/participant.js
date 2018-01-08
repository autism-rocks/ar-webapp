import {JetView} from 'webix-jet';
import i18n from 'locales/i18n'
import User from 'models/user';
import Participant from 'models/participant';
import profile from 'modules/participantProfile';
import summary from 'modules/autismRocksSummary';

const layout = {
  // template: "participant"
  type: 'space',
  // height: 500,
  cols: [
    summary,
    profile
    // autismRocksProfile
  ]
}

export default class ParticipantView extends JetView {
    config() {
        return layout;
    }

    init(ui, url) {
      // console.log(url);
    }

    urlChange(view, url){
      Participant.getParticipant(url[0].params.id).then((participant) => {
        $$("title").parse({
          title: participant.name,
          details: i18n.t('Dashboard')
        });
      }).catch(() => {
        $$("title").parse({});
      })
    }
}
