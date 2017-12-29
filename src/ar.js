import '../assets/theme.siberia.less';
import {JetApp} from 'webix-jet';
import i18n from 'locales/i18n';

webix.codebase = '//cdn.webix.com/components/';

webix.ready(function () {
	if (!webix.env.touch && webix.ui.scrollSize && webix.CustomScroll)
		webix.CustomScroll.init();

	var app = new JetApp({
		id: 'ar-webapp',
		name: i18n.t('application.title'),
		version: '1.0',
		start: '/home'
	});

	app.attachEvent('app:error:resolve', function (name, err) {
		window.console.error(err);
		webix.delay(() => this.show('/error'));
	});
	app.render();

});
