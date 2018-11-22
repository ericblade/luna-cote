const Service = require('./service');
const service = new Service('luna-cote-send');

const [bin, scr, uri, json] = process.argv;

if (!uri) {
    console.error('* no uri');
    process.exit(1);
}

if (!json) {
    console.error('* no json');
    process.exit(2);
}

const x = JSON.parse(json);

service.call(uri, x, ({ payload }) => {
    console.log(JSON.stringify(payload));
    process.exit();
});

// const emitter = service.subscribe(uri, x);
// emitter.on('response', (x) => { console.warn(x); });
