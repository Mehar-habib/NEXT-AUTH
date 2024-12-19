import { cn } from "@/lib/utils";

interface HeadrerProps {
  label: string;
}

const Header = ({ label }: HeadrerProps) => {
  return (
    <div className="w-full flex flex-col gap-y-4 items-center justify-center">
      <h1 className={cn("text-3xl font-semibold")}>🔏 Auth</h1>
      <p className="text-muted-foreground">{label}</p>
    </div>
  );
};

export default Header;
