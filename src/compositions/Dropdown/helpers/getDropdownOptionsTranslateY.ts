export const getDropdownOptionsTranslateY = (
  optionsHeight: number,
  wrapperY: number,
  activeIndex: number,
  optionsLength: number,
) => {
  const paddingTop = 16;
  const overflow = Math.max(0, optionsHeight - (wrapperY - paddingTop));

  const minTranslateY = ((optionsHeight - overflow) / optionsHeight) * -100;
  const translateY = activeIndex * -(100 / optionsLength);

  return Math.max(minTranslateY, translateY);
};
