import React from "react";
import { AuthDetails, AuthType, BuildType, BrandData, Theme } from "../types";
export declare const OnboardingModal: React.ForwardRefExoticComponent<{
    updateAuthCb: (authDetails: AuthDetails) => void;
    gAuthCb: () => Promise<string>;
    buildType: BuildType;
    apiKey: string;
    brandData: BrandData;
    primaryAuth: AuthType;
    theme: Theme;
} & React.RefAttributes<unknown>>;
