// utils/analytics.ts
import ReactGA from 'react-ga4';

export const initGA = (googleMeasurementId: string) => {
    if (!googleMeasurementId) {
        console.error('Google Measurement ID is not defined.');
        return;
    }
    ReactGA.initialize(googleMeasurementId);
};

export const logPageView = (url: string) => {
    ReactGA.send({ hitType: 'pageview', page: url });
};

export const logEvent = (category: string, action: string) => {
    ReactGA.event({ category, action });
};
