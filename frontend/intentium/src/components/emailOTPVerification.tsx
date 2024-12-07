import React, { useState } from "react";
import { useOkto, type OktoContextType } from "okto-sdk-react";
import { Notification } from "@/components/ui/notification";

interface EmailOTPVerificationProps {
  onVerificationSuccess?: () => void;
  onVerificationError?: (error: Error) => void;
}

export const EmailOTPVerification: React.FC<EmailOTPVerificationProps> = ({
  onVerificationSuccess,
  onVerificationError,
}) => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [otpToken, setOtpToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<"email" | "otp">("email");
  const [showEmailNotification, setEmailShowNotification] = useState(false);
  const [showOTPNotification, setOTPShowNotification] = useState(false);

  const { sendEmailOTP, verifyEmailOTP } = useOkto() as OktoContextType;

  const validateEmail = (e: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(e);
  };

  const handleSendOTP = async () => {
    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const response = await sendEmailOTP(email);
      setOtpToken(response.token);
      setStep("otp");
      setOTPShowNotification(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send OTP");
      console.error("Send OTP Error:", err);
      alert(err instanceof Error ? err.message : "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (!otp || otp.length < 4) {
      setError("Please enter a valid OTP");
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const success = await verifyEmailOTP(email, otp, otpToken!);
      if (success) {
        onVerificationSuccess?.();
        setEmailShowNotification(true);
        setStep("email");
      } else {
        alert("Invalid OTP");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to verify OTP";
      setError(errorMessage);
      onVerificationError?.(
        err instanceof Error ? err : new Error(errorMessage)
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg">
      {showEmailNotification && (
        <Notification
          message="Email verified successfully"
          variant="success"
          onDismiss={() => setEmailShowNotification(false)}
        />
      )}
      {showOTPNotification && (
        <Notification
          message="OTP sent successfully"
          variant="success"
          onDismiss={() => setOTPShowNotification(false)}
        />
      )}
      {step === "email" ? (
        <>
          <div className="flex items-center space-x-4">
            <input
              className="flex-grow h-12 bg-gray-100 border border-gray-300 rounded-lg px-8 text-base focus:outline-none"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError(null);
              }}
              type="email"
              disabled={loading}
            />
            <button
              className={`h-12 px-12 rounded-lg text-white font-semibold transition
              ${
                loading || !email
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-black hover:bg-gray-700"
              }`}
              onClick={handleSendOTP}
            >
              {loading ? (
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto" />
              ) : (
                "Send OTP"
              )}
            </button>
          </div>

          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        </>
      ) : (
        <>
          <div className="flex items-center space-x-4">
            <input
              className="flex-grow h-12 bg-gray-100 border border-gray-300 rounded-lg px-4 text-base focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => {
                setOtp(e.target.value);
                setError(null);
              }}
              type="number"
              maxLength={6}
              disabled={loading}
            />
            <button
              className={`h-12 px-6 rounded-lg text-white font-semibold transition
              ${
                loading || !otp
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-700"
              }`}
              onClick={handleVerifyOTP}
              disabled={loading || !otp}
            >
              {loading ? (
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto" />
              ) : (
                "Verify OTP"
              )}
            </button>
          </div>

          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

          <button
            className="mt-4 text-indigo-600 hover:text-indigo-700 text-sm font-medium"
            onClick={() => {
              setStep("email");
              setOtp("");
              setError(null);
            }}
          >
            Change Email / Resend OTP
          </button>
        </>
      )}
    </div>
  );
};
