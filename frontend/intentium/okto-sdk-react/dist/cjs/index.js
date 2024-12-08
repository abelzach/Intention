'use strict';

var React = require('react');
var axios = require('axios');

/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise, SuppressedError, Symbol */


function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
    var e = new Error(message);
    return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
};

exports.BuildType = void 0;
(function (BuildType) {
    BuildType["STAGING"] = "STAGING";
    BuildType["SANDBOX"] = "SANDBOX";
    BuildType["PRODUCTION"] = "PRODUCTION";
})(exports.BuildType || (exports.BuildType = {}));
exports.ModalType = void 0;
(function (ModalType) {
    ModalType["WIDGET"] = "WIDGET";
    ModalType["ONBOARDING"] = "ONBOARDING";
})(exports.ModalType || (exports.ModalType = {}));
exports.OrderStatus = void 0;
(function (OrderStatus) {
    OrderStatus["SUCCESS"] = "SUCCESS";
    OrderStatus["FAILED"] = "FAILED";
    OrderStatus["PENDING"] = "PENDING";
})(exports.OrderStatus || (exports.OrderStatus = {}));
exports.AuthType = void 0;
(function (AuthType) {
    AuthType["PHONE"] = "Phone";
    AuthType["EMAIL"] = "Email";
    AuthType["GAUTH"] = "GAuth";
})(exports.AuthType || (exports.AuthType = {}));

function getQueryString(query) {
    const queryParams = [];
    for (const [key, value] of Object.entries(query)) {
        if (value !== undefined) {
            queryParams.push(`${key}=${value}`);
        }
    }
    const queryString = queryParams.join("&");
    return queryString;
}

const baseUrls = {
    [exports.BuildType.PRODUCTION]: "https://apigw.okto.tech",
    [exports.BuildType.STAGING]: "https://3p-bff.oktostage.com",
    [exports.BuildType.SANDBOX]: "https://sandbox-api.okto.tech",
};
const onBoardingUrls = {
    [exports.BuildType.PRODUCTION]: "https://3p.okto.tech/login_screen/#/login_screen",
    [exports.BuildType.STAGING]: "https://3p.oktostage.com/#/login_screen",
    [exports.BuildType.SANDBOX]: "https://okto-sandbox.firebaseapp.com/#/login_screen",
};
const oktoLogo = "https://okto-sandbox.firebaseapp.com/assets/assets/png_assets/Okto.png";
const widgetUrl = "https://3p.okto.tech";
const AUTH_DETAILS_KEY = "AUTH_DETAILS";
const defaultTheme = {
    textPrimaryColor: "0xFFFFFFFF",
    textSecondaryColor: "0xFFFFFFFF",
    textTertiaryColor: "0xFFFFFFFF",
    accent1Color: "0x80433454",
    accent2Color: "0x80905BF5",
    strokeBorderColor: "0xFFACACAB",
    strokeDividerColor: "0x4DA8A8A8",
    surfaceColor: "0xFF1F0A2F",
    backgroundColor: "0xFF000000",
};
const defaultBrandData = {
    title: "",
    subtitle: "",
    iconUrl: "",
};
const JOB_RETRY_INTERVAL = 5000; //5s
const JOB_MAX_RETRY = 12; //retry for 60s (12 * 5 = 60)

const storeJSONLocalStorage = (key, value) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    }
    catch (e) {
        console.error("Error storing JSON data in local storage", e);
    }
});
const getJSONLocalStorage = (key) => __awaiter(void 0, void 0, void 0, function* () {
    if (typeof window === "undefined") {
        return null;
    }
    try {
        const jsonValue = localStorage.getItem(key);
        if (jsonValue !== null && jsonValue !== "undefined") {
            const value = JSON.parse(jsonValue);
            return value;
        }
        return null;
    }
    catch (e) {
        console.error("Error getting JSON data from local storage", e);
    }
    return null;
});

function styleInject(css, ref) {
  if ( ref === void 0 ) ref = {};
  var insertAt = ref.insertAt;

  if (!css || typeof document === 'undefined') { return; }

  var head = document.head || document.getElementsByTagName('head')[0];
  var style = document.createElement('style');
  style.type = 'text/css';

  if (insertAt === 'top') {
    if (head.firstChild) {
      head.insertBefore(style, head.firstChild);
    } else {
      head.appendChild(style);
    }
  } else {
    head.appendChild(style);
  }

  if (style.styleSheet) {
    style.styleSheet.cssText = css;
  } else {
    style.appendChild(document.createTextNode(css));
  }
}

