import { FormDataInterface } from "@/pages/Onboarding";
import { ArrowLeft, ArrowRight, Upload } from "lucide-react";
import { useRef, useState } from "react";

const UploadStep = ({
  onNext,
  onBack,
  setFormData,
  currentStep,
  stepCount,
  formData,
}: {
  onNext: () => void;
  onBack: () => void;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  currentStep?: number;
  stepCount?: number;
  formData: FormDataInterface;
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [preview, setPreview] = useState<string | null>(
    formData.profilePhoto ? URL.createObjectURL(formData.profilePhoto) : null,
  );

  const handleClick = () => {
    fileInputRef.current?.click(); // simulate click on hidden input
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);

      const formData = new FormData();
      formData.append("profilePhoto", file);
      setFormData((prev) => ({ ...prev, profilePhoto: file }));
      // setFormData((prev) => ({ ...prev, profilePhoto: file }));

      // 👉 If you want to upload immediately:
      // const formData = new FormData();
      // formData.append("file", file);
      // await fetch("http://localhost:8000/upload-photo", {
      //   method: "POST",
      //   body: formData,
      // });
    }
  };

  return (
    <div className=" bg-gray-50 mt-[-12vh] flex items-center justify-center section-padding">
      <div className="content-width-narrow w-full max-w-2xl">
        <div className="rounded-xl bg-white shadow-lg overflow-hidden">
          <div className="p-6 border-b flex items-center gap-4">
            <div className="rounded-md bg-purple-50 p-3">
              <Upload className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Add a profile photo
              </h2>
              <p className="text-sm text-gray-600">
                Help others connect with you through a friendly profile picture
              </p>
            </div>
            <div className="ml-auto text-sm text-gray-500">
              Step {currentStep} of {stepCount}
            </div>
          </div>

          <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1 flex flex-col items-center gap-4">
              <div
                onClick={handleClick}
                className="w-32 h-32 rounded-full bg-gray-100 flex items-center justify-center border-2 border-dashed border-gray-300 cursor-pointer overflow-hidden"
              >
                {preview ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={preview}
                    alt="Preview"
                    className="w-full h-full object-cover rounded-full"
                  />
                ) : (
                  <div className="text-center">
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">Click to upload</p>
                  </div>
                )}
              </div>

              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
              />

              <div className="text-center text-sm text-gray-500">
                <div>Recommended: Square image, at least 400x400px</div>
                <div>JPG, PNG up to 10MB</div>
              </div>
            </div>

            <div className="md:col-span-2 flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-2">
                  Preview & details
                </h3>
                <p className="text-sm text-gray-600">
                  Add a friendly photo — people respond better to profiles with
                  pictures.
                </p>
              </div>

              <div className="flex gap-3 pt-6">
                <button
                  onClick={onBack}
                  className="btn-secondary flex-1 flex items-center justify-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </button>
                <button
                  onClick={onNext}
                  className="btn-primary flex-1 flex items-center justify-center gap-2"
                >
                  Continue
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadStep;
