function debounce(func, wait) {
  let inDebounce;
  return function () {
    const context = this;
    const args = arguments;

    // setTimeout이 실행된 Timeout의 ID를 반환하고, clearTimeout()으로 이를 해제할 수 있음을 이용
    clearTimeout(inDebounce);

    inDebounce = setTimeout(() => func.apply(context, arguments), wait);
  };
}
