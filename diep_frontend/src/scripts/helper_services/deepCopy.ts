export function deepCopy(obj: any) {
    if (typeof obj !== 'object' || obj === null) {
      return obj;
    }
  
    let copy: any | undefined;
    if (Array.isArray(obj)) {
      copy = [];
      obj.forEach((item, index) => {
        copy[index] = deepCopy(item);
      });
    } else {
      copy = {};
      Object.keys(obj).forEach((key) => {
        copy[key] = deepCopy(obj[key]);
      });
    }
  
    return copy;
  }