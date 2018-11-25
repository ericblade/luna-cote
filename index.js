const cote = require('cote');
const Service = require('./service');
const LunaService = require('webos-service-stub');
const { DatabaseStub } = LunaService;

class CoteBus {
    constructor() {
        // process.nextTick(() => {
        //     this.db = new DatabaseStub('com.webos.service.db', Service);
        //     this.tempdb = new DatabaseStub('com.webos.service.tempdb', Service);
        // });
    }
    //     this.busResponder = new cote.Responder({ name: 'luna-bus', key: 'service' });
    //     // this.requestResponder = new cote.Responder({ name: 'luna-bus', key: 'request' });
    //     // this.busPublisher = new cote.Publisher({ name: 'luna-bus publisher' });
    //     // this.busSubscriber = new cote.Subscriber({ name: 'luna-bus subscriber' });

    //     this.busResponder.on('new service', (req, cb) => {
    //         console.warn('* new service', req);
    //         // cb();
    //         // this.busPublisher.publish('new service', req, cb);
    //         this.registerService(`luna://${req.serviceName}`)
    //     });

    //     // this.requestResponder.on('request', (req, cb) => {
    //     //     console.warn('* bus request', req);
    //     //     // cb();
    //     // });

    //     // this.busSubscriber.on('new service', (req, cb) => {
    //     //     console.warn('* new service (sub)', req);
    //     // });
    // }

    // registerService(serviceName) {
    //     console.warn('* registerService', serviceName);
    // }
}

LunaService.setBusFactory(CoteBus);
LunaService.setServiceFactory(Service);

const luna = new LunaService('bus');

setInterval(() => { console.warn('*'); }, 60000);

module.exports = Service;

// const busResponder = new cote.Responder({ name: 'Luna Bus Request' });

// busResponder.on('request', (req, cb) => {
//     console.warn('* Luna Bus Request', req);
//     cb({ returnValue: true });
// });
