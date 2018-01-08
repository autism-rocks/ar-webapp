import {
  JetView
} from 'webix-jet';
import User from 'models/user'

const layout = {
  rows: [{
      id: 'userParticipantsList',
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
        details: userDetails.email
      });

      $$('userParticipantsList').parse(userDetails.participants.map(p => {
        return {
          id: 'participant?id=' + p.id,
          view: 'button',
          icon: 'dashboard',
          type: 'icon',
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
