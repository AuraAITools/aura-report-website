import * as Avatar from "@radix-ui/react-avatar";

export type AvatarProfileProps = {
  src: string;
  alt: string;
  fallback: string;
};
export function AvatarProfile({ src, alt, fallback }: AvatarProfileProps) {
  return (
    <div className='flex justify-center items-center'>
      <Avatar.Root className='inline-flex size-[35px] select-none items-center justify-center overflow-hidden rounded-full align-middle shadow-lg'>
        <Avatar.Image
          className='size-full rounded-[inherit] object-cover'
          src={src}
          alt={alt}
        />
        <Avatar.Fallback
          className='leading-1 flex size-full items-center justify-center bg-orange-300 text-[12px] font-medium'
          delayMs={600}
        >
          {fallback}
        </Avatar.Fallback>
      </Avatar.Root>
    </div>
  );
}
