import { Plus_Jakarta_Sans } from "next/font/google";
import "../styles/index.css";
import "../styles/shared.css";
import "../styles/app-shell.css";
import BottomNav from "@/components/layout/BottomNav";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: '--font-jakarta',
});

export const metadata = {
  title: "HueViVu — Plan Your Journey",
  description: "Tell us your travel style and let AI create your perfect Huế itinerary.",
};

export const viewport = {
  themeColor: "#FF7F6B",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${jakarta.variable} ${jakarta.className}`}>
      <body>
        {children}
        <BottomNav />
      </body>
    </html>
  );
}
