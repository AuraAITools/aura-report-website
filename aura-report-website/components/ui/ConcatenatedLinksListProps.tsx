import { generateKey } from "@/utils/id";
import Link from "next/link";

type ConcatenatedLinksListProps = {
  links: string[];
};
export function ConcatenatedLinksList({ links }: ConcatenatedLinksListProps) {
  return (
    <>
      {links.map((link, idx) => (
        <>
          <Link
            href={link}
            key={generateKey("concatenated_link_list", link, idx.toString())}
            className='underline hover:text-orange-400'
          >
            {link}
          </Link>
          {idx < links.length - 1 && <span className='mx-1'>|</span>}
        </>
      ))}
    </>
  );
}
