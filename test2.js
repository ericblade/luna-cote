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
const service = new Service('test-service2');
service.register('/test2', ({ payload }) => { console.warn('* test 2 received', payload); });
service.call('luna://test-service/test', { test: true }, ({ payload }) => { console.warn('* test1 payload=', payload) });
service.call('luna://test-service2/test2', { test: true }, ({ payload }) => { console.warn('* test2 payload=', payload) });
