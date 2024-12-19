import CardWrapper from "./cardWrapper";

function LoginForm() {
  return (
    <CardWrapper
      headerLabel="Welcome back"
      backButtonLabel="don't have an account?"
      backButtonHref="/auth/register"
      showSocial
    >
      Login form
    </CardWrapper>
  );
}

export default LoginForm;
