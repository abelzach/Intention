import React, { useRef, useEffect, useMemo, useState } from "react";
import styles from "./OnboardingIframe.module.css";
import { oktoLogo, onBoardingUrls } from "../constants";
import { AuthDetails, AuthType, BrandData, BuildType, Theme } from "../types";
import { CrossIcon } from "./Icon";

export interface InjectData {
  textPrimaryColor: string;
  textSecondaryColor: string;
  textTertiaryColor: string;
  accent1Color: string;
  accent2Color: string;
  strokeBorderColor: string;
  strokeDividerColor: string;
  surfaceColor: string;
  backgroundColor: string;
  ENVIRONMENT: string;
  API_KEY: string;
  primaryAuthType: string;
  brandTitle: string;
  brandSubtitle: string;
  brandIconUrl: string;
}

function getInjectedData(
  buildType: BuildType,
  apiKey: string,
  brandData: BrandData,
  primaryAuth: AuthType,
  theme: Theme,
): InjectData {
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

const OnboardingIframe = ({
  visible,
  onClose,
  updateAuthCb,
  gAuthCb,
  buildType,
  apiKey,
  brandData,
  primaryAuth,
  theme,
}: {
  visible: boolean;
  onClose: () => void;
  updateAuthCb: (authDetails: AuthDetails) => void;
  gAuthCb: () => Promise<string>;
  buildType: BuildType;
  apiKey: string;
  brandData: BrandData;
  primaryAuth: AuthType;
  theme: Theme;
}) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [refreshNonce, setRefreshNonce] = useState(0);

  const widgetUrl = onBoardingUrls[buildType];

  const refreshIframe = () => {
    setRefreshNonce(refreshNonce + 1);
  };

  const handleClose = () => {
    onClose();
    refreshIframe();
  };

  const handleMessage = async (event: MessageEvent) => {
    try {
      const message = JSON.parse(event.data);
      if (message.type === "go_back") {
        handleClose();
      } else if (message.type === "g_auth") {
        //handle google auth
        const idToken = await gAuthCb();
        iframeRef.current?.contentWindow?.postMessage(
          JSON.stringify({ type: "g_auth", data: idToken }),
          widgetUrl,
        );
      } else if (message.type === "copy_text") {
        //handle copy text
        const clipboardText = await navigator.clipboard.readText();
        const trimmedText = clipboardText.trim();
        iframeRef.current?.contentWindow?.postMessage(
          JSON.stringify({ type: "copy_text", data: trimmedText }),
          widgetUrl,
        );
      } else if (message.type === "auth_success") {
        //handle auth success
        const authData = message.data;
        const authDetails: AuthDetails = {
          authToken: authData.auth_token,
          refreshToken: authData.refresh_auth_token,
          deviceToken: authData.device_token,
        };
        updateAuthCb(authDetails);
        handleClose();
      }
    } catch (error) {
      console.error("Error parsing okto widget data", error);
    }
  };

  useEffect(() => {
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
          data: getInjectedData(
            buildType,
            apiKey,
            brandData,
            primaryAuth,
            theme,
          ),
        };
        iframe.contentWindow.postMessage(message, widgetUrl);
      }
    }

    window.addEventListener("message", handleMessage);

    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, [buildType, apiKey, brandData, primaryAuth, theme]);

  const iframeKey = useMemo(
    () =>
      btoa(
        encodeURIComponent(
          JSON.stringify({
            buildType,
            apiKey,
            brandData,
            primaryAuth,
            theme,
            refreshNonce,
          }),
        ),
      ),
    [buildType, apiKey, brandData, primaryAuth, theme, refreshNonce],
  );

  return (
    <div
      className={`${styles.modalOverlay} ${visible ? "" : styles.hidden}`}
      onClick={handleClose}
    >
      <div className={styles.modalContainer}>
        <div className={styles.modalContent}>
          <div className={styles.container}>
            <div className={styles.modalHeader}>
              <div className={styles.logoContainer}>
                <img src={oktoLogo} height={24} width={24} alt="logo" />
                <div className={styles.headerText}>Okto Wallet</div>
              </div>
              <div className={styles.iconContainer}>
                <button className={styles.closeButton}>
                  <CrossIcon color="#FFFFFF" />
                </button>
              </div>
            </div>
            <iframe
              key={iframeKey}
              ref={iframeRef}
              src={widgetUrl}
              className={styles.iframe}
              loading="eager"
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingIframe;
