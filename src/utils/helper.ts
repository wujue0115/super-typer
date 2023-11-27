export function delayCallback(
  callback: (resolve: any, reject: any) => void,
  delay: number
) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      callback(resolve, reject);
    }, delay);
  });
}
