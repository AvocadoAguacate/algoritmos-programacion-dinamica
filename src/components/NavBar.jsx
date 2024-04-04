import {React, useState} from 'react'
import {Navbar, NavbarBrand, NavbarContent, NavbarItem, NavbarMenuToggle, NavbarMenu, NavbarMenuItem, Link, Button} from "@nextui-org/react";
import logo from '../assets/backpack.svg'

function NavBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  return (
    <Navbar>
      <NavbarBrand>
        <img src='../assets/backpack.svg'/>
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
  );
}

export default NavBar