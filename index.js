const http = require("http");
const fs = require("fs");
const requests = require("requests");
// html ko bula liya
const happy = fs.readFileSync("index.html", "utf-8");
// defining replaceVal, tempval html ke andar,orgval api se
const replaceVal = (tempval, orgval) => {
    // tempval me sabb stored hai. replace karte waqt jo chiz boli vo toh replcae hogayi baki wese ki wese temparature me aa gyi, 
    // iske aage abb temparture me replacements kiye hai
    let temperature = tempval.replace("{%tempmin%}", (orgval.main.temp_min-273.15).toFixed(2));
    temperature = temperature.replace("{%value%}", (orgval.main.temp-273.15).toFixed(2));
    temperature = temperature.replace("{%tempmax%}", (orgval.main.temp_max-273.15).toFixed(2));
    temperature = temperature.replace("{%location%}", orgval.name);
    temperature = temperature.replace("{%country%}", orgval.sys.country);
    temperature = temperature.replace("{%status%}", orgval.weather[0].main);
//    console.log(orgval.weather[0].main);
    // return karna bahut jaruri hai
    return temperature;
}
// server bana lete hai 
const server = http.createServer((req, res) => {
    if (req.url = "/")
    // npm routing
    {
        requests('https://api.openweathermap.org/data/2.5/weather?q=bhadrak&appid=50f8392da4bf71cca6b3065ba95d7d22')
            // and events module "data"
            // chunk kajyada kaam nhi hai because we re not streaming
            .on('data', (chunk) => {
                const ObjData = JSON.parse(chunk);
                const arraydata = [ObjData];
                //   console.log(chunk)
                // console.log(arraydata);
                // console.log(arraydata[0].main.temp);
                // val is realtime me jo hai vo data aur happy is html ka content
                const realtimedata = arraydata
                    .map((val) => replaceVal(happy, val))
                    .join(" ")
                res.write(realtimedata);
                res.end();
            })
            // and events module "end"
            .on('end', (err) => {
                if (err) return console.log('connection closed due to errors', err);
                // console.log('end');
            });
    }
});
server.listen(5000, () => {
    console.log("gola");
});
