import { useLoginUser } from "@dine-desk/api/user";
import Button from "@dine-desk/Common/Components/Button";
import InputField from "@dine-desk/Common/Components/FormField/InputField";
import PasswordField from "@dine-desk/Common/Components/FormField/PasswordField";
import { ROUTES } from "@dine-desk/constants/RoutePath";
import { storageHelper } from "@dine-desk/helper/storageHelper";
import { loginData, loginSchema } from "@dine-desk/schema/login";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<loginData>({
    resolver: yupResolver(loginSchema),
  });

  const { mutateAsync: loginUser, isPending: isLoginPending } = useLoginUser();

  const onSubmit = async (data: loginData) => {
    try {
      const loginData = await loginUser(data);
      const storage = storageHelper("session");
      if (loginData) storage.setItem("token", loginData.token);

      navigate(ROUTES.DASHBOARD.path);
    } catch (error) {
      console.error("Error logging in:", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <div className="flex flex-col items-center mb-6">
          <h1 className="text-4xl font-extrabold text-gray-800">Dine Desk</h1>
          <p className="text-gray-600 mt-2">
            Sign in to manage your reservations
          </p>
        </div>

        {/* Login Form */}
        <div className="space-y-4">
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
            title="Login"
            onClick={handleSubmit(onSubmit)}
            isLoading={isLoginPending}
            className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg cursor-pointer"
          />
        </div>

        {/* Don't have an account? */}
        <div className="flex items-center justify-center mt-6 gap-2">
          <p className="text-center text-sm text-gray-500 ">
            Already have an account?{" "}
          </p>
          <div
            onClick={() => navigate(ROUTES.REGISTER.path)}
            className="text-blue-600 hover:underline cursor-pointer "
          >
            Register
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
