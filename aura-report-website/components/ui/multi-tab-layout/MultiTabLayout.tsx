import { Cross1Icon } from "@radix-ui/react-icons";
import * as Tabs from "@radix-ui/react-tabs";

type MultiTabLayoutProps = {
  tabData: {
    value: string;
    tabTitle: React.ReactNode;
    content: React.ReactNode;
    key: string;
    onCrossIconClick: () => void;
  }[];
  onClick?: () => void;
  maxTabs: number;
  buttonTitle: string;
};
export default function MultiTabLayout(props: MultiTabLayoutProps) {
  return (
    <Tabs.Root defaultValue={props.tabData.at(0)?.value}>
      <Tabs.List className='flex shrink-0'>
        {props.tabData.map((tab) => (
          <div key={tab.key} className='relative flex-1 flex'>
            <Tabs.Trigger
              value={tab.value}
              className='text-gray-400 select-none hover:text-orange-400 flex h-[45px] w-full items-center justify-center px-5 text-[15px] leading-none outline-none rounded-t-xl data-[state=active]:text-orange-400 data-[state=active]:shadow-[inset_0_-1px_0_0,0_1px_0_0] data-[state=active]:shadow-current'
              asChild
            >
              <div>{tab.tabTitle}</div>
            </Tabs.Trigger>
            <RemoveTabsButton
              currTabsNumber={props.tabData.length}
              onClick={tab.onCrossIconClick}
            />
          </div>
        ))}
        <AddTabButton {...props} />
      </Tabs.List>
      {props.tabData.map((tab) => (
        <Tabs.Content value={tab.value} key={tab.key}>
          {tab.content}
        </Tabs.Content>
      ))}
    </Tabs.Root>
  );
}

function AddTabButton(props: MultiTabLayoutProps) {
  return (
    <>
      {props.tabData.length < props.maxTabs && (
        <button
          type='button'
          onClick={props.onClick}
          className='text-gray-400 hover:border-orange-400 hover:text-orange-400 rounded-full border-[1.5px] border-gray-400 p-2 mx-4 max-w-[300px]'
        >
          {props.buttonTitle}
        </button>
      )}
    </>
  );
}

function RemoveTabsButton({
  currTabsNumber,
  onClick,
}: {
  currTabsNumber: number;
  onClick: () => void;
}) {
  return (
    <>
      {currTabsNumber > 1 && (
        <Cross1Icon
          onClick={onClick}
          className='absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-500'
        />
      )}
    </>
  );
}
