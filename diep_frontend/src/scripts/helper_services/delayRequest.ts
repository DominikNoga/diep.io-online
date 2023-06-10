export const debounce = <T extends (...args: any[]) => void>(callback: T, delay: number): (() => void) => {
    let timeout: number | undefined;
  
    return (...args: Parameters<T>): void => {
      if (timeout) {
        clearTimeout(timeout);
      }
  
      timeout = setTimeout(() => {
        callback(...args);
      }, delay);
    };
};

export const throttle = <T extends (...args: any[]) => void>(callback: T, delay: number) =>{
    let shouldWait = false
    let waitingArgs: Parameters<T>
    const timeoutFunc = () => {
        if (waitingArgs == null) {
        shouldWait = false
        } else {
        callback(...waitingArgs)
        waitingArgs = null
        setTimeout(timeoutFunc, delay)
        }
    }

    return (...args: Parameters<T>) => {
        if (shouldWait) {
        waitingArgs = args
        return
        }

        callback(...args)
        shouldWait = true
        setTimeout(timeoutFunc, delay)
    }
}