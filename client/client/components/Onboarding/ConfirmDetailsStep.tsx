// ...existing code...
import React, { useEffect, useMemo, useState } from "react";
import { useSubmitOnboardingMutation } from "@/store/apis/generalApi";
import { ArrowLeft, Upload, CheckCircle, FileText, User } from "lucide-react";
import { useToaster } from "../common/Toaster";
import { useSelector, useDispatch } from "react-redux";
import { logIn } from "@/store/userSlice";
import { useNavigate } from "react-router-dom";

const ConfirmDetailsStep = ({
  onNext,
  onBack,
  formData,
  stepCount,
  currentStep,
}: {
  onNext: () => void;
  onBack: () => void;
  formData: any;
  stepCount?: number;
  currentStep?: number;
}) => {
  const { showToast } = useToaster();
  const [upload, { isLoading }] = useSubmitOnboardingMutation();

  const dispatch = useDispatch();

  // generate preview URL for profile photo if provided
  const photoUrl = useMemo(() => {
    if (formData?.profilePhoto && typeof formData.profilePhoto === "object") {
      try {
        return URL.createObjectURL(formData.profilePhoto);
      } catch {
        return null;
      }
    }
    return null;
  }, [formData?.profilePhoto]);

  useEffect(() => {
    return () => {
      if (photoUrl) URL.revokeObjectURL(photoUrl);
    };
  }, [photoUrl]);

  const router = useNavigate();

  const listToPills = (arr: string[] = []) =>
    (arr || []).map((s: string, i: number) => (
      <span
        key={i}
        className="inline-block bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-md mr-2 mb-2"
      >
        {s}
      </span>
    ));

  const handleConfirm = async () => {
    try {
      const res = await upload(formData).unwrap();
      console.log("Upload successful:", res);
      showToast("Details submitted successfully!", "success");
      // @ts-ignore
      dispatch(logIn({ token: res?.token, userInfo: res?.saved }));
      router("/feed");
    } catch (err) {
      console.error("Upload failed:", err);
      showToast(
        err?.data?.msg || "Failed to submit details. Please try again.",
        "error",
      );
    }
  };

  return (
    <div className=" bg-gray-50 mt-5 flex items-center justify-center section-padding">
      <div className="content-width-narrow w-full max-w-3xl">
        <div className="rounded-xl bg-white shadow-lg overflow-hidden">
          <div className="flex items-center justify-between p-6 border-b">
            <div className="flex items-center gap-3">
              <div className="rounded-md bg-purple-50 p-3">
                <CheckCircle className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Confirm your details
                </h2>
                <p className="text-sm text-gray-600">
                  Review and submit — this helps Rumi find better matches.
                </p>
              </div>
            </div>

            <div className="text-sm text-gray-500">
              Step {currentStep} of {stepCount}
            </div>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left: avatar + uploads */}
            <div className="md:col-span-1 flex flex-col items-center gap-4">
              <div className="w-28 h-28 rounded-lg bg-gray-100 overflow-hidden flex items-center justify-center">
                {photoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={photoUrl}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-gray-400">
                    <User className="w-10 h-10" />
                  </div>
                )}
              </div>

              <div className="text-center">
                <div className="text-sm font-medium text-gray-900">
                  {formData.fullName || "No name provided"}
                </div>
                <div className="text-xs text-gray-500">
                  {formData.email || "No email provided"}
                </div>
              </div>

              <div className="w-full space-y-2 mt-2">
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <FileText className="w-4 h-4 text-gray-400" />
                  <div>
                    <div className="text-xs text-gray-500">Resume</div>
                    <div className="text-sm text-gray-800">
                      {formData.resume
                        ? `${formData.resume.name}`
                        : "Not uploaded"}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <Upload className="w-4 h-4 text-gray-400" />
                  <div>
                    <div className="text-xs text-gray-500">Profile Photo</div>
                    <div className="text-sm text-gray-800">
                      {formData.profilePhoto
                        ? formData.profilePhoto.name
                        : "Not uploaded"}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: details */}
            <div className="md:col-span-2">
              <div className="mb-4">
                <h3 className="text-sm font-semibold text-gray-700 mb-2">
                  Profile summary
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="text-sm text-gray-600">
                    <div className="font-medium text-gray-900">DOB</div>
                    <div>
                      {formData.attributes?.dob
                        ? new Date(formData.attributes?.dob)?.toDateString()
                        : "Not provided"}
                    </div>
                  </div>
                  <div className="text-sm text-gray-600">
                    <div className="font-medium text-gray-900">Location</div>
                    <div>
                      {formData.attributes.location.city || "Not provided"}
                    </div>
                  </div>

                  <div className="text-sm text-gray-600">
                    <div className="font-medium text-gray-900">Industries</div>
                    <div>
                      {listToPills(formData.attributes.industries) || "None"}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <h3 className="text-sm font-semibold text-gray-700 mb-2">
                  Skills & interests
                </h3>
                <div className="flex flex-wrap">
                  {listToPills(formData.attributes.skills)}
                  {listToPills(formData.attributes.interests)}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-2">
                  Personality / Vibe
                </h3>
                <div className="flex flex-wrap">
                  {listToPills(formData.attributes.personality)}
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 border-t bg-gray-50 flex items-center gap-3 justify-end">
            <button
              onClick={onBack}
              disabled={isLoading}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-md border border-gray-200 bg-white text-sm text-gray-700 hover:bg-gray-50"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>

            <button
              onClick={handleConfirm}
              disabled={isLoading}
              className="btn-primary flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <div className="inline-flex items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Uploading...
                </div>
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  Confirm & Submit
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDetailsStep;
