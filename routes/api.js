const config = require('../config/config.json');

const api =  {
    async connect(browser, url) {
        const username = config.Utopya.username;
        const password = config.Utopya.password;

        const loginSelector = '#email';
        const passwordSelector = '#pass';
        const submitButton = '#send2';
        
        let page = await browser.newPage();

        try {
            await page.goto(url);

            await page.waitForSelector('main');
    
            await page.type(loginSelector, username, { delay: 10 });
            await page.type(passwordSelector, password, { delay: 10 });
    
            await page.click(submitButton);

            console.log("I'm connected to https://www.utopya.fr/ ! Let's get started !");

        } catch (e) {
            console.log(e);
            console.log("I failed to connect to https://www.utopya.fr/, make sure your credentials are right at '../config/config.json'");
        }
    }
}

module.exports = api;