
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.6bf66430ca1941e892321a7d2517025f',
  appName: 'smart-home-survey-app',
  webDir: 'dist',
  server: {
    url: "https://6bf66430-ca19-41e8-9232-1a7d2517025f.lovableproject.com?forceHideBadge=true",
    cleartext: true
  },
  android: {
    buildOptions: {
      keystorePath: undefined,
      keystoreAlias: undefined,
    }
  }
};

export default config;
