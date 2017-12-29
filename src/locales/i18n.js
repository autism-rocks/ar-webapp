import Polyglot from 'node-polyglot';
import messages from './messages';

let locale = 'pt_PT';
export default new Polyglot(new Polyglot({
    locale,
    phrases: messages[locale],
}));


