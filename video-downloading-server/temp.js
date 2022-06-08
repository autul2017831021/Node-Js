const fs = require('fs');
const Axios = require('axios');
const uuid = require('uuid');
const url = "https://images.unsplash.com/photo-1653329899970-355d8f1ed89b?crop=entropy&cs=tinysrgb&fm=jpg&ixlib=rb-1.2.1&q=60&raw_url=true&ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwzOXx8fGVufDB8fHx8&auto=format&fit=crop&w=500";
async function downloadImage() {
    const fileId = uuid.v1();
    let filepath = `${__dirname}/downloads/${fileId}.jpg`;
    const response = await Axios({
        url,
        method: 'GET',
        responseType: 'stream'
    });
    return new Promise((resolve, reject) => {
        response.data.pipe(fs.createWriteStream(filepath))
            .on('error', reject)
            .once('close', () => resolve(filepath)); 
    });
}

downloadImage();