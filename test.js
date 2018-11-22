// const timeStart = Date.now();
// const cote = require('cote');
// const client = new cote.Requester({ name: 'Luna Client' });
// console.warn('* init time', Date.now() - timeStart);
// setInterval(() => {
//     const timeSend = Date.now();
//     client.send({ type: 'request' }, (test) => {
//         console.warn('* request response=', test);
//         console.warn('* request time', Date.now() - timeSend);
//     });
// }, 1000);

// const Service = require('webos-service-stub');
// const service = new Service('test');
// const cote = require('cote');
// const client = new cote.Requester({ name: 'Luna Client', key: 'service' });
// client.send({ type: 'new service' });

const bus = require('./index');
const Service = require('./service');
const service = new Service('test-service');
service.register('/test', ({ payload, respond }) => { console.warn('* test 1 received', payload); respond({ returnValue: true }); });
service.call(
    'luna://test-service/test',
    { test: true },
    ({ payload }) => {
        console.warn('* return payload=', payload);
    }
);
