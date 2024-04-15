import {React, useState} from 'react'
import {Navbar, NavbarBrand, NavbarContent, NavbarItem, NavbarMenuToggle, NavbarMenu, NavbarMenuItem, Link, Button} from "@nextui-org/react";
import {Logo} from "./Logo.jsx";
function NavBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  return (
    <div className='bg-indigo-200 w-full h-full p-0 space-y-0'>
    <Navbar maxWidth='full' height="0" >
      <NavbarBrand>
        <Logo/>
        <p className="font-bold text-inherit">Algoritmos de programación dinámica</p>
      </NavbarBrand>
      <NavbarContent justify="end">
        <NavbarItem isActive>
          <Link href="/" aria-current="page">
            Algoritmos
          </Link>
        </NavbarItem>
        <NavbarItem isActive>
          <Link href="/backpack" aria-current="page">
            Contacto
          </Link>
        </NavbarItem>
      </NavbarContent>
    </Navbar>
    </div>
  );
}

export default NavBar