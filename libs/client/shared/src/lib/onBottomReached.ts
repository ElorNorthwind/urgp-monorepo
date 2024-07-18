type OnBottomReachedProps = {
  callback: () => void;
  containerRefElement?: HTMLDivElement | null | HTMLElement;
  disabled?: boolean; // isFetching | totalFetched >= totalAvaliable
  margin?: number;
};

export const onBottomReached = ({
  callback,
  containerRefElement,
  disabled,
  margin = 500,
}: OnBottomReachedProps) => {
  if (containerRefElement) {
    const { scrollHeight, scrollTop, clientHeight } = containerRefElement;
    if (scrollHeight - scrollTop - clientHeight < margin && !disabled) {
      callback();
    }
  }
};
