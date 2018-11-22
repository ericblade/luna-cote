const EventEmitter = require('events');
const url = require('url');

const cote = require('cote');

class CoteService {
    constructor(serviceName, activityManager, options = {}) {
        console.warn('* CoteService constructor');
        // this.busRequester = new cote.Requester({ name: 'luna-bus', key: 'service' });
        // this.busRequester.send({ type: 'new service', serviceName });
        // this.responder = new cote.Responder({ name: serviceName, key: serviceName });
        this.busId = serviceName;
        this.activityManager = activityManager;
        this.responders = [];
        this.publishers = [];
    }

    register(methodName, requestCallback, cancelCallback) {
        console.warn('* register', this.busId, methodName);
        const useMethodName = methodName.startsWith('/') ? methodName : `/${methodName}`;
        const responder = new cote.Responder({
            name: `responder key ${this.busId}${useMethodName}`,
            key: `${this.busId}${useMethodName}`,
        });
        if (requestCallback) {
            responder.on('request', (req, cb) => {
                console.warn('* onRequest', req, cb);
                const message = {
                    ...req,
                    respond: (response) => {
                        console.warn('* callback respond', response);
                        cb(null, { message, payload: { ...response } });
                    }
                }
                requestCallback(message);
                // requestCallback
            });
        }
        if (cancelCallback) {
            // TODO: ???
        }
        console.warn('* responder=', responder);
        this.responders.push(responder);
        const publisher = new cote.Publisher({
            name: `publisher key ${this.busId}${useMethodName}`,
            key: `${this.busId}${useMethodName}`,
        });
        this.publishers.push(publisher);
    }

    call(uri, args, callback) {
        const parsed = url.parse(uri);
        const requester = new cote.Requester({
            name: `call key ${parsed.host}${parsed.path}`,
            key: `${parsed.host}${parsed.path}`,
        });
        requester.send({
            type: 'request',
            payload: args,
        })
        .then(res => {
            console.warn('* res=', res);
            callback(res);
        });
    }

    subscribe(uri, args) {
        const subscription = new EventEmitter();
        const requester = new cote.Requester({
            name: `${this.busId} ss->${uri}`
        });
        requester.send(args)
        .then((resp) => {
            subscription.emit('response', resp);
            if (args.subscribe || args.watch) {
                const subscriber = new cote.Subscriber({
                    name: `${this.busId} s-> ${uri}`
                });
                subscriber.on('response', (subResp) => {
                    subscription.emit('response', subResp);
                });
            }
        });
    }
}

module.exports = CoteService;
