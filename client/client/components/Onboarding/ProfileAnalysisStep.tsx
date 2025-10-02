import { FormDataInterface } from "@/pages/Onboarding";
import {
  useExtractSkillsMutation,
  useSubmitOnboardingMutation,
} from "@/store/apis/generalApi";
import { ArrowLeft, ArrowRight, Upload, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useGetGeoLocation } from "@/hooks/use-getgeolocation";
export interface AttributesData {
  dob: string | "";
  location: {
    city: string;
    region: string;
    country: string;
    lat: number;
    lon: number;
  };
  industries: string[];
  interests: string[];
  skills: string[];
  personality: string[];
  additional_attributes: string[];
  bio: string;
}
const ProfileAnalysisStep = ({
  onNext,
  onBack,
  formData,
  stepCount,
  currentStep,
  setFormData,
}: {
  onNext: () => void;
  onBack: () => void;
  formData: FormDataInterface;
  stepCount?: number;
  currentStep?: number;
  setFormData: React.Dispatch<React.SetStateAction<FormDataInterface>>;
}) => {
  const { geoData, loading: geoLoading, error: geoError } = useGetGeoLocation();
  const [attributes, setAttributes] = useState<AttributesData>(
    formData.attributes,
  );
  const [errors, setErrors] = useState<string[]>([]);

  const [newField, setNewField] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [extractSkills, {}] = useExtractSkillsMutation();
  const resumeInputRef = useRef<HTMLInputElement | null>(null);

  //   const [submitForm, { isLoading: submitting }] = useSubmitOnboardingMutation();
  const [useAutoLocation, setUseAutoLocation] = useState(false);

  useEffect(() => {
    if (useAutoLocation && geoData) {
      console.log("geoData", geoData);
      setAttributes((prev) => ({
        ...prev,
        location: {
          city: geoData?.city || "",
          region: geoData?.regionName || "",
          country: geoData?.country || "",
          lat: geoData?.lat || 0,
          lon: geoData?.lon || 0,
        },
      }));
    }
  }, [useAutoLocation]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("resume", file);
    setFormData((prev: any) => ({ ...prev, resume: file }));

    setIsLoading(true);
    try {
      const res = await extractSkills(file).unwrap();

      console.log("res try", res);

      setIsLoading(false);
      // @ts-ignore
      setAttributes((prev) => ({ ...prev, ...res?.attributes }));
    } catch (error) {
      console.error("Upload failed", error);
    } finally {
      setIsLoading(false);
    }
  };

  const addItem = (field: keyof AttributesData) => {
    if (!newField[field]?.trim()) return;
    setAttributes((prev) => ({
      ...prev,
      [field]: [...(prev[field] as string[]), newField[field].trim()],
    }));
    setNewField((prev) => ({ ...prev, [field]: "" }));
  };

  const removeItem = (field: keyof AttributesData, value: string) => {
    setAttributes((prev) => ({
      ...prev,
      [field]: (prev[field] as string[]).filter((v) => v !== value),
    }));
  };

  const onContinue = () => {
    const newErrors: string[] = [];

    if (!formData.resume) {
      newErrors.push("Resume upload is required");
    }

    if (!attributes.bio.trim()) {
      newErrors.push("Bio is required (auto-fill or write manually)");
    }

    if (newErrors.length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors([]);
    setFormData((prev: any) => ({ ...prev, attributes }));
    onNext();
  };

  const renderChipsInput = (
    field: keyof AttributesData,
    placeholder?: string,
  ) => (
    <div>
      <div className="flex flex-wrap gap-2 mb-2">
        {((attributes[field] as string[]) || []).map((value) => (
          <span
            key={value}
            className={`inline-flex items-center gap-2 px-3 py-1 bg-rumi-purple-100 text-rumi-purple rounded-full`}
          >
            <span className="text-sm">{value}</span>
            <X
              className="w-4 h-4 cursor-pointer"
              onClick={() => removeItem(field, value)}
            />
          </span>
        ))}
        {((attributes[field] as string[]) || []).length === 0 && (
          <span className="text-xs text-gray-400">
            No {String(field)} added
          </span>
        )}
      </div>

      <div className="flex gap-2">
        <input
          value={newField[field as string] || ""}
          onChange={(e) =>
            setNewField((p) => ({ ...p, [field as string]: e.target.value }))
          }
          placeholder={placeholder || `Add ${String(field)}`}
          className={`${errors.includes(`${field} must have at least one item`) ? "border-red-500" : ""} input-field flex-1`}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addItem(field);
            }
          }}
        />
        <button
          type="button"
          onClick={() => addItem(field)}
          className="btn-secondary px-4 py-2 text-sm"
        >
          Add
        </button>
      </div>
    </div>
  );

  return (
    <div className="pt-7 bg-gray-50 flex items-center justify-center section-padding">
      <div className="content-width-narrow w-full max-w-3xl">
        <div className="rounded-xl bg-white shadow-lg overflow-hidden">
          <div className="p-6 border-b flex items-center gap-4">
            <div className="rounded-md bg-purple-50 p-3">
              <Upload className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Profile analysis
              </h2>
              <p className="text-sm text-gray-600">
                Upload a resume or manually edit fields below. All fields are
                editable.
              </p>
            </div>
            <div className="ml-auto text-sm text-gray-500">
              Step {currentStep} of {stepCount}
            </div>
          </div>

          <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Upload column */}
            <div className="md:col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload Resume (Auto-Fill)
              </label>

              {isLoading ? (
                <div className="flex items-center justify-center py-6">
                  <div className="h-10 w-10 animate-spin rounded-full border-4 border-rumi-purple border-t-transparent"></div>
                </div>
              ) : (
                <div
                  onClick={() => resumeInputRef.current?.click()}
                  className="flex flex-col items-center justify-center w-full p-6 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-rumi-purple hover:bg-rumi-purple-50 transition-colors"
                >
                  <Upload className="w-8 h-8 text-gray-600 mb-2" />
                  <p className="text-sm text-gray-600 text-center">
                    <span className="font-medium text-rumi-purple">
                      Click to upload
                    </span>{" "}
                    or drag & drop
                  </p>
                  <p className="text-xs text-gray-500">
                    PDF, DOC, DOCX up to 5MB
                  </p>
                </div>
              )}

              <input
                ref={resumeInputRef}
                id="resumeUpload"
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleUpload}
                className="hidden"
              />

              <div className="mt-4 text-sm text-gray-600 space-y-2">
                <div>
                  <span className="font-medium text-gray-900">
                    Location preview:
                  </span>{" "}
                  <span className="text-gray-700">
                    {attributes.location?.city || "Not specified"}
                  </span>
                </div>
                <div>
                  <span className="font-medium text-gray-900">
                    Skills detected:
                  </span>{" "}
                  <span className="text-gray-700">
                    {(attributes.skills || []).slice(0, 3).join(", ") || "—"}
                  </span>
                </div>
              </div>
            </div>

            {/* Editable fields column */}
            <div className="md:col-span-2">
              <div className="mb-4">
                {errors.length > 0 && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm space-y-1">
                    {errors.map((err, i) => (
                      <p key={i}>⚠️ {err}</p>
                    ))}
                  </div>
                )}
                <h3 className="text-sm font-semibold text-gray-700 mb-2">
                  Profile summary
                </h3>

                {/* < className="grid grid-cols-1 md:grid-cols-3 gap-3"> */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    value={attributes.dob}
                    onChange={(e) => {
                      console.log(new Date(e.target.value).toISOString());
                      setAttributes((prev) => ({
                        ...prev,
                        dob: e.target.value,
                      }));
                      // Calculate age from DOB
                      // setProfile((prev) => ({
                      //   ...prev,
                      //   age: e.target.value ? Number(e.target.value) : "",
                      // }))
                    }}
                    placeholder="e.g. 28"
                    className="input-field w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Location
                  </label>
                  {useAutoLocation ? (
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={
                          geoLoading
                            ? "Detecting..."
                            : geoError
                              ? "Error fetching location"
                              : geoData?.city
                                ? `${geoData.city}, ${geoData.country}`
                                : attributes.location.city || ""
                        }
                        disabled
                        className="input-field flex-1 bg-gray-100"
                      />
                      <button
                        type="button"
                        onClick={() => setUseAutoLocation(false)}
                        className="btn-secondary px-2 py-1 text-xs"
                      >
                        Enter manually
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={attributes?.location?.city}
                        onChange={(e) =>
                          setAttributes((prev) => ({
                            ...prev,
                            location: {
                              ...prev.location,
                              city: e.target.value,
                            },
                          }))
                        }
                        placeholder="Eg. Melbourne"
                        className="input-field flex-1"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (geoData?.city) {
                            setAttributes((prev) => ({
                              ...prev,
                              location: {
                                ...prev.location,
                                city: geoData.city,
                                country: geoData.country,
                              },
                            }));
                          }
                          setUseAutoLocation(true);
                        }}
                        className="btn-secondary px-2 py-1 text-xs"
                      >
                        Use auto
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bio
                </label>
                <textarea
                  value={attributes.bio}
                  onChange={(e) =>
                    setAttributes((prev) => ({ ...prev, bio: e.target.value }))
                  }
                  placeholder="Tell us about yourself or let the system auto-fill from your resume"
                  className={`input-field w-full h-28 ${
                    errors.includes(
                      "Bio is required (auto-fill or write manually)",
                    )
                      ? "border-red-500"
                      : ""
                  }`}
                />
              </div>

              <div className="mb-4">
                <h3 className="text-sm font-semibold text-gray-700 mb-2">
                  Industries
                </h3>
                {renderChipsInput("industries", "Add industry and press Enter")}
              </div>

              <div className="mb-4">
                <h3 className="text-sm font-semibold text-gray-700 mb-2">
                  Skills
                </h3>
                {renderChipsInput("skills", "Add skill and press Enter")}
              </div>

              <div className="mb-4">
                <h3 className="text-sm font-semibold text-gray-700 mb-2">
                  Interests
                </h3>
                {renderChipsInput("interests", "Add interest and press Enter")}
              </div>

              <div className="mb-4">
                <h3 className="text-sm font-semibold text-gray-700 mb-2">
                  Personality / Vibe
                </h3>
                {renderChipsInput("personality", "Add trait and press Enter")}
              </div>

              <div className="mb-4">
                <h3 className="text-sm font-semibold text-gray-700 mb-2">
                  Additional attributes
                </h3>
                {renderChipsInput(
                  "additional_attributes" as keyof AttributesData,
                  "Add attribute and press Enter",
                )}
              </div>
            </div>
          </div>

          <div className="p-6 border-t bg-gray-50 flex items-center gap-3 justify-end">
            <button
              onClick={onBack}
              disabled={isLoading}
              className="btn-secondary flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
            <button
              onClick={onContinue}
              disabled={isLoading}
              className="btn-primary flex items-center gap-2"
            >
              Continue
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ProfileAnalysisStep;
