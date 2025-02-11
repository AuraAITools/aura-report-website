import * as Avatar from "@radix-ui/react-avatar";

export type AvatarProfileProps = {
  profileUrl?: string;
  name: string;
  fallback: string;
};
export function AvatarProfile({
  profileUrl,
  name,
  fallback,
}: AvatarProfileProps) {
  return (
    <Avatar.Root className='inline-flex size-[28px] select-none items-center justify-center overflow-hidden rounded-full align-middle ring-1 ring-orange-300'>
      <Avatar.Image
        className='size-full rounded-[inherit] object-cover'
        src={profileUrl}
        alt={name}
      />
      <Avatar.Fallback
        className='flex size-full items-center justify-center text-[12px] font-medium'
        delayMs={600}
      >
        {getFirstCharactersInUpperCase(name)}
      </Avatar.Fallback>
    </Avatar.Root>
  );
}
function getFirstCharactersInUpperCase(name: string) {
  return name
    .split(" ")
    .map((c) => c.at(0))
    .join()
    .toUpperCase();
}
