import {
  JetView,
  plugins
} from 'webix-jet';
import i18n from 'locales/i18n'

export function reloadSidebarData() {

  let menudata = [];

  webix.ajax('/ar/participants').then((res) => {
    res = res.json();
    try {
      if (res.length == 0) {
        menudata.push({
          id: 'add_participant',
          value: i18n.t('sidebar.add_participant'),
          icon: 'plus-circle',
          details: i18n.t('sidebar.add_participant.description')
        })
      } else {
        res.forEach((p) => {
          menudata.push({
            id: 'participantMenu'+p.id,
            value: p.name,
            icond: 'user',
            open: true,
            data: [
              {id: 'participant?id='+p.id, icon: 'user', value:i18n.t('sidebar.participant.dashboard')},
              {id: 'development_model?ref=autism-rocks&id='+p.id, icon: 'stethoscope', value:i18n.t('sidebar.participant.autismrocks')}
            ]
          })
        });
      }
      webix.$$('app:sidebar').clearAll();
      webix.$$('app:sidebar').parse(menudata);
    } catch (e) {
      console.log(e);
    }
  });

}



export default class SidebarMenuView extends JetView {
  config() {
    return {
      width: 200,
      view: 'sidebar',
      id: 'app:sidebar',
      css: 'menu',
      // activeTitle: true,
      // select: true
    };
  }

  init() {
    reloadSidebarData();
  }


}
