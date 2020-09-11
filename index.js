const fs = require('fs')
var swat_proxy = require('swat-proxy');

fs.readFile('./app.js', (error, jsFile) => {
    if (error) {
        throw error
    }
    fs.readFile('./app.js', (error, cssFile) => {
        if (error) {
            throw error
        }
        // Add some JS to the end of the Google homepage.
        swat_proxy.proxy('https://bleau.info/', {
            selector: 'body',
            manipulation: swat_proxy.Manipulations.APPEND,
            matchType: swat_proxy.MatchTypes.DOMAIN,
            content: `
                <style>${cssFile}</style>
                <script>${jsFile}</script>
            `
        });

        swat_proxy.start();
    })
})

