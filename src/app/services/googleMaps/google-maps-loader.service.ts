import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GoogleMapsLoaderService {

  private scriptLoaded: boolean = false;

  load(): Promise<void> {
    if (this.scriptLoaded) {
      return Promise.resolve(); // Return resolved promise if script is already loaded
    }

    return new Promise<void>((resolve, reject) => {
      const script: HTMLScriptElement = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${environment.googleMapsApiKey}`;
      script.async = true;
      script.defer = true;

      // Event handler for successful script loading
      script.onload = (): void => {
        this.scriptLoaded = true;
        resolve();
      };

      // Event handler for script loading errors
      script.onerror = (error): void => reject(new Error('Google Maps API failed to load.'));

      document.head.appendChild(script); // Append script to <head>
    });
  }
}
