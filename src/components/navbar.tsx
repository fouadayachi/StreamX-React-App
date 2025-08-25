import {
  Link,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
} from "@heroui/react";
import { Menu, Search } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom"; // added useLocation

export default function StreamingNavbar() {
  const navigate = useNavigate(); // Initialize navigate hook
  const location = useLocation();
  const path = location.pathname;

  const handleSearchClick = () => {
    // Navigate to the dedicated search page
    navigate("/search");
  };

  return (
    <Navbar isBordered className="bg-black text-white px-4" maxWidth="xl">
      {/* Left Section - Logo */}
      <NavbarBrand>
        <Link
          className="font-bold text-xl text-red-500 cursor-pointer"
          href="/"
        >
          StreamX
        </Link>
      </NavbarBrand>

      {/* Middle Section - Nav Links */}
      <NavbarContent className="hidden md:flex gap-6" justify="center">
        <NavbarItem>
          <Link
            className={`transition-colors ${
              path === "/" ? "text-red-500" : "text-white"
            } hover:text-red-500`}
            href="/"
          >
            Home
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link
            className={`transition-colors ${
              path.startsWith("/movies") ? "text-red-500" : "text-white"
            } hover:text-red-500`}
            href="/movies"
          >
            Movies
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link
            className={`transition-colors ${
              path.startsWith("/series") ? "text-red-500" : "text-white"
            } hover:text-red-500`}
            href="/series"
          >
            Series
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link
            className={`transition-colors ${
              path.startsWith("/myList") ? "text-red-500" : "text-white"
            } hover:text-red-500`}
            href="/myList"
          >
            My List
          </Link>
        </NavbarItem>
      </NavbarContent>

      {/* Right Section - Search, Notifications, User */}
      <NavbarContent className="gap-4" justify="end">
        {/* Search Icon that navigates to search page */}
        <Search
          className="cursor-pointer text-white hover:text-red-500 transition-colors"
          onClick={handleSearchClick}
        />

        {/* Mobile Menu */}
        <Menu className="md:hidden cursor-pointer text-white hover:text-red-500 transition-colors" />
      </NavbarContent>
    </Navbar>
  );
}
