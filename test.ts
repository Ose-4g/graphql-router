function printVal(...nums: number[]): void;
function printVal(val: string): void;

function printVal(...val: unknown[]) {
  if (!val) throw new Error('argument is required');
  if (val.length === 0) throw new Error('argument is required');
  if (typeof val[0] === 'string') {
    console.log(val[0]);
  } else if (typeof val[0] === 'number') {
    console.log(val);
  } else {
    throw new Error('invalid argument');
  }
}

printVal('ose4g');
