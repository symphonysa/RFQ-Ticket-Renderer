import {BASE} from './base-config';

export const CONFIG = {
    appId: 'mifidRenderer',
    endpoints: {
        getRFQ: BASE.backend + 'RFQInfo/rfq/',
        sendRFQ: BASE.backend + 'RFQBot/sendRFQ/',
        getPending: BASE.backend + 'RFQInfo/pending',
        startPricing: BASE.backend + 'RFQBot/startPricing',
        price: BASE.backend + 'RFQBot/price',
        confirm: BASE.backend + 'RFQBot/confirm',
        authInit: BASE.backend + '/auth/init',
        authVerify: BASE.backend + '/auth/verify'
    },
    URLS: {
        trader: BASE.frontend + 'trader/',
        client: BASE.frontend + 'client/'
    }
};
