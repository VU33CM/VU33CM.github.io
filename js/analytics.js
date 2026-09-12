(function () {

    /* =========================================================
       HAM CORNER BY VU33CM
       COMMON SITE CONTROLLER + ANALYTICS + QSL MOBILE SUPPORT
       ========================================================= */

    const GOOGLE_SHEET_URL =
        "https://script.google.com/macros/s/AKfycbzgwg5xcncLGWMc5ggh7wF7RVChIe1QkvM2fH9O8tZPnQK4DDIMrEh5GBwiY5GDXwNN/exec";


    /* =========================================================
       COMMON STYLES
       ========================================================= */

    const style = document.createElement("style");

    style.textContent = `

    /* =========================================================
       TYPOGRAPHY UPGRADE
       ========================================================= */

    body {
        text-rendering: optimizeLegibility;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
    }

    /* Main homepage hero title */

    .hero h2 {
        font-size: clamp(42px, 5vw, 58px) !important;
        line-height: 1.05 !important;
        font-weight: 900 !important;
        letter-spacing: -1.5px !important;
        text-shadow: 0 8px 30px rgba(0,0,0,.28);
        margin-bottom: 20px !important;
        transition:
            transform .25s ease,
            color .25s ease;
    }

    .hero h2 span {
        color: #19dfff !important;
    }


    /* Main section headings */

    .section-heading h2,
    section > .container > h2 {
        font-size: clamp(31px, 3.5vw, 40px) !important;
        line-height: 1.12 !important;
        font-weight: 850 !important;
        letter-spacing: -.6px !important;
        position: relative;
        margin-bottom: 16px !important;
        transition:
            transform .25s ease,
            color .25s ease;
    }


    /* Small cyan underline under major headings */

    .section-heading h2::after {
        content: "";
        display: block;
        width: 58px;
        height: 3px;
        margin-top: 12px;
        border-radius: 99px;
        background: linear-gradient(
            90deg,
            #19dfff,
            #2388ff
        );
        box-shadow:
            0 0 12px rgba(25,223,255,.35);
    }


    /* Card headings */

    .card h3,
    .feature-content h3,
    .explorer-box h3 {
        font-size: clamp(20px, 2vw, 25px) !important;
        line-height: 1.2 !important;
        font-weight: 800 !important;
        letter-spacing: -.2px !important;
        transition:
            color .25s ease,
            transform .25s ease;
    }


    /* QSL / Quiz / CTA headings */

    .quiz-box h2,
    .final-cta h2,
    .qsl-content h2 {
        font-size: clamp(31px, 4vw, 44px) !important;
        line-height: 1.1 !important;
        font-weight: 900 !important;
        letter-spacing: -.7px !important;
        transition:
            transform .25s ease,
            color .25s ease;
    }


    /* QSL coloured heading */

    .qsl-content h2 span {
        color: #19dfff !important;
    }


    /* Card interaction */

    .card:hover h3 {
        color: #19dfff !important;
    }

    .card:hover {
        transform: translateY(-4px);
        transition: transform .25s ease;
    }


    /* Feature headings */

    .feature-content h3 {
        font-size: clamp(22px, 2.5vw, 28px) !important;
        font-weight: 850 !important;
    }


    /* Buttons */

    .btn {
        transition:
            transform .22s ease,
            box-shadow .22s ease,
            background .22s ease;
    }

    .btn:hover {
        transform: translateY(-2px);
    }


    /* =========================================================
       COMMON HEADER
       ========================================================= */

    .ham-common-header {
        position: sticky;
        top: 0;
        z-index: 99999;
        width: 100%;
        background: rgba(5,11,20,.96);
        backdrop-filter: blur(15px);
        -webkit-backdrop-filter: blur(15px);
        border-bottom: 1px solid #1b405c;
        box-shadow: 0 4px 20px rgba(0,0,0,.18);
    }

    .ham-common-navbar {
        width: min(1180px,92%);
        min-height: 78px;
        margin: auto;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 20px;
    }


    /* Logo */

    .ham-common-logo {
        display: flex;
        align-items: center;
        gap: 12px;
        text-decoration: none;
        color: #f3fbff;
        flex-shrink: 0;
    }

    .ham-common-logo-icon {
        width: 55px;
        height: 55px;
        border-radius: 50%;
        overflow: hidden;
        border: 2px solid #19dfff;
        box-shadow:
            0 0 20px rgba(25,223,255,.35);
        flex-shrink: 0;
        background: #050b14;
    }

    .ham-common-logo-icon img {
        width: 100%;
        height: 100%;
        object-fit: contain;
        display: block;
    }

    .ham-common-logo-text {
        display: flex;
        flex-direction: column;
    }

    .ham-common-logo-text strong {
        font-size: 20px;
        line-height: 1.1;
        font-weight: 900;
        letter-spacing: .4px;
    }

    .ham-common-logo-text span {
        color: #9bb1c5;
        font-size: 11px;
        line-height: 1.3;
        margin-top: 4px;
    }


    /* Desktop navigation */

    .ham-common-desktop-nav {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        gap: 5px;
        flex-wrap: wrap;
    }

    .ham-common-desktop-nav a {
        padding: 9px 11px;
        border-radius: 8px;
        color: #c5d8e7;
        font-size: 13px;
        font-weight: 600;
        text-decoration: none;
        white-space: nowrap;
        transition:
            background .22s ease,
            color .22s ease,
            transform .22s ease;
    }

    .ham-common-desktop-nav a:hover {
        background: #10283b;
        color: #19dfff;
        transform: translateY(-1px);
    }

    .ham-common-desktop-nav .ham-nav-quiz {
        background:
            linear-gradient(135deg,#19dfff,#2388ff);
        color: #00111c;
        font-weight: 900;
    }

    .ham-common-desktop-nav .ham-nav-qsl {
        background:
            linear-gradient(135deg,#0b6f9e,#00bde9);
        color: #ffffff;
        font-weight: 900;
    }


    /* =========================================================
       MOBILE NAVIGATION
       ========================================================= */

    .ham-mobile-nav {
        display: none;
        width: 100%;
        overflow-x: auto;
        overflow-y: hidden;
        border-top: 1px solid rgba(27,64,92,.55);
        background: rgba(3,9,17,.98);
        -webkit-overflow-scrolling: touch;
        scrollbar-width: none;
    }

    .ham-mobile-nav::-webkit-scrollbar {
        display: none;
    }

    .ham-mobile-nav-inner {
        display: flex;
        align-items: center;
        gap: 7px;
        width: max-content;
        min-width: 100%;
        padding: 9px 12px;
    }

    .ham-mobile-nav a {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        min-height: 38px;
        padding: 8px 13px;
        border-radius: 9px;
        border: 1px solid #1b405c;
        background: #071522;
        color: #c5d8e7;
        font-size: 13px;
        font-weight: 700;
        text-decoration: none;
        white-space: nowrap;
        transition:
            background .22s ease,
            color .22s ease,
            transform .22s ease;
    }

    .ham-mobile-nav a:active {
        transform: scale(.97);
    }

    .ham-mobile-nav a.ham-mobile-active {
        background:
            linear-gradient(135deg,#19dfff,#2388ff);
        color: #00111c;
        border-color: transparent;
        font-weight: 900;
    }

    .ham-mobile-nav a.ham-mobile-qsl {
        background:
            linear-gradient(135deg,#0b6f9e,#00bde9);
        color: white;
        border-color: transparent;
        font-weight: 900;
    }


    /* =========================================================
       COMMON FOOTER
       ========================================================= */

    .ham-common-footer {
        margin-top: 0;
        border-top: 1px solid #1b405c;
        background: #030911;
        padding: 38px 0 20px;
    }

    .ham-common-footer-inner {
        width: min(1180px,92%);
        margin: auto;
    }

    .ham-footer-main {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        gap: 30px;
        flex-wrap: wrap;
    }

    .ham-footer-brand strong {
        display: block;
        font-size: 17px;
        font-weight: 900;
        color: #f3fbff;
        margin-bottom: 6px;
    }

    .ham-footer-brand p {
        margin: 0;
        color: #9bb1c5;
        font-size: 13px;
    }

    .ham-footer-links {
        display: flex;
        flex-wrap: wrap;
        gap: 8px 18px;
    }

    .ham-footer-links a {
        color: #19dfff;
        font-size: 13px;
        font-weight: 700;
        text-decoration: none;
        transition: color .2s ease;
    }

    .ham-footer-links a:hover {
        color: #ffffff;
    }

    .ham-footer-bottom {
        margin-top: 25px;
        padding-top: 18px;
        border-top: 1px solid rgba(27,64,92,.55);
        color: #6f879b;
        font-size: 11px;
        text-align: center;
    }


    /* =========================================================
       IPHONE QSL SAVE PAGE
       ========================================================= */

    .ham-qsl-save-page {
        min-height: 100vh;
        background: #050b14;
        color: #f3fbff;
        padding: 35px 18px;
        font-family: Arial,Helvetica,sans-serif;
    }

    .ham-qsl-save-box {
        width: min(900px,100%);
        margin: auto;
        background: #0c1b2b;
        border: 1px solid #1b405c;
        border-radius: 18px;
        padding: 20px;
        box-shadow: 0 20px 60px rgba(0,0,0,.35);
        text-align: center;
    }

    .ham-qsl-save-title {
        font-size: 25px;
        font-weight: 900;
        margin-bottom: 8px;
    }

    .ham-qsl-save-subtitle {
        color: #9bb1c5;
        font-size: 14px;
        margin-bottom: 20px;
    }

    .ham-qsl-save-image {
        width: 100%;
        height: auto;
        display: block;
        border-radius: 12px;
        border: 1px solid #1b405c;
        margin: 0 auto 20px;
    }

    .ham-qsl-save-note {
        background: #071522;
        border: 1px solid #1b405c;
        border-radius: 12px;
        padding: 15px;
        color: #c5d8e7;
        font-size: 14px;
        line-height: 1.6;
    }


    /* =========================================================
       MOBILE TYPOGRAPHY
       ========================================================= */

    @media(max-width:900px) {

        .ham-common-desktop-nav {
            display: none;
        }

        .ham-mobile-nav {
            display: block;
        }

        .ham-common-navbar {
            min-height: 68px;
        }

        .ham-common-logo-icon {
            width: 48px;
            height: 48px;
        }

        .ham-common-logo-text strong {
            font-size: 18px;
        }

        .ham-common-logo-text span {
            font-size: 10px;
        }

        .hero h2 {
            font-size: 40px !important;
            letter-spacing: -1.2px !important;
        }

        .section-heading h2,
        section > .container > h2 {
            font-size: 32px !important;
        }

        .card h3,
        .feature-content h3,
        .explorer-box h3 {
            font-size: 22px !important;
        }

        .quiz-box h2,
        .final-cta h2,
        .qsl-content h2 {
            font-size: 34px !important;
        }

    }


    @media(max-width:600px) {

        .ham-common-navbar {
            width: 94%;
            min-height: 64px;
        }

        .ham-common-logo {
            gap: 9px;
        }

        .ham-common-logo-icon {
            width: 44px;
            height: 44px;
        }

        .ham-common-logo-text strong {
            font-size: 17px;
        }

        .ham-common-logo-text span {
            font-size: 9px;
        }

        .ham-mobile-nav-inner {
            padding: 8px 10px;
            gap: 6px;
        }

        .ham-mobile-nav a {
            min-height: 36px;
            padding: 7px 11px;
            font-size: 12px;
        }

        .hero h2 {
            font-size: 38px !important;
            line-height: 1.06 !important;
            letter-spacing: -1px !important;
        }

        .section-heading h2,
        section > .container > h2 {
            font-size: 30px !important;
            line-height: 1.12 !important;
        }

        .card h3,
        .feature-content h3,
        .explorer-box h3 {
            font-size: 21px !important;
        }

        .quiz-box h2,
        .final-cta h2,
        .qsl-content h2 {
            font-size: 31px !important;
        }

        .section-heading h2::after {
            width: 48px;
            margin-top: 10px;
        }

        .ham-common-footer {
            padding-top: 30px;
        }

        .ham-footer-main {
            gap: 20px;
        }

    }

    `;

    document.head.appendChild(style);


    /* =========================================================
       FAVICON
       ========================================================= */

    function addFavicon() {

        if (document.querySelector('link[data-ham-favicon]')) {
            return;
        }

        const favicon = document.createElement("link");

        favicon.rel = "icon";
        favicon.type = "image/png";
        favicon.href = "logo.png";
        favicon.setAttribute("data-ham-favicon", "true");

        document.head.appendChild(favicon);
    }


    /* =========================================================
       COMMON HEADER
       ========================================================= */

    function createHeader() {

        const existingHeader =
            document.querySelector("header");

        if (existingHeader) {
            existingHeader.remove();
        }

        const header =
            document.createElement("header");

        header.className =
            "ham-common-header";

        header.innerHTML = `

            <div class="ham-common-navbar">

                <a href="index.html"
                   class="ham-common-logo">

                    <div class="ham-common-logo-icon">

                        <img
                            src="logo.png"
                            alt="HAM Corner VU33CM Logo">

                    </div>

                    <div class="ham-common-logo-text">

                        <strong>
                            HAM Corner
                        </strong>

                        <span>
                            by VU33CM • Indian Amateur Radio
                        </span>

                    </div>

                </a>


                <nav class="ham-common-desktop-nav">

                    <a href="index.html">
                        Home
                    </a>

                    <a href="study.html">
                        Study
                    </a>

                    <a href="activities.html">
                        Activities
                    </a>

                    <a href="repeaters.html">
                        Repeaters
                    </a>

                    <a href="nets.html">
                        Nets
                    </a>

                    <a href="clubs.html">
                        Clubs
                    </a>

                    <a href="resources.html">
                        Resources
                    </a>

                    <a href="quiz.html"
                       class="ham-nav-quiz">
                        🎓 ASOC Quiz
                    </a>

                    <a href="qsl.html"
                       class="ham-nav-qsl">
                        📻 QSL Card
                    </a>

                </nav>

            </div>


            <div class="ham-mobile-nav">

                <div class="ham-mobile-nav-inner">

                    <a href="index.html">
                        🏠 Home
                    </a>

                    <a href="study.html">
                        📚 Study
                    </a>

                    <a href="activities.html">
                        📡 Activities
                    </a>

                    <a href="repeaters.html">
                        📻 Repeaters
                    </a>

                    <a href="nets.html">
                        🎙️ Nets
                    </a>

                    <a href="clubs.html">
                        👥 Clubs
                    </a>

                    <a href="resources.html">
                        🔗 Resources
                    </a>

                    <a href="quiz.html">
                        🎓 Quiz
                    </a>

                    <a href="qsl.html"
                       class="ham-mobile-qsl">
                        📻 QSL Card
                    </a>

                </div>

            </div>

        `;

        document.body.insertBefore(
            header,
            document.body.firstChild
        );


        /* Highlight current page */

        const currentPage =
            window.location.pathname
                .split("/")
                .pop() || "index.html";

        document
            .querySelectorAll(
                ".ham-common-desktop-nav a, .ham-mobile-nav a"
            )
            .forEach(function (link) {

                const href =
                    link.getAttribute("href");

                if (href === currentPage) {

                    link.classList.add(
                        "ham-mobile-active"
                    );

                }

            });

    }


    /* =========================================================
       COMMON FOOTER
       ========================================================= */

    function createFooter() {

        const existingFooter =
            document.querySelector("footer");

        if (existingFooter) {
            existingFooter.remove();
        }

        const footer =
            document.createElement("footer");

        footer.className =
            "ham-common-footer";

        footer.innerHTML = `

            <div class="ham-common-footer-inner">

                <div class="ham-footer-main">

                    <div class="ham-footer-brand">

                        <strong>
                            HAM Corner by VU33CM
                        </strong>

                        <p>
                            Indian Amateur Radio •
                            Learn • Communicate • Experiment
                        </p>

                    </div>


                    <div class="ham-footer-links">

                        <a href="index.html">
                            Home
                        </a>

                        <a href="about.html">
                            About
                        </a>

                        <a href="study.html">
                            Study
                        </a>

                        <a href="activities.html">
                            Activities
                        </a>

                        <a href="repeaters.html">
                            Repeaters
                        </a>

                        <a href="nets.html">
                            Nets
                        </a>

                        <a href="clubs.html">
                            Clubs
                        </a>

                        <a href="resources.html">
                            Resources
                        </a>

                        <a href="quiz.html">
                            ASOC Quiz
                        </a>

                        <a href="qsl.html">
                            QSL Card
                        </a>

                    </div>

                </div>


                <div class="ham-footer-bottom">

                    © ${new Date().getFullYear()}
                    HAM Corner by VU33CM •
                    Indian Amateur Radio

                </div>

            </div>

        `;

        document.body.appendChild(footer);

    }


    /* =========================================================
       ANALYTICS
       ========================================================= */

    function getDevice() {

        const width =
            window.innerWidth;

        if (width <= 600) {
            return "Mobile";
        }

        if (width <= 1024) {
            return "Tablet";
        }

        return "Desktop";

    }


    function getOS() {

        const ua =
            navigator.userAgent;

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

        const ua =
            navigator.userAgent;

        if (/Edg\//i.test(ua)) {
            return "Microsoft Edge";
        }

        if (/OPR\//i.test(ua)) {
            return "Opera";
        }

        if (/Chrome\//i.test(ua) &&
            !/Edg\//i.test(ua)) {

            return "Google Chrome";
        }

        if (/Firefox\//i.test(ua)) {
            return "Mozilla Firefox";
        }

        if (/Safari\//i.test(ua) &&
            !/Chrome\//i.test(ua)) {

            return "Safari";
        }

        return "Unknown";

    }


    function sendAnalytics(locationData) {

        const data = {

            type: "user",

            page:
                window.location.pathname ||
                "home",

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
                Intl.DateTimeFormat()
                    .resolvedOptions()
                    .timeZone || "",

            referrer:
                document.referrer || ""

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
        )
        .catch(function () {
            /* Analytics must never affect the website. */
        });

    }


    function startAnalytics() {

        fetch(
            "https://ipapi.co/json/"
        )

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

            sendAnalytics({

                country: "",
                region: "",
                city: ""

            });

        });

    }


    /* =========================================================
       QSL DATA COLLECTION
       ========================================================= */

    function getFieldValue(names) {

        for (
            let i = 0;
            i < names.length;
            i++
        ) {

            const selector =
                "#" + names[i] +
                ", [name='" + names[i] + "']";

            const element =
                document.querySelector(selector);

            if (element) {

                return element.value || "";

            }

        }

        return "";

    }


    function collectQSLData() {

        return {

            type: "qsl",

            callsign:
                getFieldValue([
                    "callsign",
                    "yourCallsign",
                    "callSign"
                ]),

            toRadio:
                getFieldValue([
                    "toRadio",
                    "toradio",
                    "otherStation"
                ]),

            date:
                getFieldValue([
                    "date",
                    "qslDate"
                ]),

            time:
                getFieldValue([
                    "time",
                    "qslTime"
                ]),

            band:
                getFieldValue([
                    "band"
                ]),

            frequency:
                getFieldValue([
                    "frequency",
                    "freq"
                ]),

            mode:
                getFieldValue([
                    "mode"
                ]),

            rstSent:
                getFieldValue([
                    "rstSent",
                    "sent"
                ]),

            rstReceived:
                getFieldValue([
                    "rstReceived",
                    "received"
                ]),

            power:
                getFieldValue([
                    "power"
                ]),

            antenna:
                getFieldValue([
                    "antenna"
                ]),

            propagation:
                getFieldValue([
                    "propagation"
                ]),

            qslVia:
                getFieldValue([
                    "qslVia"
                ]),

            remarks:
                getFieldValue([
                    "remarks"
                ])

        };

    }


    function saveQSLData() {

        const data =
            collectQSLData();

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
        )
        .catch(function () {
            /* Keep the QSL generator working even if Sheets fails. */
        });

    }


    /* =========================================================
       IPHONE QSL DOWNLOAD SUPPORT
       ========================================================= */

    function isIOS() {

        return /iPhone|iPad|iPod/i
            .test(navigator.userAgent);

    }


    function findQSLDownloadButton() {

        const elements =
            document.querySelectorAll(
                "button, a, input[type='button'], input[type='submit']"
            );

        for (
            let i = 0;
            i < elements.length;
            i++
        ) {

            const text =
                (
                    elements[i].innerText ||
                    elements[i].value ||
                    ""
                )
                .trim()
                .toLowerCase();

            if (
                text.includes("download jpg") ||
                text.includes("download")
            ) {

                return elements[i];

            }

        }

        return null;

    }


    function findQSLCanvas() {

        const canvases =
            document.querySelectorAll("canvas");

        if (!canvases.length) {
            return null;
        }

        /* Prefer a large canvas */

        let largest =
            canvases[0];

        for (
            let i = 1;
            i < canvases.length;
            i++
        ) {

            if (
                canvases[i].width >
                largest.width
            ) {

                largest =
                    canvases[i];

            }

        }

        return largest;

    }


    function showIOSQSLImage(canvas) {

        canvas.toBlob(
            function (blob) {

                if (!blob) {

                    alert(
                        "Unable to create the JPG. Please try again."
                    );

                    return;

                }


                const imageURL =
                    URL.createObjectURL(blob);


                const newWindow =
                    window.open("", "_blank");


                if (!newWindow) {

                    /* Popup blocked */

                    window.location.href =
                        imageURL;

                    return;

                }


                newWindow.document.open();

                newWindow.document.write(`

                    <!DOCTYPE html>

                    <html>

                    <head>

                        <meta
                            name="viewport"
                            content="width=device-width,
                                     initial-scale=1.0">

                        <title>
                            HAM Corner QSL Card
                        </title>

                        <style>

                            * {
                                box-sizing: border-box;
                            }

                            body {
                                margin: 0;
                                padding: 20px;
                                background: #050b14;
                                color: #f3fbff;
                                font-family:
                                    Arial,
                                    Helvetica,
                                    sans-serif;
                                text-align: center;
                            }

                            h2 {
                                font-size: 24px;
                                margin: 5px 0 8px;
                            }

                            p {
                                color: #9bb1c5;
                                font-size: 14px;
                                line-height: 1.5;
                                margin:
                                    0 auto 18px;
                                max-width: 600px;
                            }

                            img {
                                display: block;
                                width: 100%;
                                max-width: 1000px;
                                height: auto;
                                margin: 0 auto;
                                border-radius: 10px;
                                border: 1px solid #1b405c;
                            }

                        </style>

                    </head>

                    <body>

                        <h2>
                            📻 Your QSL Card
                        </h2>

                        <p>
                            On iPhone or iPad,
                            press and hold the image,
                            then choose
                            <strong>
                                Save to Photos
                            </strong>
                            or
                            <strong>
                                Save to Files
                            </strong>.
                        </p>

                        <img
                            src="${imageURL}"
                            alt="HAM Corner QSL Card">

                    </body>

                    </html>

                `);

                newWindow.document.close();


                /* Release later */

                setTimeout(
                    function () {

                        URL.revokeObjectURL(
                            imageURL
                        );

                    },
                    60000
                );

            },
            "image/jpeg",
            0.95
        );

    }


    function setupIOSQSLDownload() {

        if (!isIOS()) {
            return;
        }

        const button =
            findQSLDownloadButton();

        const canvas =
            findQSLCanvas();

        if (!button || !canvas) {
            return;
        }


        /* Prevent duplicate installation */

        if (
            button.dataset.hamIOSDownload ===
            "true"
        ) {

            return;

        }


        const replacement =
            button.cloneNode(true);

        button.parentNode.replaceChild(
            replacement,
            button
        );


        replacement.dataset.hamIOSDownload =
            "true";


        replacement.addEventListener(
            "click",
            function (event) {

                event.preventDefault();
                event.stopPropagation();

                /* Save QSL information */

                saveQSLData();

                /* Give the canvas a moment to update */

                setTimeout(
                    function () {

                        showIOSQSLImage(
                            canvas
                        );

                    },
                    100
                );

            },
            true
        );

    }


    /* =========================================================
       INITIALIZE
       ========================================================= */

    function initialize() {

        addFavicon();

        createHeader();

        createFooter();

        startAnalytics();


        /*
         * QSL page can create its canvas after page load,
         * so check more than once.
         */

        if (isIOS()) {

            setTimeout(
                setupIOSQSLDownload,
                500
            );

            setTimeout(
                setupIOSQSLDownload,
                1500
            );

            setTimeout(
                setupIOSQSLDownload,
                3000
            );

        }

    }


    if (
        document.readyState ===
        "loading"
    ) {

        document.addEventListener(
            "DOMContentLoaded",
            initialize
        );

    } else {

        initialize();

    }


})();
