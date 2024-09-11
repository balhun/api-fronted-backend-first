const http = require("node:http");
const url = require("node:url");
const fs = require("node:fs");

let sor = [];
fs.readFile("emberek.csv", "utf8", (error, data) => {
    if (error) {
        console.log(error);
    } else {
        sor  = data.split("\r\n");
    }
});

const server = http.createServer((request, response) => {
    response.writeHead(200, "OK", {
        'Content-Type' : 'application/json',
        'Access-Control-Allow-Origin' : '*'
    });

    let requestUrl = url.parse(request.url, true);
    let requestPathname = requestUrl.pathname;
    let requestQuery = requestUrl.query;
    let json = '{ "Status" : "OK" }';
    if (requestPathname == "/row" && requestQuery.id) {
        let id = requestQuery.id * 1;
        json = '{ "row" : "' + sor[id] + '" }';
    } else if (requestPathname == "/obj" && requestQuery.id) {
        let id = requestQuery.id * 1;
        let s = sor[id].split(";")
        json = `{
            "id" : "${s[0]}",
            "first" : "${s[1]}",
            "last" : "${s[2]}",
            "sex" : "${s[3]}",
            "email" : "${s[4]}",
            "birth" : "${s[5]}",
            "job" : "${s[6]}" 
        }`
    } else if (requestPathname == "/len") {
        json = `${sor.length}`
    } else if (requestPathname == "/name" && requestQuery.first) {
        let first = requestQuery.first;
        let sorok = [];
        for (sx of sor) {
            let s = sx.split(";");
            if (s[1] == first) sorok.push(sx);
        }
        json = JSON.stringify(sorok);
    }

    response.end(json);
});
server.listen(88);
console.log("Server started ip: localhost:88");