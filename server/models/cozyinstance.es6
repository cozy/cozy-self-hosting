import cozydb from 'cozydb';

const Cozy = cozydb.getModel('CozyInstance', {
    domain: String,
    helpUrl: String,
    locale: String,
});

module.exports = Cozy;
