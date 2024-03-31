import {
  animate,
  keyframes,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';

export const ScoreChangeAnimation = trigger('scoreChange', [
  state(
    'unchanged',
    style({
      opacity: 1,
      transform: 'scaleY(1)',
      transformOrigin: 'bottom',
    }),
  ),
  state(
    'changed',
    style({
      opacity: 1,
      transform: 'scaleY(1)',
      transformOrigin: 'bottom',
    }),
  ),
  transition('* => *', [
    animate(
      '0.2s',
      keyframes([
        style({ opacity: 1, transform: 'scaleY(1)', offset: 0 }),
        style({ opacity: 0, transform: 'scaleY(0)', offset: 0.5 }),
        style({ opacity: 0, transform: 'scaleY(0)', offset: 0.51 }),
        style({ opacity: 1, transform: 'scaleY(1)', offset: 1.0 }),
      ]),
    ),
  ]),
]);

export const RevealHideAnimation = trigger('visibilityChange', [
  state(
    'visible',
    style({
      opacity: 1,
      transform: 'scaleY(1)',
    }),
  ),
  state(
    'invisible',
    style({
      opacity: 0,
      transform: 'scaleY(0)',
    }),
  ),
  transition('invisible => visible', animate('200ms ease-in')),
  transition('visible => invisible', animate('200ms ease-out')),
]);
