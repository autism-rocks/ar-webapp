import {
  JetView,
  plugins
} from 'webix-jet';
import i18n from 'locales/i18n'

export function reloadSidebarData() {

  let menudata = [];
  let promises = [
    webix.ajax('/ar/participants').then(res => res.json()),
    webix.ajax('/ar/user/organizations').then(res => res.json())
  ];

  Promise.all(promises).then((res) => {
    let participants = res[0];
    let organizations = res[1];

    // participant's menu
    if (participants.length == 0) {
      menudata.push({
        id: 'add_participant',
        value: i18n.t('sidebar.add_participant'),
        icon: 'plus-circle',
        details: i18n.t('sidebar.add_participant.description')
      })
    } else {
      participants.forEach((p) => {
        menudata.push({
          id: 'participantMenu' + p.id,
          value: p.name,
          icon: 'user',
          open: true,
          data: [{
              id: 'participant?id=' + p.id,
              icon: 'user',
              value: i18n.t('sidebar.participant.dashboard')
            },
            {
              id: 'development_model?ref=autism-rocks&id=' + p.id,
              icon: 'stethoscope',
              value: i18n.t('sidebar.participant.autismrocks')
            },
            {
              id: 'participant_settings?id=' + p.id,
              icon: 'gear',
              value: i18n.t('sidebar.participant.details')
            }
          ]
        })
      });
    }

    // organization menus
    if (organizations.length > 0) {
      organizations.forEach((o) => {

        let submenus = [];

        if (['ADMIN', 'HELPDESK'].indexOf(o.role) >= 0) {
          submenus.push({
            id: 'users?org=' + o.name,
            icon: 'users',
            value: i18n.t('sidebar.organization.members')
          });

          submenus.push({
            id: 'organization_settings?org=' + o.name,
            icon: 'gear',
            value: i18n.t('sidebar.organization.settings')
          });
        }

        if (['MEMBER'].indexOf(o.role) >= 0) {
          submenus.push({
            id: 'organization_helpdesk?org=' + o.name,
            icon: 'phone',
            value: i18n.t('sidebar.organization.helpdesk')
          });
        }

        menudata.push({
          id: 'organizationMenu' + o.id,
          value: o.display_name,
          open: true,
          // icon: 'users',
          data: submenus
        })

      });
    }
    webix.$$('app:sidebar').clearAll();
    webix.$$('app:sidebar').parse(menudata);
  }).catch(e => window.console.error);

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
