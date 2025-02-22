"use client";
import { Menu } from "lucide-react";
import React from "react";
import {
  Sheet,
  SheetContent,
  // SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
// import { Separator } from "../ui/separator";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "../ui/navigation-menu";
import { Button } from "../ui/button";
import Link from "next/link";
import { squidgame } from "@/app/styles/fonts";
// import { ToggleTheme } from "./toggle-theme";
// import Image from "next/image";

interface RouteProps {
  href: string;
  label: string;
}

// interface FeatureProps {
//   title: string;
//   description: string;
// }

const routeList: RouteProps[] = [
  {
    href: "/",
    label: "Home",
  },
  {
    href: "/events",
    label: "Events",
  },
  {
    href: "/#about",
    label: "About",
  },
  {
    href: "/#faq",
    label: "FAQ",
  },
];

export const Navbar = () => {
  // console.log(session);

  const [isOpen, setIsOpen] = React.useState(false);
  return (
    <header className="shadow-lg backdrop-filter backdrop-blur-sm  bg-pink-400/10 w-[90%] md:w-[70%] lg:w-[75%] lg:max-w-screen-xl top-5 mx-auto sticky border-0 border-pink-950 z-50 rounded-2xl flex justify-between items-center p-2">
      <Link
        href="/"
        className={`${squidgame.className} font-normal text-lg flex items-center text-pink-600`}
      >
        {/* <ChevronsDown className="bg-gradient-to-tr border-secondary from-primary via-primary/70 to-primary rounded-lg w-9 h-9 mr-2 border text-white" /> */}
        SMASH
      </Link>
      {/* <!-- Mobile --> */}
      <div className="flex items-center lg:hidden">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Menu
              onClick={() => setIsOpen(!isOpen)}
              className="cursor-pointer lg:hidden"
            />
          </SheetTrigger>

          <SheetContent
            side="left"
            className="flex flex-col justify-between rounded-tr-2xl rounded-br-2xl bg-black border-secondary"
          >
            <div>
              <SheetHeader className="mb-4 ml-4">
                <SheetTitle className="flex items-center">
                  <Link href="/" className={`${squidgame.className} flex items-center`}>
                    {/* <ChevronsDown className="bg-gradient-to-tr border-secondary from-primary via-primary/70 to-primary rounded-lg w-9 h-9 mr-2 border text-white" /> */}
                    SMASH
                  </Link>
                </SheetTitle>
              </SheetHeader>

              <div className="flex flex-col gap-2">
                {routeList.map(({ href, label }) => (
                  <Button
                    key={href}
                    onClick={() => setIsOpen(false)}
                    asChild
                    variant="ghost"
                    className="justify-start text-base"
                  >
                    <Link className="font-normal" href={href}>
                      {label}
                    </Link>
                  </Button>
                ))}
              </div>
            </div>

            {/* <SheetFooter className="flex-col sm:flex-col justify-start items-start">
              <Separator className="mb-2" />
              <Button
                asChild
                size="sm"
                variant={"outline"}
                className=" px-6 py-5 border border-pink-500 rounded-lg text-lg hover:bg-pink-950 transition"
              >
                <Link aria-label="Register in Now" href="/registration">
                  Register now
                </Link>
              </Button>
              <ToggleTheme />
            </SheetFooter> */}
          </SheetContent>
        </Sheet>
      </div>

      {/* <!-- Desktop --> */}
      <NavigationMenu className="hidden lg:block mx-auto">
        <NavigationMenuList>
          <NavigationMenuItem>
            {routeList.map(({ href, label }) => (
              <NavigationMenuLink key={href} asChild>
                <Link href={href} className="text-base px-2">
                  {label}
                </Link>
              </NavigationMenuLink>
            ))}
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>

      {/* <div className="hidden lg:flex items-center">
        <Button
          asChild
          size="sm"
          variant={"outline"}
          className=" px-4 py-3 border border-pink-500 rounded-lg text-sm hover:bg-pink-950 transition"
        >
          <Link aria-label="Register in Now" href="/registration">
            Register now
          </Link>
        </Button>
      </div> */}
    </header>
  );
};