var css_248z$1 = ".WidgetIframe-module_container__XpJd6{height:32rem;width:20rem}.WidgetIframe-module_iframe__pHk97{background-color:#000;border-radius:24px;height:100%;width:100%}.WidgetIframe-module_hidden__dpiV5{display:none}.WidgetIframe-module_block__VTCNM{display:block}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIldpZGdldElmcmFtZS5tb2R1bGUuY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLHNDQUVFLFlBQWEsQ0FEYixXQUVGLENBRUEsbUNBSUUscUJBQXVCLENBRHZCLGtCQUFtQixDQURuQixXQUFZLENBRFosVUFJRixDQUVBLG1DQUNFLFlBQ0YsQ0FFQSxrQ0FDRSxhQUNGIiwiZmlsZSI6IldpZGdldElmcmFtZS5tb2R1bGUuY3NzIiwic291cmNlc0NvbnRlbnQiOlsiLmNvbnRhaW5lciB7XG4gIHdpZHRoOiAyMHJlbTtcbiAgaGVpZ2h0OiAzMnJlbTtcbn1cblxuLmlmcmFtZSB7XG4gIHdpZHRoOiAxMDAlO1xuICBoZWlnaHQ6IDEwMCU7XG4gIGJvcmRlci1yYWRpdXM6IDI0cHg7XG4gIGJhY2tncm91bmQtY29sb3I6IGJsYWNrO1xufVxuXG4uaGlkZGVuIHtcbiAgZGlzcGxheTogbm9uZTtcbn1cblxuLmJsb2NrIHtcbiAgZGlzcGxheTogYmxvY2s7XG59XG5cbiJdfQ== */";
var styles$1 = {"container":"WidgetIframe-module_container__XpJd6","iframe":"WidgetIframe-module_iframe__pHk97","hidden":"WidgetIframe-module_hidden__dpiV5","block":"WidgetIframe-module_block__VTCNM"};
styleInject(css_248z$1);

function getInjectedData$1(modalData) {
    return {
        textPrimaryColor: modalData.theme.textPrimaryColor,
        textSecondaryColor: modalData.theme.textSecondaryColor,
        textTertiaryColor: modalData.theme.textTertiaryColor,
        accent1Color: modalData.theme.accent1Color,
        accent2Color: modalData.theme.accent2Color,
        strokeBorderColor: modalData.theme.strokeBorderColor,
        strokeDividerColor: modalData.theme.strokeDividerColor,
        surfaceColor: modalData.theme.surfaceColor,
        backgroundColor: modalData.theme.backgroundColor,
        ENVIRONMENT: modalData.environment,
        authToken: modalData.authToken,
    };
}
const WidgetIframe = ({ modalData, onClose, }) => {
    const iframeRef = React.useRef(null);
    React.useEffect(() => {
        const iframe = iframeRef.current;
        if (!iframe) {
            return;
        }
        iframe.onload = function () {
            onLoad();
        };
        function onLoad() {
            if (iframe && iframe.contentWindow && modalData) {
                const message = {
                    type: "FROM_PARENT",
                    data: getInjectedData$1(modalData),
                };
                iframe.contentWindow.postMessage(message, widgetUrl);
            }
        }
    }, []);
    React.useEffect(() => {
        const handleMessage = (event) => {
            if (event.origin === widgetUrl) {
                const message = event.data;
                if (message.type === "FROM_IFRAME") {
                    if (message.data === "CLOSE") {
                        onClose();
                    }
                }
            }
        };
        window.addEventListener("message", handleMessage);
        return () => {
            window.removeEventListener("message", handleMessage);
        };
    }, []);
    return (React.createElement("div", { className: styles$1.container },
        React.createElement("iframe", { ref: iframeRef, src: widgetUrl, className: styles$1.iframe, loading: "eager" })));
};

