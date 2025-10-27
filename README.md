# eBay Total Auction Price

## This Script isn't working

* To be honest I've not had the time to maintain it, however it's not abandonware, I will eventually get it working again
* eBay have also been redesigning their UI so in some ways it's good to wait until things are settled, then the work I do won't be for nothing
* So watch the repo, and you'll get notified of any updates
* This message was updated 27 Oct 2025 20:25 

## Summary

* This userscript augments the functionality of eBay and runs in an userscript manager such as the [Tampermonkey](https://www.tampermonkey.net/) add-on for Firefox and Chrome.
* Inserts the `eBay auction price` + `shipping` = `Total price` in the auction listing.
* To streamline the process of reviewing auction items.
* Initially this script was developed on the UK eBay site, and I have extended functionality to International eBay.  Or at least all the sites that I have been able to test without eBay redirecting me to a default .com site.

## Known Issues

* Due to the number of sites and pages across the eBay empire, expect there to be pages where the script doesn't find the prices to add up.
* For the above reason `eBay Total Auction Price` script comes with no guarantee that it'll catch every single instance of a total price.
* However, if you find a page that needs updating then create a new issue including a link and a short description so that I can investigate further.

## Install Options

* [ebaytotalprice-userscript.user.js](https://github.com/subz390/ebaytotalprice-userscript/raw/master/userscripts/ebaytotalprice-userscript.user.js)
* [ebaytotalprice-userscript-min.user.js](https://github.com/subz390/ebaytotalprice-userscript/raw/master/userscripts/ebaytotalprice-userscript-min.user.js)
* [![](https://data.jsdelivr.com/v1/package/gh/subz390/ebaytotalprice-userscript/badge)](https://www.jsdelivr.com/package/gh/subz390/ebaytotalprice-userscript)
* The `userscripts` folder contains both minified and regular bundles of the current stable release. The minified version offers a slight performance improvement over the regular, else they're functionally identical.
* In case you didn't already know, you can install userscripts directly from the GitHub Raw view of the userscript file, [view the script here](https://github.com/subz390/ebaytotalprice-userscript/blob/master/userscripts/ebaytotalprice-userscript.user.js) and click on the `Raw` button.
