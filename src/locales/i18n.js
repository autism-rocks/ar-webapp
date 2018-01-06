import Polyglot from 'node-polyglot';
import messages from './messages';

// defaults to portuguese. TODO: Create a mechanism for switching between multiple locales
let locale = 'pt_PT';
webix.i18n.dateFormat = "%d-%m-%Y";
webix.i18n.setLocale();

export default new Polyglot(new Polyglot({
    locale,
    phrases: messages[locale],
}));
