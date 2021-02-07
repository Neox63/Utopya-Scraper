const scraper = {
    index: 1,
    pageIndex: 1,

    async scraper(browser, url, hasPagination) {
        let page = await browser.newPage();

        await page.goto(url);

        let scrapedData = [];

        const scrapeCurrentPage = async () => {
            await page.waitForSelector('.container-products');
            
            let urls = await page.$$eval('.product-items > .product-item-info', links => {
                links = links.map((el) => el.querySelector('div > a').href);

                return links;
            });

            const totalItems = await page.$eval('.left-content > .counter', text => text.textContent.replace('produits', ''));

            const totalPages = Math.ceil(totalItems / 72);

            const pagePromise = (link) => new Promise (async (resolve, reject) => {
                let dataObject = {};
                let newPage = await browser.newPage();
                let msAtStart = Date.now();

                await newPage.setDefaultNavigationTimeout(0); 
                await newPage.goto(link, { waitUntil: 'networkidle2' });

                try {
                    dataObject['title'] = await newPage.$eval('.product-head > h1', text => text.textContent);
                    
                } catch (e) {
                    dataObject['title'] = "Titre non disponible";
                }

                try {
                    dataObject['reference'] = await newPage.$eval('#product-attribute-specs-table > tbody > .attr-ean > .data', text => text.textContent);
                
                } catch (e) {
                    dataObject['reference'] = "EAN non disponible";
                }

                try {
                    dataObject['sku'] = await newPage.$eval('#product-attribute-specs-table > tbody > .attr-sku > .data', text => text.textContent);
                
                } catch (e) {
                    dataObject['sku'] = "SKU non disponible";
                }
                
                try {
                    dataObject['image'] = await newPage.$eval('img.fotorama__img', img => img.src);

                } catch (e) {
                    dataObject['image'] = "Image non disponible";
                }

                try {
                    dataObject['description'] = await newPage.$eval('#product-attribute-specs-table > tbody > .attr-short_description > .data', text => text.textContent);
                
                } catch (e) {
                    dataObject['description'] = "Description non disponible";
                }
    
                try {
                    dataObject['price'] = await newPage.$eval('span.price-wrapper > span', text => text.textContent);
                
                } catch (e) {
                    dataObject['price'] = "Prix non disponible";
                }

                console.log(`Product ${this.index} of ${totalItems} has been scrapped successfully [~${Date.now() - msAtStart} ms]`);
                this.index++;

                resolve(dataObject);

                await newPage.close();
            });

            for (link in urls) {
                const currentPageData = await pagePromise(urls[link]);
                scrapedData.push(currentPageData);
            }

            if (hasPagination) {
                let nextButtonExist = true;

                try {
                    const nextButton = await page.$eval('.next', a => a.textContent);
                    nextButtonExist = true;
    
                } catch (e) {
                    nextButtonExist = false;
                    console.log("Nothing else to scrap there, going forward !");
                    this.index = 1;
                    this.pageIndex = 2;
                }
    
                if (nextButtonExist) {
                    await page.click('.next');
                    this.pageIndex++;
                    console.log(`Navigating to the next page... (${this.pageIndex} of ${totalPages})`);
    
                    return scrapeCurrentPage();
                }
            }

            await page.close();

            return scrapedData;
        }

        let data = await scrapeCurrentPage();

        return data;
    }
}

module.exports = scraper;