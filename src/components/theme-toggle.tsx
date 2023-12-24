import * as React from "react";
import { MoonIcon, SunIcon } from "@radix-ui/react-icons";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

const useThemeChange = () => {
  const { setTheme, resolvedTheme } = useTheme();
  const [currentTheme, setCurrentTheme] = React.useState("");
  React.useEffect(() => {
    if (resolvedTheme) {
      setCurrentTheme(resolvedTheme);
    }
  }, [resolvedTheme]);
  return { setTheme, currentTheme };
};

export function ModeToggle() {
  const { setTheme, currentTheme } = useThemeChange();
  if (currentTheme === "") return null;
  switch (currentTheme) {
    case "dark":
      return (
        <div>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setTheme("light")}
          >
            <MoonIcon className="h-[1.2rem] w-[1.2rem]" />
          </Button>
        </div>
      );
    case "light":
      return (
        <div>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setTheme("dark")}
          >
            <SunIcon className="h-[1.2rem] w-[1.2rem] " />
          </Button>
        </div>
      );
    default:
      return null;
  }
}
