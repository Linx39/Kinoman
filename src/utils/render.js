import Abstract from '../view/abstract.js';

const RenderPosition = {
  AFTERBEGIN: 'afterbegin',
  BEFOREEND: 'beforeend',
};

export const createElement = (template) => {
  const newElement = document.createElement('div');
  newElement.innerHTML = template;
  return newElement.firstChild;
};

export const render = (container, element, place = RenderPosition.BEFOREEND) => {
  if (container instanceof Abstract) {
    container = container.getElement();
  }

  if (element instanceof Abstract) {
    element = element.getElement();
  }

  switch (place) {
    case RenderPosition.AFTERBEGIN:
      container.prepend(element);
      break;
    case RenderPosition.BEFOREEND:
      container.append(element);
      break;
  }
};

export const removeComponent = (component) => {
  if (!(component instanceof Abstract)) {
    throw new Error('Can remove only components');
  }

  component.getElement().remove();
  component.removeElement();
};
