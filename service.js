const EventEmitter = require('events');
const url = require('url');

const uniqueFilename = require('unique-filename');
const cote = require('cote');

class CoteService {
    constructor(serviceName, activityManager, options = {}) {
        // this.busRequester = new cote.Requester({ name: 'luna-bus', key: 'service' });
        // this.busRequester.send({ type: 'new service', serviceName });
        // this.responder = new cote.Responder({ name: serviceName, key: serviceName });
        this.busId = serviceName;
        this.activityManager = activityManager;
        this.responders = [];
        this.publishers = [];
    }

    register(methodName, requestCallback, cancelCallback) {
        const useMethodName = methodName.startsWith('/') ? methodName : `/${methodName}`;
        const responder = new cote.Responder({
            name: `responder key ${this.busId}${useMethodName}`,
            key: `${this.busId}${useMethodName}`,
        });
        const publisher = new cote.Publisher({
            name: `publisher key ${this.busId}${useMethodName}`,
            key: `${this.busId}${useMethodName}`,
        });
        if (requestCallback) {
            responder.on('request', (req, cb) => {
                // console.warn('* onRequest', req, cb);
                let firstResponse = true;
                const message = {
                    ...req,
                    respond: (response) => {
                        if (firstResponse) {
                            // console.warn('* callback respond', response);
                            cb(null, { message, payload: { ...response } });
                            firstResponse = false;
                        } else {
                            // console.warn('* subscription update', response);
                            publisher.publish('response', { message, payload: { ...response } });
                        }
                    }
                }
                requestCallback(message);
                // requestCallback
            });
        }
        if (cancelCallback) {
            // TODO: ???
        }
        // console.warn('* responder=', responder);
        this.responders.push(responder);
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
            // console.warn('* res=', res);
            callback(res);
        });
    }

    subscribe(uri, args) {
        const parsed = url.parse(uri);
        const subscription = new EventEmitter();
        const requester = new cote.Requester({
            name: `${this.busId} ss->${parsed.host}${parsed.path}`,
            key: `${parsed.host}${parsed.path}`,
        });
        const uniqueToken = uniqueFilename('');
        requester.send({
            type: 'request',
            payload: args,
            uniqueToken,
        })
        .then((resp) => {
            // console.warn('* subscribe received initial response', resp);
            subscription.emit('response', resp);
            if (args.subscribe || args.watch) {
                const subscriber = new cote.Subscriber({
                    name: `${this.busId} s-> ${parsed.host}${parsed.path}`,
                    key: `${parsed.host}${parsed.path}`
                });
                subscriber.on('response', (subResp) => {
                    const { payload, message: { uniqueToken: reqToken } } = subResp;
                    if (reqToken === uniqueToken) {
                        subscription.emit('response', subResp);
                    }
                });
            }
        });
        return subscription;
    }
}

module.exports = CoteService;
