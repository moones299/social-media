import type { ReactNode } from "react";
import { Link } from "react-router-dom";

type AuthLayoutProps = {
  children: ReactNode;
  rightImage?: string;
};

export default function AuthLayout({ children, rightImage }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center px-4 py-8">
      <div className="w-full max-w-4xl bg-white rounded-xl shadow-md overflow-hidden grid grid-cols-1 md:grid-cols-2">
        <div className="p-8 md:p-10">
          {children}
        </div>
        <div className="hidden md:flex items-center justify-center bg-white min-h-[320px] p-8" aria-hidden="true">
          {rightImage && (
            <img
              src={rightImage}
              alt=""
              className="max-h-full max-w-full object-contain"
            />
          )}
        </div>
      </div>
      <p className="mt-6 text-center text-sm text-gray-500 max-w-md">
        By clicking continue, you agree to our{" "}
        <Link to="#" className="text-blue-600 underline">
          Terms of Service
        </Link>{" "}
        and{" "}
        <Link to="#" className="text-blue-600 underline">
          Privacy Policy
        </Link>
        .
      </p>
    </div>
  );
}
