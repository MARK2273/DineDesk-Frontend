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
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <div className="flex flex-col items-center mb-6">
          <h1 className="text-4xl font-extrabold text-gray-800">
            Create an Account
          </h1>
          <p className="text-gray-600 mt-2">
            Sign up to manage your reservations
          </p>
        </div>

        {/* Register Form */}
        <div className="space-y-4">
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
            placeholder="Enter your password"
          />

          <Button
            variant="filled"
            title="Register"
            onClick={handleSubmit(onSubmit)}
            isLoading={isRegisterPending}
            className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg cursor-pointer"
          />
        </div>

        {/* Already have an account? */}
        <div className="flex items-center justify-center mt-6 gap-2">
          <p className="text-center text-sm text-gray-500 ">
            Already have an account?{" "}
          </p>
          <div
            onClick={() => navigate(ROUTES.LOGIN.path)}
            className="text-blue-600 hover:underline cursor-pointer "
          >
            Login here
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
