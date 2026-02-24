import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Home, Bell, User, Moon, Sun, LogOut } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

// ---------- Nav Link ----------
interface NavLinkProps {
  to: string;
  icon: React.ReactNode;
  label: string;
}

function NavLink({ to, icon, label }: NavLinkProps) {
  return (
    <Link
      to={to}
      className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-[#171717] dark:text-[#FAFAFA] hover:opacity-70 transition-opacity duration-200"
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
}

// ---------- Theme Toggle ----------
function ThemeToggle({
  isDark,
  onToggle,
}: {
  isDark: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      onClick={onToggle}
      aria-label="Toggle theme"
      className="w-9 h-9 flex items-center justify-center rounded-md border border-[#e5e5e5] dark:border-[#262626] shadow-sm dark:shadow-none text-[#171717] dark:text-[#FAFAFA] bg-transparent hover:opacity-70 transition-opacity duration-200 focus:outline-none"
    >
      {isDark ? <Moon size={16} /> : <Sun size={16} />}
    </button>
  );
}

// ---------- Header ----------
export default function Header() {
  const { user, logout } = useAuth();
  const isAuthenticated = !!user;
  const navigate = useNavigate();

  const [isDark, setIsDark] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return (
      localStorage.getItem("theme") === "dark" ||
      (!localStorage.getItem("theme") &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
    );
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);

  const toggleTheme = () => setIsDark((prev: boolean) => !prev);

  const handleSignOut = async () => {
    await logout();
    navigate("/sign-in");
  };

  return (
    <header className="w-full sticky top-0 z-50 bg-white dark:bg-[#0A0A0A] border-b border-[#E5E5E5] dark:border-[#262626] transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-8 h-[65px] flex items-center justify-between">
        <Link
          to="/home"
          className="font-bold text-lg text-[#171717] dark:text-[#FAFAFA] tracking-normal hover:opacity-80 transition-opacity"
        >
          Socially
        </Link>

        <nav className="flex items-center gap-2">
          <ThemeToggle isDark={isDark} onToggle={toggleTheme} />

          {isAuthenticated ? (
            <>
              <NavLink to="/home" icon={<Home size={16} />} label="Home" />
              <NavLink
                to="/notifications"
                icon={<Bell size={16} />}
                label="Notification"
              />
              <NavLink
                to="/profile"
                icon={<User size={16} />}
                label="Profile"
              />
              <button
                onClick={handleSignOut}
                aria-label="Log out"
                className="w-9 h-9 flex items-center justify-center rounded-lg text-[#171717] dark:text-[#FAFAFA] hover:opacity-70 transition-opacity duration-200 focus:outline-none"
              >
                <LogOut size={16} />
              </button>
            </>
          ) : (
            <>
              <NavLink to="/home" icon={<Home size={16} />} label="Home" />
              <Link
                to="/sign-in"
                className="ml-1 px-4 py-1.5 rounded-md text-sm font-medium bg-[#0A0A0A] text-[#FAFAFA] dark:bg-[#FAFAFA] dark:text-[#171717] hover:opacity-80 transition-opacity duration-200"
              >
                Sign In
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
