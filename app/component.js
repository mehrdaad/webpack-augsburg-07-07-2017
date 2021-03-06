export default (text = 'Hello world again') => {
  const element = document.createElement('div');

  element.innerHTML = text;

  element.onclick = () => {
    import('./lazy').then((lazy) => {
      element.innerHTML = lazy.default;
    }).catch((err) => {
      console.error(err);
    });
  };

  return element;
};
