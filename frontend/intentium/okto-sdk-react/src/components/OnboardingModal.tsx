import React, { useState, forwardRef, useImperativeHandle } from "react";
import { AuthDetails, AuthType, BuildType, BrandData, Theme } from "../types";
import OnboardingIframe from "./OnboardingIframe";

// eslint-disable-next-line no-empty-pattern
const _OnboardingModal = (
  {
    updateAuthCb,
    gAuthCb,
    buildType,
    apiKey,
    brandData,
    primaryAuth,
    theme,
  }: {
    updateAuthCb: (authDetails: AuthDetails) => void;
    gAuthCb: () => Promise<string>;
    buildType: BuildType;
    apiKey: string;
    brandData: BrandData;
    primaryAuth: AuthType;
    theme: Theme;
  },
  ref: any,
) => {
  const [visible, setVisible] = useState(false);

  const openModal = () => {
    setVisible(true);
  };

  const closeModal = () => {
    setVisible(false);
  };

  useImperativeHandle(ref, () => ({
    openModal,
    closeModal,
  }));

  function handleClose() {
    closeModal();
  }

  return (
    <OnboardingIframe
      visible={visible}
      onClose={handleClose}
      updateAuthCb={updateAuthCb}
      gAuthCb={gAuthCb}
      buildType={buildType}
      apiKey={apiKey}
      brandData={brandData}
      primaryAuth={primaryAuth}
      theme={theme}
    />
  );
};
export const OnboardingModal = forwardRef(_OnboardingModal);
