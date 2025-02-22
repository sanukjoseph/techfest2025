import React from "react";

const page = () => {
  return (
    <section className="container mx-auto px-4 py-16">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8">Terms and Conditions</h1>
        <p className="text-lg text-gray-500 mb-6 text-justify">
          Please read these terms and conditions carefully before using our services. By accessing or using our platform, you agree to
          comply with the following terms and conditions.
        </p>
        <ul className="space-y-4 text-gray-500 text-justify">
          <li>
            <strong className="text-gray-400 ">Acceptance of Terms:</strong> By accessing and utilizing the website and services provided by
            St Josephs College of Engineering and Technology, Palai, Smash 1.0 Owner, you acknowledge and agree to comply with these Terms
            and Conditions. If you do not agree with any part of these terms, ple ase refrain from using the website.
          </li>
          <li>
            <strong className="text-gray-400">Cancelication and Refund Policy: </strong>
            All payments are non-refundable. Refunds will not be issued under any circumstances, including event cancellations, missed
            attendance, or schedule changes.
          </li>

          <li>
            <strong className="text-gray-400">Definitions:</strong> Owner, Us, We refers to Smash 1.0, encompassing its creator, operator,
            and publisher, as well as all employees and affiliates. You refers to the user of the website and services.
          </li>
          <li>
            <strong className="text-gray-400">Responsibility for Double Booking:</strong> The customer acknowledges and agrees that it is
            their sole responsibility to ensure they do not book the same event more than once. Smash Team (hereinafter referred to as we,
            us, our) will not be liable for any instances where a customer books the same event multiple times, either through our platform
            or across different platforms.
          </li>
          <li>
            <strong className="text-gray-400">User Obligations: </strong> You are responsible for understanding and adhering to these Terms
            and Conditions, along with all applicable laws and regulations. Failure to comply may result in the termination of your access
            to the website and services.
          </li>
          <li>
            <strong className="text-gray-400">Additional Terms:</strong> Certain services offered on the website may be subject to
            supplementary terms and conditions. Your use of such services constitutes acceptance of these additional terms, forming a
            contractual agreement between you and the Owner.
          </li>
          <li>
            <strong className="text-gray-400">Termination of Access:</strong> The Owner reserves the right to terminate or suspend your
            access to the website and services, without notice, in the event of a breach of these Terms and Conditions. Any disputes arising
            from the use of the website and services shall be resolved through negotiation and, if necessary, legal proceedings.
          </li>
          <li>
            <strong className="text-gray-400">Modification of Terms:</strong> The Owner reserves the right to modify, update, or change
            these Terms and Conditions at any time without prior notice. It is your responsibility to regularly review the terms. Continued
            use of the website following modifications implies your acceptance of the updated terms.
          </li>
          <li>
            <strong className="text-gray-400">Shipping and Delivery: </strong>
            All digital services and event registrations are delivered electronically. No physical shipment is involved. Users will receive
            confirmation and necessary access details via email upon successful registration or purchase. If you do not receive confirmation
            within 24 hours, please contact us at
            <a href="mailto:mca@sjcetpalai.ac.in" className="text-blue-600 underline">
              {" "}
              mca@sjcetpalai.ac.in
            </a>
            .
          </li>
          <li>
            <strong className="text-gray-400">Privacy Policy: </strong>This page outlines our policies concerning the collection, use, and
            disclosure of information obtained from users of the site. By utilizing this site, you consent to the collection and utilization
            of information as per this policy. We solely collect the information voluntarily provided by users, ensuring the minimum
            necessary personal data is obtained to fulfill the intended purpose of the interaction. All data gathered from users will be
            passed on annually to the succeeding Techsphere team of coordinators. This transfer aims to aid in the development of new
            services or enhancements to existing ones, as well as to keep users informed and updated about events and information pertinent
            to Smash. Your privacy is of utmost importance, and we are committed to handling your information responsibly. If you have any
            inquiries or concerns regarding our privacy practices, please contact us using the provided contact details.
          </li>
        </ul>
        <p className="mt-8 text-white">
          For inquiries or concerns regarding these Terms and Conditions, please contact Smash 1.0 at{" "}
          <a href="mailto:mca@sjcetpalai.ac.in" className="text-blue-600 underline">
            mca@sjcetpalai.ac.in
          </a>
          .
        </p>
      </div>
    </section>
  );
};

export default page;
