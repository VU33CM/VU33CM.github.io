(function () {

    const GOOGLE_SHEET_URL =
        "https://script.google.com/macros/s/AKfycbzgwg5xcncLGWMc5ggh7wF7RVChIe1QkvM2fH9O8tZPnQK4DDIMrEh5GBwiY5GDXwNN/exec";

    function getDevice() {
        const width = window.innerWidth;

        if (width <= 600) {
            return "Mobile";
        }

        if (width <= 1024) {
            return "Tablet";
        }

        return "Desktop";
    }

    function getOS() {
        const ua = navigator.userAgent;

        if (/iPhone|iPad|iPod/i.test(ua)) {
            return "iOS";
        }

        if (/Android/i.test(ua)) {
            return "Android";
        }

        if (/Windows/i.test(ua)) {
            return "Windows";
        }

        if (/Mac OS X/i.test(ua)) {
            return "macOS";
        }

        if (/Linux/i.test(ua)) {
            return "Linux";
        }

        return "Unknown";
    }

    function getBrowser() {
        const ua = navigator.userAgent;

        if (/Edg\//i.test(ua)) {
            return "Microsoft Edge";
        }

        if (/OPR\//i.test(ua)) {
            return "Opera";
        }

        if (/Chrome\//i.test(ua) && !/Edg\//i.test(ua)) {
            return "Google Chrome";
        }

        if (/Firefox\//i.test(ua)) {
            return "Mozilla Firefox";
        }

        if (/Safari\//i.test(ua) && !/Chrome\//i.test(ua)) {
            return "Safari";
        }

        return "Unknown";
    }

    function sendAnalytics(locationData) {

        const data = {

            type: "user",

            page:
                window.location.pathname || "home",

            country:
                locationData.country || "",

            region:
                locationData.region || "",

            city:
                locationData.city || "",

            device:
                getDevice(),

            os:
                getOS(),

            browser:
                getBrowser(),

            screen:
                window.screen.width +
                "x" +
                window.screen.height,

            timezone:
                Intl.DateTimeFormat().resolvedOptions().timeZone || "",

            referrer:
                document.referrer || ""

        };

        fetch(GOOGLE_SHEET_URL, {

            method: "POST",

            mode: "no-cors",

            headers: {
                "Content-Type":
                    "text/plain;charset=utf-8"
            },

            body: JSON.stringify(data)

        }).catch(function () {
            // Ignore analytics errors so the website continues normally.
        });
    }

    /*
     * Get approximate location from IP.
     *
     * This is NOT GPS.
     * It normally gives approximate country,
     * region and city information.
     */

    fetch("https://ipapi.co/json/")

        .then(function (response) {
            return response.json();
        })

        .then(function (location) {

            sendAnalytics({

                country:
                    location.country_name || "",

                region:
                    location.region || "",

                city:
                    location.city || ""

            });

        })

        .catch(function () {

            // If location service fails,
            // still record the visitor.

            sendAnalytics({
                country: "",
                region: "",
                city: ""
            });

        });

})();
