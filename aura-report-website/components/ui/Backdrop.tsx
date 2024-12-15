export type BackdropProps = {
  onClick: () => void;
};
export function BackDrop({ onClick }: BackdropProps) {
  return (
    <div
      onClick={onClick}
      className='z-1 fixed bg-black top-0 left-0 w-full h-full pointer-events-auto opacity-50'
    />
  );
}
