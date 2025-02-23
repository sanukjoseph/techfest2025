import { squidgame } from "@/app/styles/fonts";
import Link from "next/link";

const support = [
  {
    type: "Technical Support",
    numbers: [
      {
        label: "+91 62385 68784",
        href: "tel:+916238568784",
      },
      {
        label: "+91 81369 45810",
        href: "tel:+918136945810",
      },
    ],
  },
  {
    type: "General Support",
    numbers: [
      {
        label: "+91 77365 58377",
        href: "tel:+917736558377",
      },
      {
        label: "+91 98955 10801",
        href: "tel:+919895510801",
      },
    ],
  },
];

function Footer() {
  return (
    <footer className=" py-12 ">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-center space-y-8">
          <h2
            className={`${squidgame.className} text-3xl md:text-4xl bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent`}
          >
            🚀 TECHSPHERE
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-2xl">
            {support.map((supportType, index) => (
              <div key={index} className="flex flex-col items-center space-y-3">
                <p className="text-gray-400 font-medium">{supportType.type}</p>
                {supportType.numbers.map((number, idx) => (
                  <a
                    key={idx}
                    href={number.href}
                    className="text-pink-500 hover:text-purple-600 transition-colors duration-300 font-semibold"
                  >
                    {number.label}
                  </a>
                ))}
              </div>
            ))}
          </div>
          <div className="flex space-x-6">
            <Link href="/terms-and-conditions" className="text-gray-400 hover:text-pink-500 transition-colors duration-300 font-medium">
              Terms & Conditions
            </Link>
            <Link href="/terms-and-conditions" className="text-gray-400 hover:text-pink-500 transition-colors duration-300 font-medium">
              Privacy Policy
            </Link>
          </div>
          <p className="text-gray-500 text-sm">&copy; {new Date().getFullYear()} TECHSPHERE. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