var css_248z = ".OnboardingIframe-module_hidden__gdo8e{visibility:hidden}.OnboardingIframe-module_modalOverlay__nxkfi{backdrop-filter:blur(4px);background-color:rgba(0,0,0,.5);z-index:50}.OnboardingIframe-module_modalContainer__p4jBX,.OnboardingIframe-module_modalOverlay__nxkfi{align-items:center;display:flex;inset:0;justify-content:center;position:fixed}.OnboardingIframe-module_modalContent__xz7G3{background:#292929;border-radius:24px;box-shadow:0 10px 15px -3px rgba(0,0,0,.1),0 4px 6px -2px rgba(0,0,0,.05);padding:.5rem}.OnboardingIframe-module_modalHeader__PtX1t{display:flex;justify-content:space-between;padding:.5rem .625rem}.OnboardingIframe-module_logoContainer__kxQ0E{align-items:center;display:flex;gap:.375rem}.OnboardingIframe-module_headerText__Upoyw{color:#a0a0a0;font-size:.875rem;font-weight:600}.OnboardingIframe-module_iconContainer__c-bca{align-items:center;display:flex;gap:.625rem;justify-content:flex-end;transform:scale(.8)}.OnboardingIframe-module_closeButton__p38jk{background-color:#000;border-radius:50%;padding:.125rem;transition:transform .3s}.OnboardingIframe-module_closeButton__p38jk:hover{transform:rotate(1turn)}.OnboardingIframe-module_iframe__K8QXo{align-items:center;border-radius:24px;display:flex;font-size:2rem;font-weight:700;height:32rem;justify-content:center;width:22rem}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIk9uYm9hcmRpbmdJZnJhbWUubW9kdWxlLmNzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSx1Q0FDRSxpQkFDRixDQUVBLDZDQVFFLHlCQUEwQixDQUQxQiwrQkFBb0MsQ0FKcEMsVUFNRixDQUVBLDRGQUxFLGtCQUFtQixDQUZuQixZQUFhLENBRmIsT0FBUSxDQUdSLHNCQUF1QixDQUp2QixjQWdCRixDQUVBLDZDQUNFLGtCQUFtQixDQUVuQixrQkFBbUIsQ0FDbkIseUVBQXVGLENBRnZGLGFBR0YsQ0FFQSw0Q0FDRSxZQUFhLENBQ2IsNkJBQThCLENBQzlCLHFCQUNGLENBRUEsOENBRUUsa0JBQW1CLENBRG5CLFlBQWEsQ0FFYixXQUNGLENBRUEsMkNBR0UsYUFBYyxDQURkLGlCQUFtQixDQURuQixlQUdGLENBRUEsOENBS0Usa0JBQW1CLENBSm5CLFlBQWEsQ0FFYixXQUFhLENBQ2Isd0JBQXlCLENBRnpCLG1CQUlGLENBRUEsNENBR0UscUJBQXVCLENBQ3ZCLGlCQUFrQixDQUhsQixlQUFpQixDQUNqQix3QkFHRixDQUVBLGtEQUNFLHVCQUNGLENBRUEsdUNBT0Usa0JBQW1CLENBRm5CLGtCQUFtQixDQUNuQixZQUFhLENBTGIsY0FBZSxDQUNmLGVBQWlCLENBRWpCLFlBQWEsQ0FJYixzQkFBdUIsQ0FMdkIsV0FNRiIsImZpbGUiOiJPbmJvYXJkaW5nSWZyYW1lLm1vZHVsZS5jc3MiLCJzb3VyY2VzQ29udGVudCI6WyIuaGlkZGVuIHtcbiAgdmlzaWJpbGl0eTogaGlkZGVuO1xufVxuXG4ubW9kYWxPdmVybGF5IHtcbiAgcG9zaXRpb246IGZpeGVkO1xuICBpbnNldDogMDtcbiAgei1pbmRleDogNTA7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIGp1c3RpZnktY29udGVudDogY2VudGVyO1xuICBhbGlnbi1pdGVtczogY2VudGVyO1xuICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2JhKDAsIDAsIDAsIDAuNSk7XG4gIGJhY2tkcm9wLWZpbHRlcjogYmx1cig0cHgpO1xufVxuXG4ubW9kYWxDb250YWluZXIge1xuICBwb3NpdGlvbjogZml4ZWQ7XG4gIGluc2V0OiAwO1xuICBkaXNwbGF5OiBmbGV4O1xuICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbn1cblxuLm1vZGFsQ29udGVudCB7XG4gIGJhY2tncm91bmQ6ICMyOTI5Mjk7XG4gIHBhZGRpbmc6IDAuNXJlbTtcbiAgYm9yZGVyLXJhZGl1czogMjRweDtcbiAgYm94LXNoYWRvdzogMHB4IDEwcHggMTVweCAtM3B4IHJnYmEoMCwgMCwgMCwgMC4xKSwgMHB4IDRweCA2cHggLTJweCByZ2JhKDAsIDAsIDAsIDAuMDUpO1xufVxuXG4ubW9kYWxIZWFkZXIge1xuICBkaXNwbGF5OiBmbGV4O1xuICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWJldHdlZW47XG4gIHBhZGRpbmc6IDAuNXJlbSAwLjYyNXJlbTtcbn1cblxuLmxvZ29Db250YWluZXIge1xuICBkaXNwbGF5OiBmbGV4O1xuICBhbGlnbi1pdGVtczogY2VudGVyO1xuICBnYXA6IDAuMzc1cmVtO1xufVxuXG4uaGVhZGVyVGV4dCB7XG4gIGZvbnQtd2VpZ2h0OiA2MDA7XG4gIGZvbnQtc2l6ZTogMC44NzVyZW07XG4gIGNvbG9yOiAjQTBBMEEwO1xufVxuXG4uaWNvbkNvbnRhaW5lciB7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIHRyYW5zZm9ybTogc2NhbGUoMC44KTtcbiAgZ2FwOiAwLjYyNXJlbTtcbiAganVzdGlmeS1jb250ZW50OiBmbGV4LWVuZDtcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbn1cblxuLmNsb3NlQnV0dG9uIHtcbiAgcGFkZGluZzogMC4xMjVyZW07XG4gIHRyYW5zaXRpb246IHRyYW5zZm9ybSAwLjNzO1xuICBiYWNrZ3JvdW5kLWNvbG9yOiBibGFjaztcbiAgYm9yZGVyLXJhZGl1czogNTAlO1xufVxuXG4uY2xvc2VCdXR0b246aG92ZXIge1xuICB0cmFuc2Zvcm06IHJvdGF0ZSgzNjBkZWcpO1xufVxuXG4uaWZyYW1lIHtcbiAgZm9udC1zaXplOiAycmVtO1xuICBmb250LXdlaWdodDogYm9sZDtcbiAgd2lkdGg6IDIycmVtO1xuICBoZWlnaHQ6IDMycmVtO1xuICBib3JkZXItcmFkaXVzOiAyNHB4O1xuICBkaXNwbGF5OiBmbGV4O1xuICBhbGlnbi1pdGVtczogY2VudGVyO1xuICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcbn1cbiJdfQ== */";
var styles = {"hidden":"OnboardingIframe-module_hidden__gdo8e","modalOverlay":"OnboardingIframe-module_modalOverlay__nxkfi","modalContainer":"OnboardingIframe-module_modalContainer__p4jBX","modalContent":"OnboardingIframe-module_modalContent__xz7G3","modalHeader":"OnboardingIframe-module_modalHeader__PtX1t","logoContainer":"OnboardingIframe-module_logoContainer__kxQ0E","headerText":"OnboardingIframe-module_headerText__Upoyw","iconContainer":"OnboardingIframe-module_iconContainer__c-bca","closeButton":"OnboardingIframe-module_closeButton__p38jk","iframe":"OnboardingIframe-module_iframe__K8QXo"};
styleInject(css_248z);

