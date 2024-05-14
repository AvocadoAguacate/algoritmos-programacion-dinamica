import { React, useState } from "react";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
  Link,
  Button,
} from "@nextui-org/react";
import { Logo } from "./Logo.jsx";
function NavBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  return (
    <div className="w-full h-full p-0 space-y-0">
      <Navbar
        className="w-full bg-gradient-to-b from-lime-800 to-lime-500"
        maxWidth="full"
      >
        <NavbarBrand>
          <Logo />
          <p className="text-white font-bold text-inherit ml-5">
            Algoritmos de programación dinámica
          </p>
        </NavbarBrand>
        <NavbarContent justify="end">
          <NavbarItem isActive>
            <Link className="text-white" href="/" aria-current="page">
              Algoritmos
            </Link>
          </NavbarItem>
          <NavbarItem isActive>
            <Link className="text-white" href="/backpack" aria-current="page">
              Contacto
            </Link>
          </NavbarItem>
        </NavbarContent>
      </Navbar>
    </div>
  );
}

export default NavBar;
