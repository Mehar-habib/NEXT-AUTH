import React from "react";
import CardWrapper from "./card-wrapper";

export default function LoginForm() {
  return (
    <CardWrapper
      headerLabel="welcome back"
      backButtonLabel="Don't have an account?"
      backButtonHref="/auth/register"
      showSocial
    >
      Login Form?
    </CardWrapper>
  );
}