// eslint-disable-next-line no-empty-pattern
const _OktoModal = ({}, ref) => {
    const [currentScreen, setCurrentScreen] = React.useState(null);
    const [modalData, setModalData] = React.useState(null);
    const openModal = (screen, widgetModalData = null) => {
        setCurrentScreen(screen);
        if (widgetModalData) {
            setModalData(widgetModalData);
        }
    };
    const closeModal = () => {
        setCurrentScreen(null);
    };
    React.useImperativeHandle(ref, () => ({
        openModal,
        closeModal,
    }));
    function handleClose() {
        closeModal();
    }
    return (React.createElement("div", { className: `${styles.modalOverlay} ${currentScreen ? "" : styles.hidden}`, onClick: handleClose },
        React.createElement("div", { className: styles.modalContainer },
            React.createElement("div", { className: styles.modalContent },
                React.createElement("div", { className: styles.container }, currentScreen === exports.ModalType.WIDGET && (React.createElement(WidgetIframe, { modalData: modalData, onClose: handleClose })))))));
};
const OktoModal = React.forwardRef(_OktoModal);

const CrossIcon = ({ color = "#161616" }) => {
    return (React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", width: "25", height: "24", viewBox: "0 0 25 24", fill: "none" },
        React.createElement("rect", { x: "0.5", width: "24", height: "24", rx: "12" }),
        React.createElement("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M17.6152 8.29893C18.0058 7.90841 18.0058 7.27525 17.6152 6.88472C17.2247 6.4942 16.5915 6.4942 16.201 6.88472L12.5 10.5858L8.7989 6.88472C8.40838 6.4942 7.77521 6.4942 7.38469 6.88472C6.99417 7.27524 6.99417 7.90841 7.38469 8.29893L11.0857 12L7.38469 15.701C6.99417 16.0916 6.99417 16.7247 7.38469 17.1153C7.77521 17.5058 8.40838 17.5058 8.7989 17.1153L12.5 13.4142L16.201 17.1153C16.5915 17.5058 17.2247 17.5058 17.6152 17.1153C18.0058 16.7247 18.0058 16.0916 17.6152 15.701L13.9142 12L17.6152 8.29893Z", fill: color })));
};

