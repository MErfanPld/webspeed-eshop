import { cn } from "@/lib/utils";

type ContainerProps = {
  children: React.ReactNode;
  className?: string;
  as?: "div" | "section" | "main";
  narrow?: boolean;
};

export default function Container({
  children,
  className,
  as: Tag = "div",
  narrow,
}: ContainerProps) {
  return (
    <Tag
      className={cn(
        "mx-auto w-full px-4 xs:px-5 sm:px-6 lg:px-10",
        narrow ? "max-w-prose" : "max-w-content",
        className
      )}
    >
      {children}
    </Tag>
  );
}
