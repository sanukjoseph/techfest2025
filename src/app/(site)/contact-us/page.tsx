import React from "react";

const page = () => {
  return (
    <section className="container mx-auto px-4 py-16 h-screen text-white">
      <div className="grid md:grid-cols-1 gap-12">
        <div className="space-y-8">
          <h1 className="text-4xl font-bold text-white mb-4">Contact Us</h1>
          <div>
            <h2 className="text-2xl font-semibold text-pink-500 mb-2">Payment-Related Queries</h2>
            <p className="text-gray-300">
              If you have any issues with payments, such as failed transactions or payment success but not registered, please contact:
            </p>
            <ul className="mt-4 space-y-2">
              <li>
                <strong>Aswin K O: </strong>{" "}
                <a
                  href="mailto:aswinko2025@mca.sjcetpalai.ac.in
"
                  className="text-pink-400 underline"
                >
                  aswinko2025@mca.sjcetpalai.ac.in
                </a>{" "}
                |{" "}
                <a href="tel:+918136945810" className="text-pink-500">
                  8136945810{" "}
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-pink-500 mb-2">Other Queries</h2>
            <p className="text-gray-300">For general questions about the event, please reach out to:</p>
            <ul className="mt-4 space-y-2">
              <li>
                <strong>Sreyas Sathesh</strong>{" "}
                <a
                  href="mailto:sreyassathesh2025@mca.sjcetpalai.ac.in
"
                  className="text-pink-400 underline"
                >
                  sreyassathesh2025@mca.sjcetpalai.ac.in
                </a>{" "}
                |{" "}
                <a href="tel:+919567390993" className="text-pink-400 underline">
                  9567390993{" "}
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-pink-500 mb-2">Faculty Coordinator</h2>
            <p className="text-gray-300">For any special queries, feel free to contact the project manager.</p>
            <p className="mt-4">
              <strong>Akhil Sekharan</strong>{" "}
              <a href="mailto:akhil.sekharan@sjcetpalai.ac.in" className="text-pink-400 underline">
                akhil.sekharan@sjcetpalai.ac.in
              </a>{" "}
              |{" "}
              <a href="tel:+918547629557" className="text-pink-400 underline">
                +91 85476 29557{" "}
              </a>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default page;
