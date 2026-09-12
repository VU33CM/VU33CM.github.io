(function () {

    "use strict";

    /*
     * ============================================================
     * HAM CORNER — VU33CM
     * Common Site Controller + Analytics + iPhone QSL Save
     * ============================================================
     */

    const GOOGLE_SHEET_URL =
        "https://script.google.com/macros/s/AKfycbzgwg5xcncLGWMc5ggh7wF7RVChIe1QkvM2fH9O8tZPnQK4DDIMrEh5GBwiY5GDXwNN/exec";


    /*
     * ============================================================
     * PREVENT DOUBLE INITIALIZATION
     * ============================================================
     */

    if (window.__HAM_CORNER_INITIALIZED__) {
        return;
    }

    window.__HAM_CORNER_INITIALIZED__ = true;


    /*
     * ============================================================
     * DEVICE
     * ============================================================
     */

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


    /*
     * ============================================================
     * OPERATING SYSTEM
     * ============================================================
     */

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


    /*
     * ============================================================
     * BROWSER
     * ============================================================
     */

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

        if (/CriOS\//i.test(ua)) {
            return "Google Chrome iOS";
        }

        if (/FxiOS\//i.test(ua)) {
            return "Firefox iOS";
        }

        if (/Safari\//i.test(ua) && !/Chrome\//i.test(ua)) {
            return "Safari";
        }

        return "Unknown";
    }


    /*
     * ============================================================
     * iPHONE / iPAD DETECTION
     * ============================================================
     */

    function isIOS() {

        return (
            /iPhone|iPad|iPod/i.test(navigator.userAgent) ||
            (
                navigator.platform === "MacIntel" &&
                navigator.maxTouchPoints > 1
            )
        );
    }


    /*
     * ============================================================
     * COMMON WEBSITE STYLES
     *
     * These styles are injected so every page receives the
     * exact same header, navigation and footer.
     * ============================================================
     */

    function injectCommonStyles() {

        if (document.getElementById("ham-corner-common-styles")) {
            return;
        }

        const style = document.createElement("style");

        style.id = "ham-corner-common-styles";

        style.textContent = `

        /* ========================================================
           HAM CORNER COMMON HEADER
           ======================================================== */

        header.ham-common-header {

            position: sticky;
            top: 0;
            z-index: 9999;

            width: 100%;

            background:
                rgba(5, 11, 20, 0.96);

            backdrop-filter: blur(16px);
            -webkit-backdrop-filter: blur(16px);

            border-bottom:
                1px solid #1b405c;

            box-shadow:
                0 5px 25px rgba(0,0,0,.20);
        }


        .ham-common-navbar {

            width: min(1180px, 92%);

            margin: 0 auto;

            min-height: 78px;

            display: flex;

            align-items: center;

            justify-content: space-between;

            gap: 20px;
        }


        /* ========================================================
           LOGO
           ======================================================== */

        .ham-common-logo {

            display: flex;

            align-items: center;

            gap: 12px;

            flex-shrink: 0;

            text-decoration: none;

            color: #f3fbff;
        }


        .ham-common-logo-icon {

            width: 55px;
            height: 55px;

            border-radius: 50%;

            overflow: hidden;

            border:
                2px solid #19dfff;

            box-shadow:
                0 0 20px rgba(25,223,255,.35);

            flex-shrink: 0;

            background: #020911;
        }


        .ham-common-logo-icon img {

            width: 100%;
            height: 100%;

            display: block;

            object-fit: contain;
        }


        .ham-common-logo-text h1 {

            margin: 0;

            font-size: 20px;

            line-height: 1.15;

            letter-spacing: .5px;

            color: #f3fbff;
        }


        .ham-common-logo-text span {

            display: block;

            margin-top: 3px;

            color: #9bb1c5;

            font-size: 11px;

            line-height: 1.2;
        }


        /* ========================================================
           DESKTOP NAVIGATION
           ======================================================== */

        .ham-common-desktop-nav {

            display: flex;

            align-items: center;

            justify-content: flex-end;

            gap: 5px;

            flex-wrap: wrap;
        }


        .ham-common-desktop-nav a {

            display: inline-flex;

            align-items: center;

            justify-content: center;

            padding: 9px 11px;

            border-radius: 8px;

            color: #c5d8e7;

            font-size: 13px;

            line-height: 1;

            text-decoration: none;

            transition:
                background .2s ease,
                color .2s ease,
                transform .2s ease;
        }


        .ham-common-desktop-nav a:hover {

            background: #10283b;

            color: #19dfff;

            transform: translateY(-1px);
        }


        .ham-common-desktop-nav a.active {

            background: #10283b;

            color: #19dfff;

            font-weight: 800;
        }


        .ham-common-desktop-nav a.ham-quiz {

            background:
                linear-gradient(
                    135deg,
                    #19dfff,
                    #2388ff
                );

            color: #00111c;

            font-weight: 800;
        }


        .ham-common-desktop-nav a.ham-qsl {

            background:
                linear-gradient(
                    135deg,
                    #0b6f9e,
                    #00bde9
                );

            color: #ffffff;

            font-weight: 800;
        }


        /* ========================================================
           MOBILE NAVIGATION
           ======================================================== */

        .ham-mobile-nav {

            display: none;

            width: 100%;

            border-top:
                1px solid rgba(27,64,92,.65);

            background:
                rgba(3,9,17,.98);

            overflow-x: auto;

            overflow-y: hidden;

            -webkit-overflow-scrolling: touch;

            scrollbar-width: none;
        }


        .ham-mobile-nav::-webkit-scrollbar {

            display: none;
        }


        .ham-mobile-nav-inner {

            display: flex;

            width: max-content;

            min-width: 100%;

            gap: 7px;

            padding:
                9px
                4%;
        }


        .ham-mobile-nav a {

            flex-shrink: 0;

            padding:
                9px 13px;

            border:
                1px solid #1b405c;

            border-radius: 22px;

            color: #c5d8e7;

            background: #0b1b2a;

            font-size: 12px;

            line-height: 1;

            text-decoration: none;

            white-space: nowrap;
        }


        .ham-mobile-nav a.active {

            background: #19dfff;

            color: #00121b;

            border-color: #19dfff;

            font-weight: 800;
        }


        .ham-mobile-nav a.ham-mobile-quiz {

            background:
                linear-gradient(
                    135deg,
                    #19dfff,
                    #2388ff
                );

            color: #00111c;

            border-color: transparent;

            font-weight: 800;
        }


        .ham-mobile-nav a.ham-mobile-qsl {

            background:
                linear-gradient(
                    135deg,
                    #0b6f9e,
                    #00bde9
                );

            color: #ffffff;

            border-color: transparent;

            font-weight: 800;
        }


        /* ========================================================
           COMMON FOOTER
           ======================================================== */

        footer.ham-common-footer {

            margin-top: 0;

            border-top:
                1px solid #1b405c;

            background:
                #030911;

            padding:
                38px 0 28px;
        }


        .ham-common-footer-inner {

            width: min(1180px, 92%);

            margin: 0 auto;

            display: flex;

            justify-content: space-between;

            align-items: flex-start;

            gap: 30px;

            flex-wrap: wrap;
        }


        .ham-footer-brand {

            min-width: 220px;
        }


        .ham-footer-brand strong {

            color: #f3fbff;

            font-size: 15px;
        }


        .ham-footer-brand p {

            margin-top: 6px;

            color: #9bb1c5;

            font-size: 13px;
        }


        .ham-footer-links {

            display: flex;

            flex-wrap: wrap;

            gap: 9px 18px;
        }


        .ham-footer-links a {

            color: #19dfff;

            font-size: 13px;

            text-decoration: none;
        }


        .ham-footer-links a:hover {

            text-decoration: underline;
        }


        .ham-footer-bottom {

            width: min(1180px, 92%);

            margin: 25px auto 0;

            padding-top: 18px;

            border-top:
                1px solid rgba(27,64,92,.55);

            color: #607d8b;

            font-size: 11px;

            text-align: center;
        }


        /* ========================================================
           MOBILE LAYOUT
           ======================================================== */

        @media (max-width: 900px) {

            header.ham-common-header {

                position: sticky;

                top: 0;
            }


            .ham-common-navbar {

                min-height: 67px;

                width: 94%;

                gap: 10px;
            }


            .ham-common-logo {

                gap: 9px;
            }


            .ham-common-logo-icon {

                width: 46px;
                height: 46px;
            }


            .ham-common-logo-text h1 {

                font-size: 17px;
            }


            .ham-common-logo-text span {

                font-size: 9px;
            }


            .ham-common-desktop-nav {

                display: none !important;
            }


            .ham-mobile-nav {

                display: block;
            }


            footer.ham-common-footer {

                padding:
                    30px 0 22px;
            }


            .ham-common-footer-inner {

                width: 92%;

                flex-direction: column;

                gap: 18px;
            }


            .ham-footer-links {

                gap: 10px 16px;
            }
        }


        @media (max-width: 600px) {

            .ham-common-logo-text span {

                display: none;
            }


            .ham-common-logo-text h1 {

                font-size: 16px;
            }


            .ham-mobile-nav-inner {

                padding:
                    8px 3%;
            }


            .ham-mobile-nav a {

                font-size: 11px;

                padding:
                    9px 12px;
            }
        }


        /* ========================================================
           iPHONE QSL SAVE PAGE
           ======================================================== */

        .ham-qsl-save-page {

            margin: 0;

            min-height: 100vh;

            background:
                #050b14;

            color: #f3fbff;

            font-family:
                Arial,
                Helvetica,
                sans-serif;

            display: flex;

            flex-direction: column;

            align-items: center;

            justify-content: center;

            padding: 20px;
        }


        .ham-qsl-save-box {

            width: min(900px, 100%);

            text-align: center;

            background:
                #0c1b2b;

            border:
                1px solid #1b405c;

            border-radius: 18px;

            padding: 18px;

            box-shadow:
                0 20px 60px rgba(0,0,0,.45);
        }


        .ham-qsl-save-box h1 {

            margin-bottom: 8px;

            font-size: 22px;

            color: #19dfff;
        }


        .ham-qsl-save-box p {

            color: #9bb1c5;

            font-size: 14px;

            margin-bottom: 18px;
        }


        .ham-qsl-save-image {

            width: 100%;

            height: auto;

            display: block;

            border-radius: 10px;

            background: #ffffff;

            -webkit-user-select: none;

            user-select: none;
        }


        .ham-qsl-save-note {

            margin-top: 16px;

            color: #19dfff;

            font-weight: 700;

            font-size: 14px;
        }

        `;

        document.head.appendChild(style);
    }


    /*
     * ============================================================
     * FIND CURRENT PAGE
     * ============================================================
     */

    function getCurrentPage() {

        let page =
            window.location.pathname
                .split("/")
                .pop()
                .toLowerCase();

        if (!page) {
            page = "index.html";
        }

        return page;
    }


    /*
     * ============================================================
     * NAVIGATION DATA
     * ============================================================
     */

    function getNavigation() {

        return [

            {
                file: "index.html",
                label: "🏠 Home"
            },

            {
                file: "study.html",
                label: "📚 Study"
            },

            {
                file: "activities.html",
                label: "📡 Activities"
            },

            {
                file: "repeaters.html",
                label: "📻 Repeaters"
            },

            {
                file: "nets.html",
                label: "📅 Nets"
            },

            {
                file: "clubs.html",
                label: "👥 Clubs"
            },

            {
                file: "resources.html",
                label: "📖 Resources"
            },

            {
                file: "quiz.html",
                label: "🎓 ASOC Quiz",
                special: "quiz"
            },

            {
                file: "qsl.html",
                label: "📻 QSL Card",
                special: "qsl"
            }

        ];
    }


    /*
     * ============================================================
     * CREATE NAVIGATION
     * ============================================================
     */

    function createNavigation() {

        const currentPage =
            getCurrentPage();

        const navigation =
            getNavigation();


        /* Desktop */

        const desktopNav =
            document.createElement("nav");

        desktopNav.className =
            "ham-common-desktop-nav";


        navigation.forEach(function (item) {

            const link =
                document.createElement("a");

            link.href =
                item.file;

            link.textContent =
                item.label;

            if (item.file === currentPage) {

                link.classList.add("active");
            }

            if (item.special === "quiz") {

                link.classList.add("ham-quiz");
            }

            if (item.special === "qsl") {

                link.classList.add("ham-qsl");
            }

            desktopNav.appendChild(link);

        });


        /* Mobile */

        const mobileNav =
            document.createElement("div");

        mobileNav.className =
            "ham-mobile-nav";


        const mobileInner =
            document.createElement("div");

        mobileInner.className =
            "ham-mobile-nav-inner";


        navigation.forEach(function (item) {

            const link =
                document.createElement("a");

            link.href =
                item.file;

            link.textContent =
                item.label;

            if (item.file === currentPage) {

                link.classList.add("active");
            }

            if (item.special === "quiz") {

                link.classList.add("ham-mobile-quiz");
            }

            if (item.special === "qsl") {

                link.classList.add("ham-mobile-qsl");
            }

            mobileInner.appendChild(link);

        });


        mobileNav.appendChild(mobileInner);


        return {
            desktop: desktopNav,
            mobile: mobileNav
        };
    }


    /*
     * ============================================================
     * CREATE COMMON HEADER
     * ============================================================
     */

    function createCommonHeader() {

        const oldHeader =
            document.querySelector("header");


        if (oldHeader) {

            oldHeader.remove();
        }


        const header =
            document.createElement("header");

        header.className =
            "ham-common-header";


        const navbar =
            document.createElement("div");

        navbar.className =
            "ham-common-navbar";


        const logo =
            document.createElement("a");

        logo.href =
            "index.html";

        logo.className =
            "ham-common-logo";


        const logoIcon =
            document.createElement("div");

        logoIcon.className =
            "ham-common-logo-icon";


        const image =
            document.createElement("img");

        image.src =
            "logo.png";

        image.alt =
            "HAM Corner VU33CM Logo";

        image.loading =
            "eager";


        logoIcon.appendChild(image);


        const logoText =
            document.createElement("div");

        logoText.className =
            "ham-common-logo-text";


        const title =
            document.createElement("h1");

        title.textContent =
            "HAM Corner";


        const subtitle =
            document.createElement("span");

        subtitle.textContent =
            "by VU33CM • Indian Amateur Radio";


        logoText.appendChild(title);

        logoText.appendChild(subtitle);


        logo.appendChild(logoIcon);

        logo.appendChild(logoText);


        const nav =
            createNavigation();


        navbar.appendChild(logo);

        navbar.appendChild(nav.desktop);


        header.appendChild(navbar);

        header.appendChild(nav.mobile);


        document.body.insertBefore(
            header,
            document.body.firstChild
        );
    }


    /*
     * ============================================================
     * CREATE COMMON FOOTER
     * ============================================================
     */

    function createCommonFooter() {

        const oldFooter =
            document.querySelector("footer");


        if (oldFooter) {

            oldFooter.remove();
        }


        const footer =
            document.createElement("footer");

        footer.className =
            "ham-common-footer";


        const inner =
            document.createElement("div");

        inner.className =
            "ham-common-footer-inner";


        const brand =
            document.createElement("div");

        brand.className =
            "ham-footer-brand";


        const brandTitle =
            document.createElement("strong");

        brandTitle.textContent =
            "HAM Corner by VU33CM";


        const brandText =
            document.createElement("p");

        brandText.textContent =
            "Indian Amateur Radio • Learn • Communicate • Experiment";


        brand.appendChild(brandTitle);

        brand.appendChild(brandText);


        const links =
            document.createElement("div");

        links.className =
            "ham-footer-links";


        const footerLinks = [

            ["Home", "index.html"],

            ["Study", "study.html"],

            ["Activities", "activities.html"],

            ["Repeaters", "repeaters.html"],

            ["Nets", "nets.html"],

            ["Clubs", "clubs.html"],

            ["Resources", "resources.html"],

            ["ASOC Quiz", "quiz.html"],

            ["QSL Card", "qsl.html"],

            ["About", "about.html"]

        ];


        footerLinks.forEach(function (item) {

            const link =
                document.createElement("a");

            link.href =
                item[1];

            link.textContent =
                item[0];

            links.appendChild(link);

        });


        inner.appendChild(brand);

        inner.appendChild(links);


        const bottom =
            document.createElement("div");

        bottom.className =
            "ham-footer-bottom";


        bottom.textContent =
            "HAM Corner by VU33CM • Amateur Radio • 73";


        footer.appendChild(inner);

        footer.appendChild(bottom);


        document.body.appendChild(footer);
    }


    /*
     * ============================================================
     * FAVICON
     * ============================================================
     */

    function setupFavicon() {

        let favicon =
            document.querySelector(
                'link[rel="icon"]'
            );


        if (!favicon) {

            favicon =
                document.createElement("link");

            favicon.rel =
                "icon";

            document.head.appendChild(favicon);
        }


        favicon.href =
            "logo.png";
    }


    /*
     * ============================================================
     * QSL FIELD HELPER
     * ============================================================
     */

    function getFieldValue(names) {

        for (let i = 0; i < names.length; i++) {

            const name =
                names[i];


            const element =
                document.getElementById(name);


            if (element) {

                return element.value || "";
            }


            const namedElement =
                document.querySelector(
                    '[name="' + name + '"]'
                );


            if (namedElement) {

                return namedElement.value || "";
            }
        }


        return "";
    }


    /*
     * ============================================================
     * SEND QSL DATA
     *
     * This is used only for the iPhone fallback.
     * Desktop continues using the existing QSL code.
     * ============================================================
     */

    function sendQSLData() {

        const data = {

            type: "qsl",

            callsign:
                getFieldValue(["callsign"]),

            toRadio:
                getFieldValue([
                    "toRadio",
                    "to-radio",
                    "to_radio"
                ]),

            date:
                getFieldValue(["date"]),

            time:
                getFieldValue([
                    "time",
                    "utc",
                    "utcTime"
                ]),

            band:
                getFieldValue(["band"]),

            frequency:
                getFieldValue([
                    "frequency",
                    "freq"
                ]),

            mode:
                getFieldValue(["mode"]),

            rstSent:
                getFieldValue([
                    "rstSent",
                    "rst-sent"
                ]),

            rstReceived:
                getFieldValue([
                    "rstReceived",
                    "rst-received"
                ]),

            power:
                getFieldValue(["power"]),

            antenna:
                getFieldValue(["antenna"]),

            propagation:
                getFieldValue(["propagation"]),

            qslVia:
                getFieldValue([
                    "qslVia",
                    "qsl-via"
                ]),

            remarks:
                getFieldValue(["remarks"])

        };


        fetch(GOOGLE_SHEET_URL, {

            method: "POST",

            mode: "no-cors",

            headers: {

                "Content-Type":
                    "text/plain;charset=utf-8"

            },

            body:
                JSON.stringify(data)

        }).catch(function () {

            /*
             * Ignore logging errors.
             * The QSL image must still be saved.
             */

        });
    }


    /*
     * ============================================================
     * FIND QSL DOWNLOAD BUTTON
     * ============================================================
     */

    function findQSLDownloadButton() {

        const elements =
            document.querySelectorAll(
                "button, a, input[type='button'], input[type='submit']"
            );


        for (let i = 0; i < elements.length; i++) {

            const element =
                elements[i];


            const text =
                (
                    element.innerText ||
                    element.value ||
                    ""
                )
                .trim()
                .toLowerCase();


            if (
                text.includes("download jpg") ||
                text.includes("download qsl") ||
                text.includes("download card")
            ) {

                return element;
            }
        }


        return null;
    }


    /*
     * ============================================================
     * FIND QSL CANVAS
     * ============================================================
     */

    function findQSLCanvas() {

        const canvases =
            document.querySelectorAll("canvas");


        if (!canvases.length) {

            return null;
        }


        /*
         * Prefer the large QSL canvas.
         */

        for (let i = 0; i < canvases.length; i++) {

            const canvas =
                canvases[i];


            if (
                canvas.width >= 1000 &&
                canvas.height >= 700
            ) {

                return canvas;
            }
        }


        return canvases[0];
    }


    /*
     * ============================================================
     * iPHONE QSL SAVE VIEW
     *
     * This is intentionally used on iPhone/iPad instead of
     * relying on Safari's automatic download behavior.
     * ============================================================
     */

    function openIOSQSLImage(canvas) {

        if (!canvas) {

            alert(
                "QSL image is not ready yet. Please wait a moment and try again."
            );

            return;
        }


        sendQSLData();


        canvas.toBlob(
            function (blob) {

                if (!blob) {

                    alert(
                        "Unable to create the QSL image. Please try again."
                    );

                    return;
                }


                const imageURL =
                    URL.createObjectURL(blob);


                const saveWindow =
                    window.open(
                        "",
                        "_blank"
                    );


                if (!saveWindow) {

                    /*
                     * Popup blocked.
                     * Use the image URL in the current tab.
                     */

                    window.location.href =
                        imageURL;

                    return;
                }


                saveWindow.document.open();


                saveWindow.document.write(`

                    <!DOCTYPE html>

                    <html>

                    <head>

                        <meta
                            name="viewport"
                            content="width=device-width, initial-scale=1.0"
                        >

                        <title>
                            HAM Corner QSL Card
                        </title>

                    </head>

                    <body
                        class="ham-qsl-save-page"
                    >

                        <div
                            class="ham-qsl-save-box"
                        >

                            <h1>
                                📻 Your QSL Card
                            </h1>

                            <p>
                                Your QSL card is ready.
                            </p>

                            <img
                                src="${imageURL}"
                                class="ham-qsl-save-image"
                                alt="HAM Corner QSL Card"
                            >

                            <div
                                class="ham-qsl-save-note"
                            >
                                📱 Press and hold the image,
                                then choose
                                <strong>
                                    Save to Photos
                                </strong>
                                or
                                <strong>
                                    Save to Files
                                </strong>.
                            </div>

                        </div>

                    </body>

                    </html>

                `);


                saveWindow.document.close();


                /*
                 * Keep the Blob URL alive while the new page
                 * is being displayed.
                 */

                setTimeout(function () {

                    /*
                     * Do not immediately revoke on iPhone.
                     * The user may need the image for several
                     * seconds while saving it.
                     */

                    setTimeout(function () {

                        URL.revokeObjectURL(
                            imageURL
                        );

                    }, 10 * 60 * 1000);

                }, 1000);

            },

            "image/jpeg",

            0.95
        );
    }


    /*
     * ============================================================
     * INSTALL iPHONE QSL SAVE HANDLER
     * ============================================================
     */

    function setupQSLDownload() {

        if (
            !isIOS() ||
            !(
                getCurrentPage() === "qsl.html"
            )
        ) {

            return;
        }


        const button =
            findQSLDownloadButton();


        if (!button) {

            return;
        }


        /*
         * Replace the existing click handler on iOS only.
         *
         * The desktop QSL behavior is untouched.
         */

        const replacement =
            button.cloneNode(true);


        button.parentNode.replaceChild(
            replacement,
            button
        );


        replacement.addEventListener(
            "click",
            function (event) {

                event.preventDefault();

                event.stopPropagation();

                const canvas =
                    findQSLCanvas();


                openIOSQSLImage(canvas);

            }
        );
    }


    /*
     * ============================================================
     * ANALYTICS
     * ============================================================
     */

    function sendAnalytics(locationData) {

        const data = {

            type: "user",

            page:
                window.location.pathname ||
                "home",

            country:
                locationData.country ||
                "",

            region:
                locationData.region ||
                "",

            city:
                locationData.city ||
                "",

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
                Intl.DateTimeFormat()
                    .resolvedOptions()
                    .timeZone ||
                "",

            referrer:
                document.referrer ||
                ""

        };


        fetch(
            GOOGLE_SHEET_URL,
            {

                method: "POST",

                mode: "no-cors",

                headers: {

                    "Content-Type":
                        "text/plain;charset=utf-8"

                },

                body:
                    JSON.stringify(data)

            }
        ).catch(function () {

            /*
             * Analytics must never interfere
             * with normal website operation.
             */

        });
    }


    /*
     * ============================================================
     * INITIALIZE WEBSITE
     * ============================================================
     */

    function initializeWebsite() {

        injectCommonStyles();

        setupFavicon();

        createCommonHeader();

        createCommonFooter();

        setupQSLDownload();
    }


    /*
     * ============================================================
     * START
     * ============================================================
     */

    function start() {

        initializeWebsite();


        /*
         * Get approximate visitor location.
         * This is IP-based location, not GPS.
         */

        fetch(
            "https://ipapi.co/json/"
        )

        .then(function (response) {

            return response.json();

        })

        .then(function (location) {

            sendAnalytics({

                country:
                    location.country_name ||
                    "",

                region:
                    location.region ||
                    "",

                city:
                    location.city ||
                    ""

            });

        })

        .catch(function () {

            /*
             * Even if location lookup fails,
             * record the visitor.
             */

            sendAnalytics({

                country: "",

                region: "",

                city: ""

            });

        });
    }


    /*
     * ============================================================
     * WAIT FOR PAGE
     * ============================================================
     */

    if (
        document.readyState ===
        "loading"
    ) {

        document.addEventListener(
            "DOMContentLoaded",
            start
        );

    } else {

        start();
    }

})();
