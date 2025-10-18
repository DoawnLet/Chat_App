"use client";

import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Eye,
  EyeOff,
  User,
  Mail,
  Lock,
  CheckCircle,
  AlertCircle,
  Phone,
  Calendar,
  AtSign,
  Upload,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { authService } from "@/services/auth/auth.service";
import { RegisterRequest } from "@/services/auth/auth.types";
import { getErrorMessage } from "@/lib/axios";

interface FormData {
  handle: string;
  displayName: string; // ✅ Thay đổi: firstName + lastName → displayName
  email: string;
  phone: string;
  dateOfBirth: string;
  password: string;
  confirmPassword: string;
  acceptTerms: boolean;
  avatar?: File; // ✅ Thêm mới: file upload
}

interface FormErrors {
  handle?: string;
  displayName?: string; // ✅ Thay đổi
  email?: string;
  phone?: string;
  dateOfBirth?: string;
  password?: string;
  confirmPassword?: string;
  acceptTerms?: string;
  avatar?: string; // ✅ Thêm mới
  general?: string;
}

const RegisterForm = () => {
  const [formData, setFormData] = useState<FormData>({
    handle: "",
    displayName: "", // ✅ Thay đổi
    email: "",
    phone: "",
    dateOfBirth: "",
    password: "",
    confirmPassword: "",
    acceptTerms: false,
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null); // ✅ Thêm mới

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // ✅ Validate handle (giữ nguyên logic cũ)
    const handleRegex = /^[a-zA-Z0-9_]{3,20}$/;
    if (!formData.handle.trim()) {
      newErrors.handle = "Handle là bắt buộc";
    } else if (!handleRegex.test(formData.handle)) {
      newErrors.handle = "Handle chỉ chứa chữ, số, dấu gạch dưới (3-20 ký tự)";
    } else if (formData.handle.length < 3) {
      newErrors.handle = "Handle phải có ít nhất 3 ký tự";
    }

    // ✅ Validate displayName (thay thế firstName + lastName)
    if (!formData.displayName.trim()) {
      newErrors.displayName = "Tên hiển thị là bắt buộc";
    } else if (formData.displayName.trim().length < 2) {
      newErrors.displayName = "Tên hiển thị phải có ít nhất 2 ký tự";
    } else if (formData.displayName.trim().length > 100) {
      newErrors.displayName = "Tên hiển thị không được quá 100 ký tự";
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) {
      newErrors.email = "Email là bắt buộc";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Email không hợp lệ";
    }

    // Validate phone
    const phoneRegex = /^[0-9+\-\s\(\)]{10,15}$/;
    if (!formData.phone) {
      newErrors.phone = "Số điện thoại là bắt buộc";
    } else if (!phoneRegex.test(formData.phone.replace(/\s/g, ""))) {
      newErrors.phone = "Số điện thoại không hợp lệ";
    }

    // Validate date of birth
    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = "Ngày sinh là bắt buộc";
    } else {
      const today = new Date();
      const birthDate = new Date(formData.dateOfBirth);
      const age = today.getFullYear() - birthDate.getFullYear();
      if (age < 13) {
        newErrors.dateOfBirth = "Bạn phải ít nhất 13 tuổi";
      }
    }

    // Validate password
    if (!formData.password) {
      newErrors.password = "Mật khẩu là bắt buộc";
    } else if (formData.password.length < 8) {
      newErrors.password = "Mật khẩu phải có ít nhất 8 ký tự";
    } else if (
      !/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/.test(formData.password)
    ) {
      newErrors.password =
        "Mật khẩu phải chứa chữ hoa, chữ thường, số và ký tự đặc biệt";
    }

    // Validate confirm password
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Xác nhận mật khẩu là bắt buộc";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Mật khẩu xác nhận không khớp";
    }

    // ✅ Validate avatar (optional)
    // if (formData.avatar) {
    //   const maxSize = 5 * 1024 * 1024; // 5MB
    //   const allowedTypes = [
    //     "image/jpeg",
    //     "image/jpg",
    //     "image/png",
    //     "image/webp",
    //   ];

    //   if (formData.avatar.size > maxSize) {
    //     newErrors.avatar = "Kích thước file không được vượt quá 5MB";
    //   } else if (!allowedTypes.includes(formData.avatar.type)) {
    //     newErrors.avatar = "Chỉ chấp nhận file ảnh (JPEG, PNG, WebP)";
    //   }
    // }

    // Validate terms acceptance
    if (!formData.acceptTerms) {
      newErrors.acceptTerms = "Bạn phải đồng ý với điều khoản sử dụng";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (
    field: keyof FormData,
    value: string | boolean | File
  ) => {
    // ✅ Auto-format handle
    if (field === "handle" && typeof value === "string") {
      value = value.toLowerCase().replace(/[^a-z0-9_]/g, "");
    }

    setFormData((prev) => ({ ...prev, [field]: value }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  // ✅ Cleanup URL when component unmounts
  const cleanupPreview = () => {
    if (avatarPreview) {
      URL.revokeObjectURL(avatarPreview);
    }
  };

  // ✅ Handle avatar upload
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Cleanup previous preview
      cleanupPreview();

      setFormData((prev) => ({ ...prev, avatar: file }));

      // Create new preview
      const previewUrl = URL.createObjectURL(file);
      setAvatarPreview(previewUrl);

      // Clear previous avatar error
      if (errors.avatar) {
        setErrors((prev) => ({ ...prev, avatar: undefined }));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    setErrors({});

    try {
      let avatarUrl: string | undefined;

      // // ✅ Upload avatar if provided
      // if (formData.avatar) {
      //   try {
      //     avatarUrl = await authService.uploadAvatar(formData.avatar);
      //   } catch (error) {
      //     console.error("Avatar upload failed:", error);
      //     setErrors({ avatar: "Không thể tải ảnh lên. Vui lòng thử lại." });
      //     setIsLoading(false);
      //     return;
      //   }
      // }

      // ✅ Prepare data theo format mới
      const registerData: RegisterRequest = {
        handle: formData.handle,
        displayName: formData.displayName, // ✅ Thay đổi
        password: formData.password,
        dateOfBirth: formData.dateOfBirth,
        email: formData.email,
        phone: formData.phone,
        avatarUrl, // ✅ Thêm mới
      };

      console.log("Sending register data:", registerData);

      const result = await authService.register(registerData);

      if (result.flag) {
        setIsSuccess(true);
        console.log("Registration successful:", result);
      } else {
        setErrors({ general: result.message });
      }
    } catch (error) {
      console.error("Registration error:", error);
      setErrors({ general: getErrorMessage(error) || "Đã có lỗi xảy ra" });
    } finally {
      setIsLoading(false);
    }
  };

  const getPasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[@$!%*?&]/.test(password)) strength++;

    const strengthLabels = ["Rất yếu", "Yếu", "Trung bình", "Mạnh", "Rất mạnh"];
    const strengthColors = [
      "bg-red-500",
      "bg-orange-500",
      "bg-yellow-500",
      "bg-blue-500",
      "bg-green-500",
    ];

    return {
      level: strength,
      label: strengthLabels[strength - 1] || "Rất yếu",
      color: strengthColors[strength - 1] || "bg-red-500",
    };
  };

  if (isSuccess) {
    return (
      <Card className="w-full max-w-2xl mx-auto border-border bg-card shadow-lg">
        <CardContent className="pt-6">
          <div className="text-center">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-card-foreground mb-2">
              Đăng ký thành công! 🎉
            </h3>
            <p className="text-muted-foreground mb-6">
              Chào mừng <br />
              <span className="font-medium text-primary">
                {formData.displayName}
              </span>
            </p>
            <Button className="w-full" size="lg">
              <Link href="/login">Đăng nhập ngay</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const passwordStrength = getPasswordStrength(formData.password);

  return (
    <Card className="w-full max-w-2xl mx-auto border-border bg-card shadow-lg">
      <CardHeader className="space-y-2 text-center pb-6">
        <CardTitle className="text-2xl font-bold text-card-foreground">
          Tạo tài khoản mới
        </CardTitle>
        <CardDescription className="text-muted-foreground text-base">
          Vui lòng điền đầy đủ thông tin để tạo tài khoản
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {errors.general && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{errors.general}</AlertDescription>
            </Alert>
          )}

          {/* Thông tin cá nhân */}
          <div className="space-y-4">
            <h4 className="text-lg font-medium text-card-foreground border-b pb-2">
              Thông tin cá nhân
            </h4>

            {/* ✅ Avatar Upload */}
            <div className="space-y-2">
              <Label className="text-card-foreground font-medium">
                Ảnh đại diện (tùy chọn)
              </Label>
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center overflow-hidden border-2 border-border">
                  {avatarPreview ? (
                    <Image
                      src={avatarPreview || ""}
                      alt="Avatar preview"
                      className="w-full h-full object-cover"
                      width={80}
                      height={80}
                    />
                  ) : (
                    <User className="w-8 h-8 text-muted-foreground" />
                  )}
                </div>
                <div className="flex-1">
                  <input
                    title="avatar"
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="hidden"
                    id="avatar-upload"
                  />
                  <Label
                    htmlFor="avatar-upload"
                    className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors"
                  >
                    <Upload className="w-4 h-4" />
                    Chọn ảnh
                  </Label>
                  <p className="text-xs text-muted-foreground mt-1">
                    PNG, JPG, WebP (tối đa 5MB)
                  </p>
                </div>
              </div>
              {errors.avatar && (
                <p className="text-sm text-destructive flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.avatar}
                </p>
              )}
            </div>

            {/* ✅ Handle field */}
            <div className="space-y-2">
              <Label
                htmlFor="handle"
                className="text-card-foreground font-medium"
              >
                Handle (Tên người dùng){" "}
                <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <AtSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <input
                  id="handle"
                  type="text"
                  placeholder="vd: john_doe123"
                  value={formData.handle}
                  onChange={(e) => handleInputChange("handle", e.target.value)}
                  className={`w-full pl-10 pr-3 py-2 border rounded-lg bg-input border-border text-card-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors ${
                    errors.handle
                      ? "border-destructive focus:ring-destructive"
                      : ""
                  }`}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Handle dùng để người khác có thể tìm và kết bạn với bạn. Chỉ
                chứa chữ cái, số và dấu gạch dưới.
              </p>
              {errors.handle && (
                <p className="text-sm text-destructive flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.handle}
                </p>
              )}
            </div>

            {/* ✅ Display Name (thay thế firstName + lastName) */}
            <div className="space-y-2">
              <Label
                htmlFor="displayName"
                className="text-card-foreground font-medium"
              >
                Tên hiển thị <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <input
                  id="displayName"
                  type="text"
                  placeholder="Nhập tên hiển thị của bạn"
                  value={formData.displayName}
                  onChange={(e) =>
                    handleInputChange("displayName", e.target.value)
                  }
                  className={`w-full pl-10 pr-3 py-2 border rounded-lg bg-input border-border text-card-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors ${
                    errors.displayName
                      ? "border-destructive focus:ring-destructive"
                      : ""
                  }`}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Tên này sẽ hiển thị cho những người khác trong cuộc trò chuyện.
              </p>
              {errors.displayName && (
                <p className="text-sm text-destructive flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.displayName}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label
                  htmlFor="phone"
                  className="text-card-foreground font-medium"
                >
                  Số điện thoại <span className="text-destructive">*</span>
                </Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <input
                    id="phone"
                    type="tel"
                    placeholder="0123 456 789"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    className={`w-full pl-10 pr-3 py-2 border rounded-lg bg-input border-border text-card-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors ${
                      errors.phone
                        ? "border-destructive focus:ring-destructive"
                        : ""
                    }`}
                  />
                </div>
                {errors.phone && (
                  <p className="text-sm text-destructive flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.phone}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="dateOfBirth"
                  className="text-card-foreground font-medium"
                >
                  Ngày sinh <span className="text-destructive">*</span>
                </Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <input
                    title="dateOfBirth"
                    id="dateOfBirth"
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) =>
                      handleInputChange("dateOfBirth", e.target.value)
                    }
                    className={`w-full pl-10 pr-3 py-2 border rounded-lg bg-input border-border text-card-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors ${
                      errors.dateOfBirth
                        ? "border-destructive focus:ring-destructive"
                        : ""
                    }`}
                  />
                </div>
                {errors.dateOfBirth && (
                  <p className="text-sm text-destructive flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.dateOfBirth}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Thông tin đăng nhập */}
          <div className="space-y-4">
            <h4 className="text-lg font-medium text-card-foreground border-b pb-2">
              Thông tin đăng nhập
            </h4>

            <div className="space-y-2">
              <Label
                htmlFor="email"
                className="text-card-foreground font-medium"
              >
                Email <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <input
                  id="email"
                  type="email"
                  placeholder="example@email.com"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className={`w-full pl-10 pr-3 py-2 border rounded-lg bg-input border-border text-card-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors ${
                    errors.email
                      ? "border-destructive focus:ring-destructive"
                      : ""
                  }`}
                />
              </div>
              {errors.email && (
                <p className="text-sm text-destructive flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.email}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="password"
                className="text-card-foreground font-medium"
              >
                Mật khẩu <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Nhập mật khẩu"
                  value={formData.password}
                  onChange={(e) =>
                    handleInputChange("password", e.target.value)
                  }
                  className={`w-full pl-10 pr-10 py-2 border rounded-lg bg-input border-border text-card-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors ${
                    errors.password
                      ? "border-destructive focus:ring-destructive"
                      : ""
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-muted-foreground hover:text-card-foreground transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>

              {/* Password strength indicator */}
              {formData.password && (
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${passwordStrength.color} transition-all`}
                        style={{
                          width: `${(passwordStrength.level / 5) * 100}%`,
                        }}
                      ></div>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {passwordStrength.label}
                    </span>
                  </div>
                </div>
              )}

              {errors.password && (
                <p className="text-sm text-destructive flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.password}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="confirmPassword"
                className="text-card-foreground font-medium"
              >
                Xác nhận mật khẩu <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Nhập lại mật khẩu"
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    handleInputChange("confirmPassword", e.target.value)
                  }
                  className={`w-full pl-10 pr-10 py-2 border rounded-lg bg-input border-border text-card-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors ${
                    errors.confirmPassword
                      ? "border-destructive focus:ring-destructive"
                      : ""
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-3 text-muted-foreground hover:text-card-foreground transition-colors"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-sm text-destructive flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.confirmPassword}
                </p>
              )}
            </div>
          </div>

          {/* Terms acceptance */}
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <input
                title="dateOfBirth"
                id="acceptTerms"
                type="checkbox"
                checked={formData.acceptTerms}
                onChange={(e) =>
                  handleInputChange("acceptTerms", e.target.checked)
                }
                className="mt-1 h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
              />
              <Label
                htmlFor="acceptTerms"
                className="text-sm text-card-foreground leading-5"
              >
                Tôi đồng ý với{" "}
                <Link
                  href="/terms"
                  className="text-primary hover:underline font-medium"
                >
                  Điều khoản dịch vụ
                </Link>{" "}
                và{" "}
                <Link
                  href="/privacy"
                  className="text-primary hover:underline font-medium"
                >
                  Chính sách bảo mật
                </Link>{" "}
                <span className="text-destructive">*</span>
              </Label>
            </div>
            {errors.acceptTerms && (
              <p className="text-sm text-destructive flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {errors.acceptTerms}
              </p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 py-3 text-base font-medium"
            disabled={isLoading}
            size="lg"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                Đang tạo tài khoản...
              </div>
            ) : (
              "Tạo tài khoản"
            )}
          </Button>
        </form>
      </CardContent>

      <CardFooter className="flex flex-col space-y-4 pt-6">
        <div className="text-center text-sm text-muted-foreground">
          Đã có tài khoản?{" "}
          <Link
            href="/login"
            className="text-primary hover:underline font-medium transition-colors"
          >
            Đăng nhập ngay
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
};

export default RegisterForm;
