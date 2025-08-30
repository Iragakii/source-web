import { useState } from "react";
import { courseService } from "../../services/courseService";
import { useNotification } from "../../contexts/NotificationContext";

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const RegisterModal = ({ isOpen, onClose }: RegisterModalProps) => {
  const [formData, setFormData] = useState({
    studentName: "",
    email: "",
    phone: "",
    courseName: "IT Fundamentals",
    experience: "beginner"
  });

  const [errors, setErrors] = useState<{
    studentName?: string;
    email?: string;
    phone?: string;
    general?: string;
  }>({});
  const [isLoading, setIsLoading] = useState(false);
  const { showNotification } = useNotification();

  const validateForm = () => {
    const newErrors: { studentName?: string; email?: string; phone?: string } = {};

    if (!formData.studentName.trim()) {
      newErrors.studentName = "Student name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email format is invalid";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^\d{10,}$/.test(formData.phone.replace(/\D/g, ""))) {
      newErrors.phone = "Phone number must be at least 10 digits";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
    if (errors[field as keyof typeof errors]) {
      setErrors({ ...errors, [field]: undefined });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setErrors({});

    try {
      const result = await courseService.registerForCourse({
        studentName: formData.studentName,
        email: formData.email,
        phone: formData.phone,
        courseName: formData.courseName,
        experience: formData.experience,
        notes: ""
      });

      if (result.success && result.data) {
        showNotification(
          `Registration successful! Welcome ${formData.studentName} to ${formData.courseName}!`,
          'success'
        );
        onClose();
        // Reset form
        setFormData({
          studentName: "",
          email: "",
          phone: "",
          courseName: "IT Fundamentals",
          experience: "beginner"
        });
      } else {
        // Handle validation errors from server
        if (result.errors && result.errors.length > 0) {
          const serverErrors: any = {};
          result.errors.forEach((error: string) => {
            if (error.toLowerCase().includes("name")) {
              serverErrors.studentName = error;
            } else if (error.toLowerCase().includes("email")) {
              serverErrors.email = error;
            } else if (error.toLowerCase().includes("phone")) {
              serverErrors.phone = error;
            } else {
              serverErrors.general = error;
            }
          });
          setErrors(serverErrors);
        } else {
          setErrors({
            general: result.message || "Registration failed. Please try again."
          });
        }
      }
    } catch (error) {
      console.error("Course registration error:", error);
      setErrors({
        general: "An unexpected error occurred. Please try again."
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-black/95 border-2 border-[#61dca3] rounded-lg p-16 w-full max-w-2xl mx-4 shadow-2xl shadow-[#61dca3]/20">
        <h2 className="text-[#61dca3] font-mono text-2xl mb-8 text-center">
          IT COURSE REGISTRATION
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {errors.general && (
            <div className="bg-red-500/10 border border-red-500 rounded p-3 mb-4">
              <p className="text-red-500 text-sm font-mono">{errors.general}</p>
            </div>
          )}
          <div>
            <label className="block text-[#61dca3] font-mono text-[18px] !mb-2">
              &gt; STUDENT NAME:
            </label>
            <input
              type="text"
              value={formData.studentName}
              onChange={(e) => handleInputChange("studentName", e.target.value)}
              disabled={isLoading}
              className={`w-full bg-transparent border rounded px-4 !mb-4 !py-2 text-[#61dca3] font-mono transition-all duration-300 ${
                errors.studentName
                  ? "border-red-500"
                  : "border-[#2b4539] focus:border-[#61dca3]"
              } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
              placeholder="Enter your full name..."
            />
            {errors.studentName && (
              <p className="text-red-500 text-xs mt-1 font-mono">
                {errors.studentName}
              </p>
            )}
          </div>

          <div>
            <label className="block text-[#61dca3] font-mono text-[18px] !mb-2">
              &gt; EMAIL ADDRESS:
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              disabled={isLoading}
              className={`w-full bg-transparent border rounded px-4 !mb-4 !py-2 text-[#61dca3] font-mono transition-all duration-300 ${
                errors.email
                  ? "border-red-500"
                  : "border-[#2b4539] focus:border-[#61dca3]"
              } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
              placeholder="Enter your email..."
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1 font-mono">
                {errors.email}
              </p>
            )}
          </div>

          <div>
            <label className="block text-[#61dca3] font-mono text-[18px] !mb-2">
              &gt; PHONE NUMBER:
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => handleInputChange("phone", e.target.value)}
              disabled={isLoading}
              className={`w-full bg-transparent border rounded px-4 !mb-4 !py-2 text-[#61dca3] font-mono transition-all duration-300 ${
                errors.phone
                  ? "border-red-500"
                  : "border-[#2b4539] focus:border-[#61dca3]"
              } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
              placeholder="Enter your phone number..."
            />
            {errors.phone && (
              <p className="text-red-500 text-xs mt-1 font-mono">
                {errors.phone}
              </p>
            )}
          </div>

          <div>
            <label className="block text-[#61dca3] font-mono text-[18px] !mb-2">
              &gt; COURSE SELECTION:
            </label>
            <select
              value={formData.courseName}
              onChange={(e) => handleInputChange("courseName", e.target.value)}
              disabled={isLoading}
              className={`w-full bg-transparent border border-[#2b4539] focus:border-[#61dca3] rounded px-4 !mb-4 !py-2 text-[#61dca3] font-mono transition-all duration-300 ${
                isLoading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              <option value="IT Fundamentals" className="bg-black text-[#61dca3]">IT Fundamentals</option>
              <option value="Web Development" className="bg-black text-[#61dca3]">Web Development</option>
              <option value="Data Science" className="bg-black text-[#61dca3]">Data Science</option>
              <option value="Cybersecurity" className="bg-black text-[#61dca3]">Cybersecurity</option>
              <option value="Cloud Computing" className="bg-black text-[#61dca3]">Cloud Computing</option>
            </select>
          </div>

          <div>
            <label className="block text-[#61dca3] font-mono text-[18px] !mb-2">
              &gt; EXPERIENCE LEVEL:
            </label>
            <select
              value={formData.experience}
              onChange={(e) => handleInputChange("experience", e.target.value)}
              disabled={isLoading}
              className={`w-full bg-transparent border border-[#2b4539] focus:border-[#61dca3] rounded px-4 !mb-4 !py-2 text-[#61dca3] font-mono transition-all duration-300 ${
                isLoading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              <option value="beginner" className="bg-black text-[#61dca3]">Beginner</option>
              <option value="intermediate" className="bg-black text-[#61dca3]">Intermediate</option>
              <option value="advanced" className="bg-black text-[#61dca3]">Advanced</option>
            </select>
          </div>

          <div className="space-y-4">
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full bg-transparent border-2 border-[#61dca3] text-[#61dca3] font-mono py-4 h-10 rounded hover:bg-[#61dca3] hover:text-black transition-all duration-300 cursor-pointer transform hover:scale-105 ${
                isLoading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {isLoading ? "[ REGISTERING... ]" : "[ REGISTER FOR COURSE ]"}
            </button>
          </div>
        </form>

        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#61dca3] hover:text-[#61b3dc] cursor-pointer text-xl font-mono"
        >
          ×
        </button>
      </div>
    </div>
  );
};

export default RegisterModal;
