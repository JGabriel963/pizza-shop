import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { z } from "zod";
import { toast } from "sonner";
import { Link } from "react-router-dom";

const sigInForm = z.object({
  email: z.string().email(),
});

type SignInForm = z.infer<typeof sigInForm>;

export function SignIn() {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<SignInForm>({});

  async function handleSignIn(data: SignInForm) {
    try {
      await new Promise((resolver) => setTimeout(resolver, 2000));

      toast.success("Enviamos um link de autenticação para seu e-mail.");
    } catch (error) {}
  }

  return (
    <>
      <title>Login | pizza.shop</title>
      <div className="p-8">
        <Button asChild className="absolute right-8 top-8" variant="ghost">
          <Link to="/sign-up">Novo estabelecimento</Link>
        </Button>

        <div className="w-[350px] flex flex-col justify-center gap-6">
          <div className="flex flex-col gap-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              Acessar painel
            </h1>
            <p className="text-sm text-muted-foreground">
              Acompanhe suas vendas pelo painel do pareceiro!
            </p>
          </div>

          <form onSubmit={handleSubmit(handleSignIn)} className="space-y-2">
            <div className="space-y-2">
              <Label htmlFor="email">Seu e-mail</Label>
              <Input id="email" type="email" {...register("email")} />
            </div>
            <Button
              disabled={isSubmitting}
              className={`w-full cursor-pointer disabled:cursor-pointer`}
            >
              Acessar painel
            </Button>
          </form>
        </div>
      </div>
    </>
  );
}
