import { Link } from "react-router-dom";
import { navbar, navLink, button } from "../ui/utils";
import { color, radius } from "../ui/tokens";

export default function Navbar() {
  return (
    <nav style={navbar}>
      <div style={{ fontWeight: 700, fontSize: 18 }}>AIAS</div>

      <div style={{ display: "flex", gap: 16 }}>
        <Link to="/" style={navLink}>Home</Link>
        <Link to="/resources" style={navLink}>Resources</Link>
        <Link to="/events" style={navLink}>Events</Link>
        <Link to="/members" style={navLink}>Members</Link>
        <Link to="/about" style={navLink}>About</Link>
        <Link to="/contact" style={navLink}>Contact</Link>
      </div>

      <Link to="/login" style={button("primary")}>Login</Link>
    </nav>
  );
}
