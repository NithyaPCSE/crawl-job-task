const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const http = require('http');
const jsdom = require("jsdom");
const { QueryTypes } = require('sequelize');
const { Job, Crawling, sequelize } = require('./connection');
const sock = require("socket.io")
const app = express();
const port = 3001;
const { JSDOM } = jsdom;

app.use(cors())
app.all('*', function (req, res, next) {
   res.header('Access-Control-Allow-Origin', '*');
   res.header('Access-Control-Allow-Credentials', 'true');
   res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
   res.header(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept, Authorization'
   );
   next();
});
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb', parameterLimit: 1000000 }));
app.use(bodyParser.json());

app.post('/job/create', async function (req, res) {
   let data = req.body;
   if (!data.job_url && data.job_url != '') {
      return res.send(Response(404, 'Missing Job url', {}));
   }
   let result = await Job.create({
      job_name: data.job_name,
      job_url: data.job_url,
      created_at: new Date()
   });

   app.io.emit("new-job", result);
   return res.send(Response(200, 'Job is created', result));
});

app.post('/job/update', async function (req, res) {
   let data = req.body;
   if (!data.job_id && data.job_id != '') {
      return res.send(Response(404, 'Missing Job Id', {}));
   }
   if (!data.job_status && data.job_status != '') {
      return res.send(Response(404, 'Missing Job status', {}));
   }
   let result = await Job.update({
      status: data.job_status,
      updated_at: new Date()
   }, { where: { job_id: data.job_id } });
   //let currentday = currentDate();
   let record = await sequelize.query(
      `SELECT count(id) as count, status FROM job_information GROUP by status`, { type: QueryTypes.SELECT });
   let chart_data=ChartData(record);
   let output={job_id:data.job_id,status:data.job_status};
   app.io.emit("update-job", {chart_data,output});
   return res.send(Response(200, 'Job is Updated',output));
});

app.get('/job/chart', async function (req, res) {
   //let currentday = currentDate();
   let record = await sequelize.query(
      `SELECT count(id) as count, status FROM job_information GROUP by status`, { type: QueryTypes.SELECT });
   let data=ChartData(record);
   return res.send(Response(200, 'Job is details', data));
});

app.get('/job/:status?', async function (req, res) {
   let status = req.params.status;
   if (status && status != '') {
      var result = await Job.findAll({
         where: {
            status: status
         }
      });
   } else {
      var result = await Job.findAll();
   }
   return res.send(Response(200, 'Job is details', result));
});

app.post('/crawling', async function (req, res) {
   let data = req.body;
   let checkData = await Crawling.findOne({ where: { url: data.url} });
   if (data.url && data.url != '') {
      if(checkData===null){
         return JSDOM.fromURL(data.url, {
            referrer: data.url
         }).then(async function(dom){
            let document = dom.window.document;
            let brand = document.querySelector('.BrandProductNameAndTypestyle__Wrapper-sc-117vbmi-0 a').textContent;
            let title = document.querySelector('.BrandProductNameAndTypestyle__BrandName-sc-117vbmi-2').textContent;
            let image = document.querySelector('img.ProductPreviewSliderstyle__Image-sc-1t0tp5v-2').getAttribute('src');
            await Crawling.create({
               brand: brand,
               title: title,
               image_path:image,
               url:data.url,
               created_at: new Date()
            });
            return res.send(Response(200, 'success', { brand, title, image }));
         }).catch(error => console.log(error));
      }else{
         return res.send(Response(200, 'success', { brand:checkData.brand, title:checkData.title, image:checkData.image_path }));
      }
   } else {
      return res.send(Response(404, 'Url is missing', {}));
   }
});

function Response(status = "", msg = "", data = {}) {
   return { status, msg, data }
}

function currentDate() {
   var today = new Date();
   var dd = String(today.getDate()).padStart(2, '0');
   var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
   var yyyy = today.getFullYear();
   today = yyyy + '-' + mm + '-' + dd;
   return today;
}

function ChartData(record){
   let data = [
      { status: 'In progress', count: 0, value:"in_progress"},
      { status: 'Completed', count: 0, value:"completed" },
      { status: 'Enqueued', count: 0, value:"enqueued" },
      { status: 'Failed', count: 0, value:"failed" },
   ];
   if (record.length > 0) {
      record.forEach(function (item, index) {
         let c=parseInt(item.count);
         if (item.status == 'failed') {
            data[3].count = c;
         } else if (item.status == 'in_progress') {
            data[0].count = c;
         } else if (item.status == 'completed') {
            data[1].count = c;
         } else if (item.status == 'enqueued') {
            data[2].count = c;
         }
      })
   }
   return data;
}

const server = app.listen(port, () => console.log(`Listening on port ${port}`));
const io = require('socket.io')(server);

//Attach io to express server
app.io = io;

io.on('connection', (socket) => {
   console.log("Socket started");
});