import { GalleryVerticalEnd } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useUserStore } from "@/stores/useUserStore";
import axiosInstance from "@/lib/axios";
import toast from "react-hot-toast";

type loginFormProps = React.ComponentProps<"div"> & {
  view?: "sign-in" | "sign-up";
};

type formDataProps = {
  name?: string;
  email: string;
  password: string;
};

export function LoginForm({ className, view, ...props }: loginFormProps) {
  const { userSignup, userLogin } = useUserStore();

  const [isSignupLoading, setIsSignupLoading] = useState(false);
  const [isLoginLoading, setIsLoginLoading] = useState(false);

  const [formData, setFormData] = useState<formDataProps>({
    name: "",
    email: "",
    password: "",
  });

  const validateForm = () => {
    if (!formData.name?.trim()) return toast.error("name is required");
    if (formData.name && formData.name?.length < 3)
      return toast.error("name must be atleast 3 characters long");
    if (!formData.email.trim()) return toast.error("Email is required");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      return toast.error("Invalid Email");
    if (!formData.password.trim()) return toast.error("Password is required");
    if (!/^(?=.*\d).{6,}$/.test(formData.password))
      return toast.error("Weak Password");

    return true;
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (view === "sign-in") {
      const details = {
        email: formData.email,
        password: formData.password,
      };

      try {
        setIsLoginLoading(true);
        const res = await axiosInstance.post(`/users/login`, details);

        if (res.status === 201) {
          const data = res.data;
          userLogin(data.user);
        }

        window.location.reload();
      } catch (err) {
        console.log(err);
      } finally {
        setIsLoginLoading(false);
      }
    } else {
      const success = validateForm();

      if (success === true) {
        const details = {
          name: formData.name,
          email: formData.email,
          password: formData.password,
        };

        try {
          setIsSignupLoading(true);
          const res = await axiosInstance.post(`/users/register`, details);

          if (res.status === 200) {
            const data = res.data;
            userSignup(data.user);
          }

          window.location.reload();
        } catch (err) {
          console.log(err);
        } finally {
          setIsSignupLoading(false);
        }
      }
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <form onSubmit={handleFormSubmit}>
        <div className="flex flex-col gap-6">
          <div className="flex flex-col items-center gap-2">
            <a
              href="#"
              className="flex flex-col items-center gap-2 font-medium"
            >
              <div className="flex size-8 items-center justify-center rounded-md">
                <GalleryVerticalEnd className="size-6" />
              </div>
              <span className="sr-only">Acme Inc.</span>
            </a>
            <h1 className="text-xl font-bold">Welcome to Chatapp</h1>
            <div className="text-center text-sm">
              {view === "sign-in"
                ? "Don't have an account?"
                : "Already have an account?"}{" "}
              <Link
                to={view === "sign-in" ? "/signup" : "/"}
                className="underline underline-offset-4"
              >
                {view === "sign-in" ? "Sign up" : "Login"}
              </Link>
            </div>
          </div>
          <div className="flex flex-col gap-6">
            {view === "sign-up" && (
              <div className="grid gap-3">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  autoComplete={"username"}
                  value={formData?.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  type="text"
                  placeholder="Enter name"
                  required
                />
              </div>
            )}
            <div className="grid gap-3">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                autoComplete={"username"}
                placeholder="m@example.com"
                required
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                autoComplete={"current-password"}
                placeholder="Enter password"
                required
              />
            </div>
            <Button
              disabled={isLoginLoading || isSignupLoading}
              type="submit"
              className="w-full cursor-pointer"
            >
              {view === "sign-in" ? "Login" : "Sign up"}
            </Button>
          </div>
          <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
            <span className="bg-background text-muted-foreground relative z-10 px-2">
              Or
            </span>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Button variant="outline" type="button" className="w-full">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path
                  d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701"
                  fill="currentColor"
                />
              </svg>
              Continue with Apple
            </Button>
            <Button variant="outline" type="button" className="w-full">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path
                  d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                  fill="currentColor"
                />
              </svg>
              Continue with Google
            </Button>
          </div>
        </div>
      </form>
      <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </div>
    </div>
  );
}