function getInjectedData(buildType, apiKey, brandData, primaryAuth, theme) {
    return {
        textPrimaryColor: theme.textPrimaryColor,
        textSecondaryColor: theme.textSecondaryColor,
        textTertiaryColor: theme.textTertiaryColor,
        accent1Color: theme.accent1Color,
        accent2Color: theme.accent2Color,
        strokeBorderColor: theme.strokeBorderColor,
        strokeDividerColor: theme.strokeDividerColor,
        surfaceColor: theme.surfaceColor,
        backgroundColor: theme.backgroundColor,
        ENVIRONMENT: buildType.toString(),
        API_KEY: apiKey,
        primaryAuthType: primaryAuth.toString(),
        brandTitle: brandData.title,
        brandSubtitle: brandData.subtitle,
        brandIconUrl: brandData.iconUrl,
    };
}
const OnboardingIframe = ({ visible, onClose, updateAuthCb, gAuthCb, buildType, apiKey, brandData, primaryAuth, theme, }) => {
    const iframeRef = React.useRef(null);
    const [refreshNonce, setRefreshNonce] = React.useState(0);
    const widgetUrl = onBoardingUrls[buildType];
    const refreshIframe = () => {
        setRefreshNonce(refreshNonce + 1);
    };
    const handleClose = () => {
        onClose();
        refreshIframe();
    };
    const handleMessage = (event) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b, _c, _d;
        try {
            const message = JSON.parse(event.data);
            if (message.type === "go_back") {
                handleClose();
            }
            else if (message.type === "g_auth") {
                //handle google auth
                const idToken = yield gAuthCb();
                (_b = (_a = iframeRef.current) === null || _a === void 0 ? void 0 : _a.contentWindow) === null || _b === void 0 ? void 0 : _b.postMessage(JSON.stringify({ type: "g_auth", data: idToken }), widgetUrl);
            }
            else if (message.type === "copy_text") {
                //handle copy text
                const clipboardText = yield navigator.clipboard.readText();
                const trimmedText = clipboardText.trim();
                (_d = (_c = iframeRef.current) === null || _c === void 0 ? void 0 : _c.contentWindow) === null || _d === void 0 ? void 0 : _d.postMessage(JSON.stringify({ type: "copy_text", data: trimmedText }), widgetUrl);
            }
            else if (message.type === "auth_success") {
                //handle auth success
                const authData = message.data;
                const authDetails = {
                    authToken: authData.auth_token,
                    refreshToken: authData.refresh_auth_token,
                    deviceToken: authData.device_token,
                };
                updateAuthCb(authDetails);
                handleClose();
            }
        }
        catch (error) {
            console.error("Error parsing okto widget data", error);
        }
    });
    React.useEffect(() => {
        const iframe = iframeRef.current;
        if (!iframe) {
            return;
        }
        iframe.onload = function () {
            onLoad();
        };
        function onLoad() {
            if (iframe && iframe.contentWindow) {
                const message = {
                    type: "FROM_PARENT",
                    data: getInjectedData(buildType, apiKey, brandData, primaryAuth, theme),
                };
                iframe.contentWindow.postMessage(message, widgetUrl);
            }
        }
        window.addEventListener("message", handleMessage);
        return () => {
            window.removeEventListener("message", handleMessage);
        };
    }, [buildType, apiKey, brandData, primaryAuth, theme]);
    const iframeKey = React.useMemo(() => btoa(encodeURIComponent(JSON.stringify({
        buildType,
        apiKey,
        brandData,
        primaryAuth,
        theme,
        refreshNonce,
    }))), [buildType, apiKey, brandData, primaryAuth, theme, refreshNonce]);
    return (React.createElement("div", { className: `${styles.modalOverlay} ${visible ? "" : styles.hidden}`, onClick: handleClose },
        React.createElement("div", { className: styles.modalContainer },
            React.createElement("div", { className: styles.modalContent },
                React.createElement("div", { className: styles.container },
                    React.createElement("div", { className: styles.modalHeader },
                        React.createElement("div", { className: styles.logoContainer },
                            React.createElement("img", { src: oktoLogo, height: 24, width: 24, alt: "logo" }),
                            React.createElement("div", { className: styles.headerText }, "Okto Wallet")),
                        React.createElement("div", { className: styles.iconContainer },
                            React.createElement("button", { className: styles.closeButton },
                                React.createElement(CrossIcon, { color: "#FFFFFF" })))),
                    React.createElement("iframe", { key: iframeKey, ref: iframeRef, src: widgetUrl, className: styles.iframe, loading: "eager" }))))));
};

// eslint-disable-next-line no-empty-pattern
const _OnboardingModal = ({ updateAuthCb, gAuthCb, buildType, apiKey, brandData, primaryAuth, theme, }, ref) => {
    const [visible, setVisible] = React.useState(false);
    const openModal = () => {
        setVisible(true);
    };
    const closeModal = () => {
        setVisible(false);
    };
    React.useImperativeHandle(ref, () => ({
        openModal,
        closeModal,
    }));
    function handleClose() {
        closeModal();
    }
    return (React.createElement(OnboardingIframe, { visible: visible, onClose: handleClose, updateAuthCb: updateAuthCb, gAuthCb: gAuthCb, buildType: buildType, apiKey: apiKey, brandData: brandData, primaryAuth: primaryAuth, theme: theme }));
};
const OnboardingModal = React.forwardRef(_OnboardingModal);

