"use client";

import { Card, CardHeader, CardContent, CardFooter } from "../ui/card";

interface CardWrapperProps {
  children: React.ReactNode;
  headerLabel: string;
  backButtonLabel: string;
  backButtonHref: string;
  showSocial?: boolean;
}
export default function CardWrapper({
  children,
  headerLabel,
  backButtonLabel,
  backButtonHref,
  showSocial,
}: CardWrapperProps) {
  return <Card className="w-[400px] shadow-md">{children}</Card>;
}
