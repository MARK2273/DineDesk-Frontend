// import { useLoginUser } from "@dine-desk/api/user";
// import Button from "@dine-desk/Common/Components/Button";
// import InputField from "@dine-desk/Common/Components/FormField/InputField";
// import PasswordField from "@dine-desk/Common/Components/FormField/PasswordField";
// import { ROUTES } from "@dine-desk/constants/RoutePath";
// import { extractErrors } from "@dine-desk/helper";
// import { storageHelper } from "@dine-desk/helper/storageHelper";
// import { dispatchToast } from "@dine-desk/helper/toastHelper";
// import { loginData, loginSchema } from "@dine-desk/schema/login";
// import { yupResolver } from "@hookform/resolvers/yup";
// import { useForm } from "react-hook-form";
// import { useNavigate } from "react-router-dom";

// const Login = () => {
//   const navigate = useNavigate();
//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//   } = useForm<loginData>({
//     resolver: yupResolver(loginSchema),
//   });

//   const { mutateAsync: loginUser, isPending: isLoginPending } = useLoginUser();

//   const onSubmit = async (data: loginData) => {
//     try {
//       const loginData = await loginUser(data);
//       const storage = storageHelper("session");
//       if (loginData) storage.setItem("token", loginData.token);
//       dispatchToast("success", "Login successful");

//       navigate(ROUTES.DASHBOARD.path);
//     } catch (error: any) {
//       const errors = extractErrors(error);
//       dispatchToast("error", errors || "Something went wrong");
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center p-4">
//       <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
//         <div className="flex flex-col items-center mb-6">
//           <h1 className="text-4xl font-extrabold text-gray-800">Dine Desk</h1>
//           <p className="text-gray-600 mt-2">
//             Sign in to manage your reservations
//           </p>
//         </div>

//         {/* Login Form */}
//         <div className="space-y-4">
//           <InputField
//             label="Email"
//             name="email"
//             register={register}
//             error={errors?.email?.message}
//             placeholder="Enter your email"
//             type="email"
//           />
//           <PasswordField
//             name="password"
//             label="Password"
//             register={register}
//             error={errors?.password?.message}
//             placeholder="Enter your password"
//           />

//           <Button
//             variant="filled"
//             title="Login"
//             onClick={handleSubmit(onSubmit)}
//             isLoading={isLoginPending}
//             className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg cursor-pointer"
//           />
//         </div>

//         {/* Don't have an account? */}
//         <div className="flex items-center justify-center mt-6 gap-2">
//           <p className="text-center text-sm text-gray-500 ">
//             Already have an account?{" "}
//           </p>
//           <div
//             onClick={() => navigate(ROUTES.REGISTER.path)}
//             className="text-blue-600 hover:underline cursor-pointer "
//           >
//             Register
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Login;

import { useLoginUser } from "@dine-desk/api/user";
import Button from "@dine-desk/Common/Components/Button";
import InputField from "@dine-desk/Common/Components/FormField/InputField";
import PasswordField from "@dine-desk/Common/Components/FormField/PasswordField";
import { ROUTES } from "@dine-desk/constants/RoutePath";
import { extractErrors } from "@dine-desk/helper";
import { storageHelper } from "@dine-desk/helper/storageHelper";
import { dispatchToast } from "@dine-desk/helper/toastHelper";
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
      dispatchToast("success", "Login successful");

      navigate(ROUTES.DASHBOARD.path);
    } catch (error: any) {
      const errors = extractErrors(error);
      dispatchToast("error", errors || "Something went wrong");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-yellow-50 via-white to-yellow-100 px-4">
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 bg-white shadow-xl rounded-2xl overflow-hidden">
        {/* Left Side: Branding / Illustration */}
        <div className="hidden md:flex flex-col items-center justify-center bg-yellow-100 p-8">
          <img
            src="/restaurant-icon.svg"
            alt="Restaurant Icon"
            className="w-40 mb-6"
          />
          <h2 className="text-3xl font-bold text-gray-700 text-center">
            Welcome to Dine Desk
          </h2>
          <p className="mt-2 text-gray-600 text-center text-sm px-6">
            Manage your reservations, tables, and guests with ease.
          </p>
        </div>

        {/* Right Side: Login Form */}
        <div className="p-8">
          <div className="mb-6 text-center">
            <h1 className="text-2xl font-semibold text-gray-800">
              Sign In to Your Account
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Enter your credentials to access the dashboard
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
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
              type="submit"
              isLoading={isLoginPending}
              className="w-full bg-yellow-500 hover:bg-yellow-600 text-white py-3 rounded-lg"
            />
          </form>

          <div className="text-sm text-center mt-6">
            <span className="text-gray-500">Don't have an account?</span>{" "}
            <span
              onClick={() => navigate(ROUTES.REGISTER.path)}
              className="text-yellow-600 hover:underline cursor-pointer"
            >
              Register here
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