const OktoContext = React.createContext(null);
const OktoProvider = ({ children, apiKey, buildType, gAuthCb, primaryAuth = exports.AuthType.EMAIL, brandData = defaultBrandData, }) => {
    const oktoModalRef = React.useRef(null);
    const onboardingModalRef = React.useRef(null);
    const baseUrl = React.useMemo(() => baseUrls[buildType], [buildType]);
    const [authDetails, setAuthDetails] = React.useState(null);
    const [theme, updateTheme] = React.useState(defaultTheme);
    const isLoggedIn = React.useMemo(() => authDetails !== null, [authDetails]);
    const axiosInstance = React.useMemo(() => {
        const axiosInstanceTmp = axios.create({
            baseURL: `${baseUrl}/api`,
            headers: {
                "Content-Type": "application/json",
                "x-api-key": apiKey,
            },
        });
        // Request Interceptor to add Auth tokens to every request
        axiosInstanceTmp.interceptors.request.use((config) => {
            if (authDetails === null || authDetails === void 0 ? void 0 : authDetails.authToken) {
                config.headers.Authorization = `Bearer ${authDetails.authToken}`;
            }
            return config;
        }, (error) => {
            return Promise.reject(error);
        });
        // Response interceptor to handle 401 errors
        axiosInstanceTmp.interceptors.response.use((response) => response, (error) => __awaiter(void 0, void 0, void 0, function* () {
            const originalRequest = error.config;
            if (error.response.status === 401) {
                try {
                    const newAuthDetails = yield refreshToken(); // Attempt to refresh token
                    if (newAuthDetails) {
                        // Update the Authorization header with the new access token
                        originalRequest.headers.Authorization = `Bearer ${newAuthDetails.authToken}`;
                        return axios(originalRequest);
                    }
                }
                catch (refreshError) {
                    // Handle refresh token errors
                    updateAuthDetails(null); // Clear auth details if refresh fails
                    return Promise.reject(refreshError);
                }
            }
            // Return the Promise rejection if refresh didn't work or error is not due to 401
            return Promise.reject(error);
        }));
        return axiosInstanceTmp;
    }, [apiKey, authDetails, baseUrl]);
    React.useEffect(() => {
        updateAuthDetailsFromStorage();
    }, []);
    function updateAuthDetailsFromStorage() {
        return __awaiter(this, void 0, void 0, function* () {
            const storedAuthDetails = yield getJSONLocalStorage(AUTH_DETAILS_KEY);
            setAuthDetails(storedAuthDetails);
        });
    }
    function updateAuthDetails(authDetailsNew) {
        return __awaiter(this, void 0, void 0, function* () {
            setAuthDetails(authDetailsNew);
            yield storeJSONLocalStorage(AUTH_DETAILS_KEY, authDetailsNew);
        });
    }
    function refreshToken() {
        return __awaiter(this, void 0, void 0, function* () {
            if (authDetails) {
                try {
                    const response = yield axios.post(`${baseUrl}/api/v1/refresh_token`, {}, {
                        headers: {
                            Accept: "application/json",
                            Authorization: `Bearer ${authDetails === null || authDetails === void 0 ? void 0 : authDetails.authToken}`,
                            "x-refresh-authorization": `Bearer ${authDetails.refreshToken}`,
                            "x-device-token": authDetails.deviceToken,
                            "x-api-key": apiKey,
                        },
                    });
                    const authDetailsNew = {
                        authToken: response.data.data.auth_token,
                        refreshToken: response.data.data.refresh_auth_token,
                        deviceToken: response.data.data.device_token,
                    };
                    updateAuthDetails(authDetailsNew);
                    console.log("Refresh token: ", "success");
                    return authDetailsNew;
                }
                catch (error) {
                    throw new Error("Failed to refresh token");
                }
            }
            return null;
        });
    }
    function authenticate(idToken, callback) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!axiosInstance) {
                return callback(null, new Error("SDK is not initialized"));
            }
            try {
                const response = yield axios.post(`${baseUrl}/api/v2/authenticate`, {
                    id_token: idToken,
                }, {
                    headers: {
                        Accept: "*/*",
                        "x-api-key": apiKey,
                        "Content-Type": "application/json",
                    },
                });
                if (response.status === 200 &&
                    response.data &&
                    response.data.status === "success") {
                    //check if token in data then open pincode flow
                    if (response.data.data.auth_token) {
                        const authDetailsNew = {
                            authToken: response.data.data.auth_token,
                            refreshToken: response.data.data.refresh_auth_token,
                            deviceToken: response.data.data.device_token,
                        };
                        updateAuthDetails(authDetailsNew);
                    }
                    callback(response.data.data, null);
                }
                else {
                    callback(null, new Error("Server responded with an error"));
                }
            }
            catch (error) {
                callback(null, error);
            }
        });
    }
    function authenticateWithUserId(userId, jwtToken, callback) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!axiosInstance) {
                return callback(null, new Error("SDK is not initialized"));
            }
            try {
                const response = yield axios.post(`${baseUrl}/api/v1/jwt-authenticate`, {
                    user_id: userId,
                    auth_token: jwtToken,
                }, {
                    headers: {
                        Accept: "*/*",
                        "x-api-key": apiKey,
                        "Content-Type": "application/json",
                    },
                });
                if (response.status === 200 &&
                    response.data &&
                    response.data.status === "success") {
                    const authDetailsNew = {
                        authToken: response.data.data.auth_token,
                        refreshToken: response.data.data.refresh_auth_token,
                        deviceToken: response.data.data.device_token,
                    };
                    updateAuthDetails(authDetailsNew);
                    callback(response.data.data, null);
                }
                else {
                    callback(null, new Error("Server responded with an error"));
                }
            }
            catch (error) {
                callback(null, error);
            }
        });
    }
    function makeGetRequest(endpoint_1) {
        return __awaiter(this, arguments, void 0, function* (endpoint, queryUrl = null) {
            if (!axiosInstance) {
                throw new Error("SDK is not initialized");
            }
            const url = queryUrl ? `${endpoint}?${queryUrl}` : endpoint;
            try {
                const response = yield axiosInstance.get(url);
                if (response.data.status === "success") {
                    return response.data.data;
                }
                else {
                    throw new Error("Server responded with an error");
                }
            }
            catch (error) {
                throw error instanceof Error ? error : new Error("Unknown error");
            }
        });
    }
    function makePostRequest(endpoint_1) {
        return __awaiter(this, arguments, void 0, function* (endpoint, data = null) {
            if (!axiosInstance) {
                throw new Error("SDK is not initialized");
            }
            try {
                const response = yield axiosInstance.post(endpoint, data);
                if (response.data.status === "success") {
                    return response.data.data;
                }
                else {
                    throw new Error("Server responded with an error");
                }
            }
            catch (error) {
                throw error instanceof Error ? error : new Error("Unknown error");
            }
        });
    }
    function getPortfolio() {
        return __awaiter(this, void 0, void 0, function* () {
            return makeGetRequest("/v1/portfolio");
        });
    }
    function getSupportedTokens() {
        return __awaiter(this, void 0, void 0, function* () {
            return makeGetRequest("/v1/supported/tokens");
        });
    }
    function getSupportedNetworks() {
        return __awaiter(this, void 0, void 0, function* () {
            return makeGetRequest("/v1/supported/networks");
        });
    }
    function getUserDetails() {
        return __awaiter(this, void 0, void 0, function* () {
            return makeGetRequest("/v1/user_from_token");
        });
    }
    function getWallets() {
        return __awaiter(this, void 0, void 0, function* () {
            return makeGetRequest("/v1/wallet");
        });
    }
    function orderHistory(query) {
        return __awaiter(this, void 0, void 0, function* () {
            const queryString = getQueryString(query);
            return makeGetRequest("/v1/orders", queryString);
        });
    }
    function getNftOrderDetails(query) {
        return __awaiter(this, void 0, void 0, function* () {
            const queryString = getQueryString(query);
            return makeGetRequest("/v1/nft/order_details", queryString);
        });
    }
    function getRawTransactionStatus(query) {
        return __awaiter(this, void 0, void 0, function* () {
            const queryString = getQueryString(query);
            return makeGetRequest("/v1/rawtransaction/status", queryString);
        });
    }
    function createWallet() {
        return __awaiter(this, void 0, void 0, function* () {
            return makePostRequest("/v1/wallet");
        });
    }
    function transferTokens(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return makePostRequest("/v1/transfer/tokens/execute", data);
        });
    }
    function transferTokensWithJobStatus(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { orderId } = yield transferTokens(data);
                console.log("Transfer tokens order ID", orderId);
                return yield waitForJobCompletion(orderId, (_orderId) => __awaiter(this, void 0, void 0, function* () {
                    const orderData = yield orderHistory({ order_id: _orderId });
                    const order = orderData.jobs.find((item) => item.order_id === _orderId);
                    if (order &&
                        (order.status === exports.OrderStatus.SUCCESS ||
                            order.status === exports.OrderStatus.FAILED)) {
                        return order;
                    }
                    throw new Error(`Order with ID ${_orderId} not found or not completed.`);
                }));
            }
            catch (error) {
                throw error instanceof Error ? error : new Error("Unknown error");
            }
        });
    }
    function transferNft(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return makePostRequest("/v1/nft/transfer", data);
        });
    }
    function transferNftWithJobStatus(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { order_id } = yield transferNft(data);
                console.log("Transfer nfts order ID", order_id);
                return yield waitForJobCompletion(order_id, (orderId) => __awaiter(this, void 0, void 0, function* () {
                    const orderData = yield getNftOrderDetails({
                        order_id: orderId,
                    });
                    const order = orderData.nfts.find((item) => item.id === orderId);
                    if (order) {
                        return order;
                    }
                    throw new Error(`Order with ID ${orderId} not found or not completed.`);
                }));
            }
            catch (error) {
                throw error instanceof Error ? error : new Error("Unknown error");
            }
        });
    }
    function executeRawTransaction(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return makePostRequest("/v1/rawtransaction/execute", data);
        });
    }
    function executeRawTransactionWithJobStatus(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { jobId } = yield executeRawTransaction(data);
                console.log("Execute Raw transaction called with Job ID", jobId);
                return yield waitForJobCompletion(jobId, (orderId) => __awaiter(this, void 0, void 0, function* () {
                    const orderData = yield getRawTransactionStatus({
                        order_id: orderId,
                    });
                    const order = orderData.jobs.find((item) => item.order_id === orderId);
                    if (order &&
                        (order.status === exports.OrderStatus.SUCCESS ||
                            order.status === exports.OrderStatus.FAILED)) {
                        return order;
                    }
                    throw new Error(`Order with ID ${orderId} not found or not completed.`);
                }));
            }
            catch (error) {
                throw error instanceof Error ? error : new Error("Unknown error");
            }
        });
    }
    function waitForJobCompletion(orderId, findJobCallback) {
        return __awaiter(this, void 0, void 0, function* () {
            for (let retryCount = 0; retryCount < JOB_MAX_RETRY; retryCount++) {
                try {
                    return yield findJobCallback(orderId);
                }
                catch (error) {
                    /* empty */
                }
                yield delay(JOB_RETRY_INTERVAL);
            }
            throw new Error(`Order ID not found or not completed.`);
        });
    }
    function delay(ms) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve) => setTimeout(resolve, ms));
        });
    }
    function logOut() {
        return __awaiter(this, void 0, void 0, function* () {
            updateAuthDetails(null);
        });
    }
    function sendEmailOTP(email) {
        return __awaiter(this, void 0, void 0, function* () {
            return makePostRequest("/v1/authenticate/email", {
                email,
            });
        });
    }
    function verifyEmailOTP(email, otp, token) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield makePostRequest("/v1/authenticate/email/verify", { email, otp, token });
                if (response.message === "success") {
                    const authDetails = {
                        authToken: response.auth_token,
                        refreshToken: response.refresh_auth_token,
                        deviceToken: response.device_token,
                    };
                    updateAuthDetails(authDetails);
                    return true;
                }
            }
            catch (error) {
                return false;
            }
            return false;
        });
    }
    function sendPhoneOTP(phoneNumber, countryShortName) {
        return __awaiter(this, void 0, void 0, function* () {
            return makePostRequest("/v1/authenticate/phone", {
                phone_number: phoneNumber,
                country_short_name: countryShortName,
            });
        });
    }
    function verifyPhoneOTP(phoneNumber, countryShortName, otp, token) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield makePostRequest("/v1/authenticate/phone/verify", {
                    phone_number: phoneNumber,
                    country_short_name: countryShortName,
                    otp,
                    token,
                });
                if (response.message === "success") {
                    const authDetails = {
                        authToken: response.auth_token,
                        refreshToken: response.refresh_auth_token,
                        deviceToken: response.device_token,
                    };
                    updateAuthDetails(authDetails);
                    return true;
                }
            }
            catch (error) {
                return false;
            }
            return false;
        });
    }
    function showWidgetModal() {
        var _a;
        (_a = oktoModalRef.current) === null || _a === void 0 ? void 0 : _a.openModal(exports.ModalType.WIDGET, {
            theme,
            authToken: authDetails === null || authDetails === void 0 ? void 0 : authDetails.authToken,
            environment: buildType.toString(),
        });
    }
    function showOnboardingModal() {
        var _a;
        (_a = onboardingModalRef.current) === null || _a === void 0 ? void 0 : _a.openModal();
    }
    function closeModal() {
        var _a;
        (_a = oktoModalRef.current) === null || _a === void 0 ? void 0 : _a.closeModal();
    }
    function setTheme(newTheme) {
        updateTheme(Object.assign(Object.assign({}, theme), newTheme));
    }
    function getTheme() {
        return theme;
    }
    function readContractData(network_name, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return makePostRequest("/v1/readContractData", {
                network_name,
                data,
            });
        });
    }
    return (React.createElement(OktoContext.Provider, { value: {
            isLoggedIn,
            authenticate,
            authenticateWithUserId,
            logOut,
            getPortfolio,
            getSupportedNetworks,
            getSupportedTokens,
            getUserDetails,
            getWallets,
            orderHistory,
            getNftOrderDetails,
            getRawTransactionStatus,
            createWallet,
            transferNft,
            transferNftWithJobStatus,
            transferTokens,
            transferTokensWithJobStatus,
            executeRawTransaction,
            executeRawTransactionWithJobStatus,
            showWidgetModal,
            showOnboardingModal,
            closeModal,
            setTheme,
            getTheme,
            sendEmailOTP,
            verifyEmailOTP,
            sendPhoneOTP,
            verifyPhoneOTP,
            readContractData,
        } },
        children,
        React.createElement(OktoModal, { ref: oktoModalRef }),
        React.createElement(OnboardingModal, { ref: onboardingModalRef, updateAuthCb: updateAuthDetails, gAuthCb: gAuthCb ? gAuthCb : () => __awaiter(void 0, void 0, void 0, function* () { return ""; }), buildType: buildType, apiKey: apiKey, brandData: brandData, primaryAuth: primaryAuth, theme: theme })));
};
const useOkto = () => React.useContext(OktoContext);

exports.OktoProvider = OktoProvider;
exports.useOkto = useOkto;
//# sourceMappingURL=index.js.map
