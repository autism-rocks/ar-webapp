import {
  JetView
} from 'webix-jet';
import User from 'models/user'
import i18n from 'locales/i18n'

const layout = {

  rows: [{
      id: 'userParticipantsList',
      css: 'user-participant-list',
      view: 'menu',
      select: true,
      cols: [],
      on: {
        onItemclick: function(menu) {
          this.$scope.show(menu);
        }
      }

    },
    {
      // height: 400,
      $subview: true
    }
  ]

}

export default class UserDetails extends JetView {
  config() {
    return layout;
  }

  init(ui, url) {
    // console.log(url);
  }

  urlChange(view, url) {
    User.refreshProfile(url[0].params.id).then((userDetails) => {
      $$("title").parse({
        title: userDetails.display_name,
        details: userDetails.email,
        back: {
          route: '/app/users?org=' + url[0].params.org,
          icon: 'users',
          title: i18n.t('sidebar.organization.members')
        }
      });

      $$('userParticipantsList').parse(userDetails.participants.map(p => {
        return {
          id: 'participant?id=' + p.id,
          view: 'button',
          icon: 'dashboard',
          type: 'icon',
          selected: true,
          value: p.name
        }
      }));

    }).catch((e) => {
      console.log(e);
      $$("title").parse({});
    })

    // this.show(url[2].page)
    // console.log(url);
    // // console.log(url);
    //   if (url.length > 1) {
    //     console.log(url);
    //   }
    //       // view.queryView({view:"segmented"}).setValue(url[1].page);
  }
}
