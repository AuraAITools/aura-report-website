export type SidebarShelfItemProps = {
  icon: React.ReactNode;
  href: string;
};

export default function SidebarShelfItem({
  icon,
  href,
}: SidebarShelfItemProps) {
  return (
    <a
      className="flex justify-center p-2 items-center md:size-6 rounded-md hover:bg-orange-400 hover:text-white"
      href={href}
    >
      <div>{icon}</div>
    </a>
  );
}
