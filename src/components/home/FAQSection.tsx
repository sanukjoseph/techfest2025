import { squidgame } from "@/app/styles/fonts";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const faq = [
  {
    ques: "What is SMASH?",
    ans: "SMASH is the annual techno-cultural fest organized by the MCA Department of SJCET.",
  },
  {
    ques: "When is it conducted?",
    ans: "SMASH 2025 will be conducted on February 27th.",
  },
  {
    ques: "How many events are there?",
    ans: "There are 7 exciting events covering both technical and cultural domains.",
  },
];

export function FAQSection() {
  return (
    <section className="py-16 " id="faq">
      <div className="container mx-auto px-4">
        {/* Heading */}
        <h1
          className={`${squidgame.className} text-center text-4xl md:text-5xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent mb-8`}
        >
          FAQ
        </h1>

        {/* Accordion */}
        <div className="flex justify-center">
          <Accordion type="single" collapsible className="w-full md:w-3/4 lg:w-1/2 space-y-4">
            {faq.map((item, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="border border-gray-700 rounded-lg bg-gray-800/50 hover:bg-gray-800/70 transition-colors duration-300"
              >
                <AccordionTrigger className="p-4 text-left text-lg font-semibold text-gray-200 hover:text-pink-500 transition-colors duration-300">
                  <span>{item.ques}</span>
                </AccordionTrigger>
                <AccordionContent className="p-4 pt-2 text-gray-400">{item.ans}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
