import { GOOGLE_CLIENT_ID } from "@dine-desk/constants/credentials";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";

const Login = () => {
  const handleSuccess = (response: any) => {
    console.log("Login Success:", response);
  };

  const handleError = () => {
    console.log("Login Failed");
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
        <div className="space-y-6">
          <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
            <div className="flex justify-center">
              <GoogleLogin
                onSuccess={handleSuccess}
                onError={handleError}
                useOneTap
                theme="filled_blue"
                size="large"
                text="signin_with"
                shape="pill"
              />
            </div>
          </GoogleOAuthProvider>
          <p className="text-center text-sm text-gray-500">
            By signing in, you agree to our{" "}
            <a href="#" className="text-blue-600 hover:underline">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="text-blue-600 hover:underline">
              Privacy Policy
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
