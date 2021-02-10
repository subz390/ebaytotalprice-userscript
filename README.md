# eBay Total Auction Price

## Summary

* This userscript augments the functionality of eBay and runs in an userscript manager such as the [Tampermonkey](https://www.tampermonkey.net/) add-on for Firefox and Chrome.
* Inserts the `eBay auction price` + `shipping` = `Total price` in the auction listing.
* To streamline the process of reviewing auction items.
* Initially this script was developed on the UK eBay site, and I have extended functionality to International eBay.  Or at least all the sites that I have been able to test without eBay redirecting me to a default .com site.

## Known Issues

* Due to the number of sites and pages across the eBay empire, expect there to be pages where the script doesn't find the prices to add up.  I'll keep updating the script as I personally use it, however if you find any pages that could do with adding then just let me know.

## Install Options

* [ebaytotalprice-userscript.user.js](https://github.com/subz390/ebaytotalprice-userscript/raw/master/userscripts/ebaytotalprice-userscript.user.js)
* [ebaytotalprice-userscript-min.user.js](https://github.com/subz390/ebaytotalprice-userscript/raw/master/userscripts/ebaytotalprice-userscript-min.user.js)
* [Greasy Fork](https://greasyfork.org/en/scripts/8630-ebay-total-auction-price)
* [![](https://data.jsdelivr.com/v1/package/gh/subz390/ebaytotalprice-userscript/badge)](https://www.jsdelivr.com/package/gh/subz390/ebaytotalprice-userscript)
* The `userscripts` folder contains both minified and regular bundles of the current stable release. The minified version offers a slight performance improvement over the regular, else they're functionally identical.
* In case you didn't already know, you can install userscripts directly from the GitHub Raw view of the userscript file, [view the script here](https://github.com/subz390/ebaytotalprice-userscript/blob/master/userscripts/ebaytotalprice-userscript.user.js) and click on the `Raw` button.

## Gallery List Page
![Imgur](https://i.imgur.com/24hoYMa.png)

![Imgur](https://i.imgur.com/OTS0qPS.png)

![Imgur](https://i.imgur.com/SRQ5VsD.png)

## Auction Item Page

![Imgur](https://i.imgur.com/BLl78i0.png)

![Imgur](https://i.imgur.com/haPUWi5.png)

# Contributing / Code Discussions

* Hello, I'm friendly, and I welcome discussions and pull requests related to this repo.  Feel free to open a [discussion](https://github.com/subz390/ebaytotalprice-userscript/discussions) if you'd like to chat about something.
* For a cursuary review of the code you'll find all the functions and methods are bundled into the [ebaytotalprice-userscript.user.js](https://github.com/subz390/ebaytotalprice-userscript/blob/master/userscripts/ebaytotalprice-userscript.user.js) file without comments but no mangling so should be easily readable.
* If you'd like to develop and build for the project you'll need to request access to the developer branch and the `@subz390/jsutils` library.  Open a new [discussion](https://github.com/subz390/ebaytotalprice-userscript/discussions) about that and we can figure out the details.  I don't automatically make those publicaly available due to the maintenance efforts required to do that and my limited time available to do so.  However with more people to maintain something like that it would be a more viable option.
* I only accept [Clean Code](https://www.udemy.com/course/writing-clean-code/) contributions, that is to say you should be aspiring to create human readable source code, and leave the minification, mangling and other JavaScript optimizations to [Terser](https://github.com/terser/terser).
