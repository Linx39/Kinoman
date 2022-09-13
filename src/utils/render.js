import Abstract from '../view/abstract.js';

const bodyElement = document.querySelector('body');
const HIDE_OVERFLOW_CLASS = 'hide-overflow';

export const RenderPosition = {
  AFTERBEGIN: 'afterbegin',
  BEFOREEND: 'beforeend',
};

export const createElement = (template) => {
  const newElement = document.createElement('div');
  newElement.innerHTML = template;
  return newElement.firstChild;
};

export const render = (container, component, place = RenderPosition.BEFOREEND) => {
  if (container instanceof Abstract) {
    container = container.getElement();
  }

  if (component instanceof Abstract) {
    component = component.getElement();
  }

  switch (place) {
    case RenderPosition.AFTERBEGIN:
      container.prepend(component);
      break;
    case RenderPosition.BEFOREEND:
      container.append(component);
      break;
  }
};

export const remove = (component) => {
  if (component === null) {
    return;
  }

  if (!(component instanceof Abstract)) {
    throw new Error('Can remove only components');
  }

  component.getElement().remove();
  component.removeElement();
};

export const renderPopup = (component) => {
  if (component instanceof Abstract) {
    component = component.getElement();
  }

  bodyElement.appendChild(component);
  bodyElement.classList.add(HIDE_OVERFLOW_CLASS);
};

export const removePopup = (component) => {
  if (component instanceof Abstract) {
    component = component.getElement();
  }

  bodyElement.removeChild(component);
  bodyElement.classList.remove(HIDE_OVERFLOW_CLASS);
};

export const replace = (newChild, oldChild) => {
  if (oldChild instanceof Abstract) {
    oldChild = oldChild.getElement();
  }

  if (newChild instanceof Abstract) {
    newChild = newChild.getElement();
  }

  const parent = oldChild.parentElement;

  if (parent === null || oldChild === null || newChild === null) {
    throw new Error('Can\'t replace unexisting elements');
  }

  parent.replaceChild(newChild, oldChild);
};
