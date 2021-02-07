const pageScraper = require('../routes/scraper.js');
const fs = require('fs').promises;
const xlsx = require('json-as-xlsx');
const api = require('../routes/api.js');
const convert = require('../utils/convertTime.js');

const url = "https://www.utopya.fr";

const scrapeAll = async (browserInstance) => {
    let browser;

    try {
        let timeAtStart = Date.now();
        let fileName = 'utopya-scrapping';

        browser = await browserInstance;
        
        await api.connect(browser, 'https://www.utopya.fr/customer/account/login/');

        const console = await pageScraper.scraper(browser, 'https://www.utopya.fr/pieces-detachees/console.html', true);
        await fs.writeFile('./assets/console.json', JSON.stringify(console), 'utf-8', (err) => { if (err) return console.log(err); });

        const informatique = await pageScraper.scraper(browser, 'https://www.utopya.fr/pieces-detachees/informatique.html', true);
        await fs.writeFile('./assets/informatique.json', JSON.stringify(informatique), 'utf-8', (err) => { if (err) return console.log(err); });

        const mobilite_urbaine  = await pageScraper.scraper(browser, 'https://www.utopya.fr/pieces-detachees/mobilite-urbaine.html', false);
        await fs.writeFile('./assets/mobilite_urbaine.json', JSON.stringify(mobilite_urbaine), 'utf-8', (err) => { if (err) return console.log(err); });

        const smartphone  = await pageScraper.scraper(browser, 'https://www.utopya.fr/pieces-detachees/smartphone.html', true);
        await fs.writeFile('./assets/smartphone.json', JSON.stringify(smartphone), 'utf-8', (err) => { if (err) return console.log(err); });

        const tablette = await pageScraper.scraper(browser, 'https://www.utopya.fr/pieces-detachees/tablette.html', true);
        await fs.writeFile('./assets/tablette.json', JSON.stringify(tablette), 'utf-8', (err) => { if (err) return console.log(err); });

        const alimentation = await pageScraper.scraper(browser, 'https://www.utopya.fr/accessoires/alimentation.html', true);
        await fs.writeFile('./assets/alimentation.json', JSON.stringify(alimentation), 'utf-8', (err) => { if (err) return console.log(err); });

        const protections = await pageScraper.scraper(browser, 'https://www.utopya.fr/accessoires/protection.html', true);
        await fs.writeFile('./assets/protections.json', JSON.stringify(protections), 'utf-8', (err) => { if (err) return console.log(err); });

        const multimedia  = await pageScraper.scraper(browser, 'https://www.utopya.fr/accessoires/multimedia.html', true);
        await fs.writeFile('./assets/multimedia.json', JSON.stringify(multimedia), 'utf-8', (err) => { if (err) return console.log(err); });

        const accessoires_informatique  = await pageScraper.scraper(browser, 'https://www.utopya.fr/accessoires/informatique.html', true);
        await fs.writeFile('./assets/accessoires_informatique.json', JSON.stringify(accessoires_informatique), 'utf-8', (err) => { if (err) return console.log(err); });

        const repair = await pageScraper.scraper(browser, 'https://www.utopya.fr/magasins/reparation.html', true);
        await fs.writeFile('./assets/repair.json', JSON.stringify(repair), 'utf-8', (err) => { if (err) return console.log(err); });

        const solder = await pageScraper.scraper(browser, 'https://www.utopya.fr/magasins/micro-soudure.html', true);
        await fs.writeFile('./assets/solder.json', JSON.stringify(solder), 'utf-8', (err) => { if (err) return console.log(err); });

        const equipement = await pageScraper.scraper(browser, 'https://www.utopya.fr/magasins/equipement-magasins.html', false);
        await fs.writeFile('./assets/equipement.json', JSON.stringify(equipement), 'utf-8', (err) => { if (err) return console.log(err); });

        const appareils = await pageScraper.scraper(browser, 'https://www.utopya.fr/appareils-complets.html', true);
        await fs.writeFile('./assets/appareils.json', JSON.stringify(appareils), 'utf-8', (err) => { if (err) return console.log(err); });
        
        let timeAtEnd = Date.now();
        let totalTime = timeAtEnd - timeAtStart;

        const time = convert(totalTime);
  
        console.log(`Scrapping finished in ${time}`);
        
        const json_console = require('./assets/console.json');
        const json_informatique = require('./assets/informatique.json');
        const json_mobilite_urbaine = require('./assets/mobilite_urbaine.json');
        const json_smartphone = require('./assets/smartphone.json');
        const json_tablette = require('./assets/tablette.json');
        const json_alimentation = require('./assets/alimentation.json');
        const json_protections = require('./assets/protections.json');
        const json_multimedia = require('./assets/multimedia.json');
        const json_accessoires_informatique = require('./assets/accessoires_informatique.json');
        const json_repair = require('./assets/repair.json');
        const json_solder = require('./assets/solder.json');
        const json_equipement = require('./assets/equipement.json');
        const json_appareils = require('./assets/appareils.json');

        const columns = [
            { label: 'Titre', value: 'title' },
            { label: 'EAN', value: 'reference' },
            { label: 'SKU', value: 'sku' },
            { label: 'Image', value: row => url + row.image },
            { label: 'Description', value: 'description' },
            { label: 'HT Price', value: 'price' }
        ];

        const content = [ 
            ...json_console, 
            ...json_informatique, 
            ...json_mobilite_urbaine, 
            ...json_smartphone, 
            ...json_tablette,
            ...json_alimentation, 
            ...json_protections, 
            ...json_multimedia, 
            ...json_accessoires_informatique, 
            ...json_repair,
            ...json_solder, 
            ...json_equipement, 
            ...json_appareils
        ];

        const settings = {
            sheetName: 'Sheet',
            fileName: fileName,
            extraLength: 3,
            writeOptions: {}
        }

        const download = true;

        xlsx(columns, content, settings, download);
        
        console.log(`Data has been converted to .xlsx at './${fileName}.xlsx'`);

        browser.close();

    } catch (e) {
        console.log(e);
    }

    return browser;
}

module.exports = (browserInstance) => scrapeAll(browserInstance)