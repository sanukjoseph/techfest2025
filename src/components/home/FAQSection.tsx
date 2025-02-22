import { squidgame } from "@/app/styles/fonts";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faq = [
  {
    ques: "What is smash ?",
    ans: "It is a mca fest",
  },
  {
    ques: "When it is conduct ?",
    ans: "On Feb 27",
  },
  {
    ques: "How many events are their ?",
    ans: "Their are 7 events",
  },
];

export function FAQSection() {
  return (
    <div className="m-12" id="faq">
      <h1 className={`${squidgame.className} text-center text-5xl`}>FAQ</h1>
      <div className="flex justify-center pt-4">
        <Accordion
          type="single"
          collapsible
          className="w-full md:w-1/2 flex flex-col gap-4"
        >
          {faq.map((item, index) => (
            <AccordionItem key={index} value={index+"1"}>
              <AccordionTrigger>{item.ques}</AccordionTrigger>
              <AccordionContent>
                {item.ans}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
}
