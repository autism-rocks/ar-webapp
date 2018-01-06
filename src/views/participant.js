import {JetView} from 'webix-jet';

const layout = {
  $subview: true
}

export default class Participant extends JetView {
    config() {
        return layout;
    }

    init(ui, url) {
      // console.log(url);
    }

    urlChange(view, url){
      // this.show(url[2].page)
      // console.log(url);
      // // console.log(url);
      //   if (url.length > 1) {
      //     console.log(url);
      //   }
      //       // view.queryView({view:"segmented"}).setValue(url[1].page);
    }
}
