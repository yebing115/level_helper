var md5 = require('blueimp-md5');
var https = require('https');
var querystring = require('querystring');

var helper = "222595c1";

var goods_id = "BI01_0002";
var view_price = 5;
var is_enforce = 1;
var amount = 1;
var iapID = 0;

var token = "227183c1,227183,1664:52954:1.1.0g:ios:appstore,1415864918,gamecenter:G:967686295,md5mac=0f607264fc6318a92b9e13c65db7cd3c idfa=3A4656AD-AA26-4139-A3D8-86DEDC29A9D9 idfv=5C60E2B8-1D57-45A4-8E7B-4BEC45F643FE,c1,29286d2c58a7162255bc3855db7040ef"
var node_code = process.argv[2];
var assess = 7;
var boost = "0|0|0";
var combos = 1;
var skill = 0;
var kill_demons = 12;
var turn = 7;
var rest_hp = 100;
var wave = 0;
var key = 'yu45w90u5030yh23pignpseihy085h$y05j09yh530hy053hy053hy0-j3092!3y043tjhtiper$nqpg^ihw0yh0w3ttt2y5a5nhgyp&aon93u923i32pinc*pi3y0y5';

var hostname = 'chn-game-portal-bdc.gameloft.com';

var start_level_path = '/1664/public/quest/StartLevel.php';
var upload_result_path = '/1664/public/quest/uploadResult.php';
var buy_item_path = '/1664/public/shop/buyItem.php';

var start_data = querystring.stringify({
    node_code: node_code,
    helper: helper,
    game_token: token
});
var req = https.request({
    hostname: hostname,
    port: 443,
    path: start_level_path,
    method: 'POST',
    headers:{
        'Content-Type' : 'application/x-www-form-urlencoded',
        'Content-Length': start_data.length
    }
}, function(res) {
    console.log("statusCode: ", res.statusCode);
    console.log("headers: ", res.headers);

    res.on('data', function(d) {
        process.stdout.write(d);
    });

    if (res.statusCode == 200) {
        var cipher = md5.md5('' + node_code + assess + boost + combos + skill + kill_demons + turn + rest_hp + wave + key);
        var upload_data = querystring.stringify({
            'game_token': token,
                'node_code': node_code,
                'assess': assess,
                'boost': boost,
                'combos': combos,
                'skill': skill,
                'kill_demons': kill_demons,
                'turn': turn,
                'rest_hp': rest_hp,
                'wave': wave,
                'cipher': cipher
        });
        var upReq = https.request({
            hostname: hostname,
            port: 443,
            path: upload_result_path,
            method: 'POST',
            headers:{
                'Content-Type' : 'application/x-www-form-urlencoded',
                'Content-Length': upload_data.length
            }
        }, function(res) {
            console.log("statusCode: ", res.statusCode);
            console.log("headers: ", res.headers);

            res.on('data', function(d) {
                process.stdout.write(d);
            });
        });
        upReq.write(upload_data);
        upReq.end();
        upReq.on('error', function(e) {
            console.error(e);
        });
    } else if (res.statusCode == 412) {
        var buy_item_data = querystring.stringify({
            game_token: token,
            goods_id: goods_id,
            view_price: view_price,
            is_enforce: is_enforce,
            amount: amount,
            iapID: iapID
        });

        var buyReq = https.request({
            hostname: hostname,
            port: 443,
            path: buy_item_path,
            method: 'POST',
            headers:{
                'Content-Type' : 'application/x-www-form-urlencoded',
                'Content-Length': buy_item_data.length
            }
        }, function(res) {
            console.log("statusCode: ", res.statusCode);
            console.log("headers: ", res.headers);

            res.on('data', function(d) {
                process.stdout.write(d);
            });
        });
        buyReq.write(buy_item_data);
        buyReq.end();
        buyReq.on('error', function(e) {
            console.error(e);
        });
    } else {
        console.log('start level request failed');
    }

});
req.write(start_data);
req.end();

req.on('error', function(e) {
    console.error(e);
});
