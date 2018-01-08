import {
  JetView
} from 'webix-jet';
import Participant from 'models/participant';
import i18n from 'locales/i18n'

const layout = {
  type: "clean",
  rows: [
    {
      type: 'header',
      template: "<span class='webix_icon fa-sign-in'></span>#name#",
      height: 45
    }
  ]
};

export default class ParticipantProfileView extends JetView {
  config() {
    return layout;
  }

  urlChange(view, url) {
    Participant.getParticipant(url[0].params.id).then((p) => {
      view.queryView({type:'header'}).parse(p);
    });
  }
}
