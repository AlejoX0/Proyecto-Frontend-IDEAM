import { provideRouter } from '@angular/router';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { routes } from './app.routes';
import { jwtInterceptor } from './core/interceptors/jwt.interceptor';
import { provideAnimations } from '@angular/platform-browser/animations';

export const appConfig = {
  providers: [
    // HTTP client con fetch y el interceptor funcional
    provideHttpClient(
      withFetch(),
      withInterceptors([jwtInterceptor])
    ),
    provideRouter(routes),
    provideAnimations(),
  ],
};
