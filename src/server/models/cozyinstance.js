import cozydb from 'cozydb';

const Cozy = cozydb.getModel('CozyInstance', {
    domain: String,
    helpUrl: String,
    locale: String
});

export default Cozy;
