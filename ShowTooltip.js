/*

New tooltip.
USAGE:

import ShowTooltip from 'ShowTooltip';

ShowTooltip('text', 'hot key', event); // hotkey is optional
ShowTooltip('text', event);

*/

import './ShowTooltip.css';
let root = document.querySelector('div');

export default function ShowTooltip(text='', a, e) {

  let hotkey = null, event = null, timeouter=null, elem=null;

  if(e) {
    event = e;
    hotkey = a;
  } else {
    if(typeof a === 'object') event = a;
    else {
      console.error('TOOLTIP: You should provide EVENT as the last argument');
      return;
    }
  }

  event.persist();

  const unhover = (e) => {
    root.removeChild(elem)
    elem = null;
    e.target.removeEventListener('mouseleave', unhover);
    clearTimeout(timeouter);
  }

  event.target.addEventListener('mouseleave', unhover);

  elem = document.createElement('div');
  elem.setAttribute('class', 'ShowTooltip');
  elem.setAttribute('style', `left:-3000px;top:-3000px; opacity:0;`);

  elem.innerHTML = text + (hotkey?`<span>${hotkey}</span>`:'');

  const arrow = document.createElement('div');
  arrow.setAttribute('class', 'arrow');

  elem.appendChild(arrow);
  root.appendChild(elem);

  const elemBounds = elem.getBoundingClientRect();
  const documentBounds = document.documentElement.getBoundingClientRect();
  const hoveredElementBounds = event.target.getBoundingClientRect();

  if((hoveredElementBounds.bottom + elemBounds.height + 25) > documentBounds.height) {
    elem.style.top = hoveredElementBounds.top - (elemBounds.height + 15) + 'px';
    arrow.classList.add('bottom');
  } else {
    elem.style.top = hoveredElementBounds.bottom + 15 + 'px';
    arrow.classList.add('top');
  }

  let calculatedLeftPos = hoveredElementBounds.left + hoveredElementBounds.width/2 - elemBounds.width/2

  let arrowOffset = 0;
  if(calculatedLeftPos < 10) {
    arrowOffset = calculatedLeftPos - 10;
    calculatedLeftPos = 10;
  }
  if(calculatedLeftPos + elemBounds.width > documentBounds.width - 10) {
    let m = documentBounds.width - 10 - elemBounds.width;
    arrowOffset = calculatedLeftPos - m;
    calculatedLeftPos = m;
  }

  arrow.style.left = Math.min(elemBounds.width-10 , Math.max(10, (elemBounds.width/2 + arrowOffset))) + 'px';
  elem.style.left = calculatedLeftPos + 'px';
  elem.style.width = elemBounds.width + 'px';

  timeouter = setTimeout(()=>{elem.style.opacity = 1;},500);
}
