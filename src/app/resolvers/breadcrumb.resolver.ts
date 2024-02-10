import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Breadcrumb } from '../services/breadcrub.service';

export function breadcrumbResolver(
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
): Breadcrumb[] {
  let path = state.url;
  let caption = path.split('/').pop() || '';

  if (route.params && route.params['id']) {
    path = path.replace(':id', route.params['id']);
    caption += ' ' + route.params['id'];
  }

  const breadcrumb: Breadcrumb = {
    routerLink: path,
    caption: caption.charAt(0).toUpperCase() + caption.slice(1),
  };

  console.log('Breadcrumbs Resolver: ', [breadcrumb]);

  return [breadcrumb];
}
