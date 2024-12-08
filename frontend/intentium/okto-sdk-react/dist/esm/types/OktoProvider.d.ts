import React, { type ReactNode } from "react";
import { BuildType, type OktoContextType, AuthType, BrandData } from "./types";
export declare const OktoProvider: ({ children, apiKey, buildType, gAuthCb, primaryAuth, brandData, }: {
    children: ReactNode;
    apiKey: string;
    buildType: BuildType;
    gAuthCb?: () => Promise<string>;
    primaryAuth?: AuthType;
    brandData?: BrandData;
}) => React.JSX.Element;
export declare const useOkto: () => OktoContextType | null;
