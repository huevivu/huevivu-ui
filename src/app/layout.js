import { Plus_Jakarta_Sans } from "next/font/google";
import "../styles/index.css";
import "../styles/shared.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata = {
  title: "HueViVu — Plan Your Journey",
  description: "Tell us your travel style and let AI create your perfect Huế itinerary.",
  themeColor: "#FF7F6B",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={jakarta.className}>
      <body>{children}</body>
    </html>
  );
}
