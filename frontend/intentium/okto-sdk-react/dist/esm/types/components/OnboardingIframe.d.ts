import React from "react";
import { AuthDetails, AuthType, BrandData, BuildType, Theme } from "../types";
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
declare const OnboardingIframe: ({ visible, onClose, updateAuthCb, gAuthCb, buildType, apiKey, brandData, primaryAuth, theme, }: {
    visible: boolean;
    onClose: () => void;
    updateAuthCb: (authDetails: AuthDetails) => void;
    gAuthCb: () => Promise<string>;
    buildType: BuildType;
    apiKey: string;
    brandData: BrandData;
    primaryAuth: AuthType;
    theme: Theme;
}) => React.JSX.Element;
export default OnboardingIframe;
