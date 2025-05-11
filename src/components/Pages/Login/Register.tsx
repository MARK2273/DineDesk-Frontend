import { useCreateUser } from "@dine-desk/api/user";
import Button from "@dine-desk/Common/Components/Button";
import InputField from "@dine-desk/Common/Components/FormField/InputField";
import PasswordField from "@dine-desk/Common/Components/FormField/PasswordField";
import { ROUTES } from "@dine-desk/constants/RoutePath";
import { extractErrors } from "@dine-desk/helper";
import { dispatchToast } from "@dine-desk/helper/toastHelper";
import { registerData, registerSchema } from "@dine-desk/schema/login";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<registerData>({
    resolver: yupResolver(registerSchema),
  });

  const { mutateAsync: registerUser, isPending: isRegisterPending } =
    useCreateUser();

  const onSubmit = async (data: registerData) => {
    try {
      await registerUser(data);
      dispatchToast("success", "User registered successfully");
      navigate(ROUTES.DASHBOARD.path);
    } catch (error: any) {
      const errors: any = extractErrors(error);
      dispatchToast("error", errors || "Something went wrong");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-yellow-50 via-white to-yellow-100 px-4">
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 bg-white shadow-xl rounded-2xl overflow-hidden">
        {/* Left Side: Branding/Illustration - Consistent with Login */}
        <div className="hidden md:flex flex-col items-center justify-center bg-yellow-100 p-8">
          <h2 className="text-3xl font-bold text-gray-700 text-center">
            Join Dine Desk
          </h2>
          <p className="mt-2 text-gray-600 text-center text-sm px-6">
            Start managing your reservations, tables, and guests with ease.
          </p>
        </div>

        {/* Right Side: Register Form */}
        <div className="p-8">
          <div className="mb-6 text-center">
            <h1 className="text-2xl font-semibold text-gray-800">
              Create Your Account
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Fill in your details to get started
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <InputField
              label="Full Name"
              name="username"
              register={register}
              error={errors?.username?.message}
              placeholder="Enter your full name"
            />

            <InputField
              label="Email"
              name="email"
              register={register}
              error={errors?.email?.message}
              placeholder="Enter your email"
              type="email"
            />

            <PasswordField
              name="password"
              label="Password"
              register={register}
              error={errors?.password?.message}
              placeholder="Create a password"
            />

            <Button
              variant="filled"
              title="Register"
              type="submit"
              isLoading={isRegisterPending}
              className="w-full bg-yellow-500 hover:bg-yellow-600 text-white py-3 rounded-lg"
            />
          </form>

          <div className="text-sm text-center mt-6">
            <span className="text-gray-500">Already have an account?</span>{" "}
            <span
              onClick={() => navigate(ROUTES.LOGIN.path)}
              className="text-yellow-600 hover:underline cursor-pointer"
            >
              Login here
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
