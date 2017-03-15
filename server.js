/**
 * Created by timmimim on 12.03.17.
 */
//  I M P O R T   L I B R A R I E S

var 	express = require('express')
	, 	parser = require('body-parser')
	,	fs = require('fs')
	,	os = require('os')
	,	path = require('path');


// R E A D   S E R V E R   I P

var os = require('os');

var ifaces=os.networkInterfaces();
var ips = [];
for (var dev in ifaces) {
	var alias=0;
	ifaces[dev].forEach(function(details){
		if (details.family=='IPv4') {
			ips.push(details.address);
			++alias;
		}
	});
}

var ip = ips.filter(function(d) {
	return d != '127.0.0.1';
})[0];


//  S E T   U P   T H E   E X P R E S S   S E R V E R
measures = 0;

var app = express();
app.use(parser.json());
app.use(parser.urlencoded ({ extended: false }));
var router = express.Router();

router.get('/', function(req, res) {
	res.sendFile(path.join(__dirname, 'index_squads.html'));
});

router.post('/sensordata', function (req, res) {
	console.log('in post handler');
	measures++;
	var fileName = path.join(__dirname, '/hoStreSpruYAcceleration/measurement_'+ measures +'.csv');
	fs.writeFile(fileName, req.body.sensData, function (err) {
		if(err){
			res.status(400).send('Something went wrong.');
		}
		else {
			console.log('file created');
			res.status(200);
		}
	});
});

app.use(router);


var port = 8013;

app.listen(port);

console.info('To connect, open your mobile web browser and go to '+ip+':'+port+'. Make sure the computer and phone are connected to the same network');