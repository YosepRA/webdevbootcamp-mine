function createString(name) {
  // return 'Hello ' + name;
  return { string: 'Hello ' + name };
}

console.log(createString('Joe').string);
