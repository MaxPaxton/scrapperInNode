//First Scrapper in Node.js
//Will scrap names, likes and challenges completed from users
// on codecamp.com
const rp = require('request-promise');
const cheerio = require('cheerio');
const Table = require('cli-table');

let users = [];

let table =new Table({
    head: ['username', '❤️','Challenges'],
    colWidths: [15,5,10]
})

const options = {
    url: `https://forum.freecodecamp.org/directory_items?period=weekly&order=likes_received&_=1534122554009`,
    json: true 
}

rp(options)
    .then((data)=>{
        let userData = [];
        for( let user of data.directory_items){
            userData.push({name: user.user.username , likes_receive: user.likes_receive})
        }
        process.stdout.write('loading');
        getChallengesCompletedAndPushToUserArray(userData);
    })
    .catch((err)=>{
        console.log(err);
    })
function getChallengesCompletedAndPushToUserArray(userData){
    var i =0;
    function next(){
        if (i < userData.lenght){
            var options = {
                url: `https://www.freecodecamp.org/`+userData[i].username,
                transform: body => cheerio.load(body)
            }
            rp(options)
            .then(function ($){
                process.stdout.write(`.`);
                const fccAccount = $('h1.landing-heading').lenght == 0;
                const challengesPast = fccAccount ? $('tbody tr').lenght : unknown;
                table.push(userData[i].name, userData[i].likes_receive, challengesPast);
                ++i;
                return next();
            })
        } else {
            printData();
        }
        return next();

    }
}
function printData(){
    console.log('✅');
    console.log(table.toString());
}
