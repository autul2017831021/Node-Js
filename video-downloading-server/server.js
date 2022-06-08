const express = require('express');
const Axios = require('axios');
const fetch = require('node-fetch');
const fs = require('fs');
const uuid = require('uuid');
const {StringDecoder} = require('string_decoder')
const app = express();
app.use(express.json());

app.get('/', function (req, res) {  
    res.writeHead(200, 'Content-Type : json');
    res.end(JSON.stringify({"status" : "OK"}) );
});

async function downloader(url,path,res,message){
    try{
        fetchedUrl = await fetch(url);
        const buffer = await fetchedUrl.buffer();
        fs.writeFile(path, buffer, () =>{
            res.writeHead(200, {'Content-Type' : 'application/json'});
            res.end(JSON.stringify({"status" : "OK","message" : message}));
            console.log(message);
        });
        // res = await Axios({
        //     url,
        //     method: 'GET',
        //     responseType: 'stream'
        // });
        // return new Promise((resolve, reject) => {
        //     res.data.pipe(fs.createWriteStream(path)).on('error', reject).once('close', () => resolve(path)); 
        // });
    }catch(err){ 
        console.log(err)
        res.writeHead(200, {'Content-Type' : 'application/json'});
        res.end(JSON.stringify({"status" : "Error","message" : "Error Occured While Downloading!"}) );
    }
}

async function imageDownloader(url,res){
    const fileId = uuid.v1();
    const imagePath = `${__dirname}/downloads/${fileId}.jpg`;
    var message = "Finished Downloading Image!";
    downloader(url,imagePath,res,message);
}
async function videoDownloader(url,res){
    const fileId = uuid.v1();
    const videoPath = `${__dirname}/downloads/${fileId}.mp4`;
    var message = "Finished Downloading Video!";
    downloader(url,videoPath,res,message);
}
app.post('/image',async function(req,res){
    const imageUrl = req.body.image;
    if(typeof imageUrl !== 'undefined')imageDownloader(imageUrl,res);
})
app.post('/video',async function(req,res){
    const videoUrl = req.body.video;
    if(typeof videoUrl !== 'undefined')videoDownloader(videoUrl,res);
})
var server = app.listen(8000, function () {
    var port = server.address().port;
    console.log('server listening at http://localhost:%s',port);  
});   