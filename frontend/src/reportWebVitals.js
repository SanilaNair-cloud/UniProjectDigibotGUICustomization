// reportWebVitals.js

const reportWebVitals = (onPerfEntry) => {
  if (typeof onPerfEntry === 'function') {
    import('web-vitals').then(({
      getCLS,
      getFID,
      getFCP,
      getLCP,
      getTTFB
    }) => {
      getCLS(onPerfEntry);   // Cumulative Layout Shift
      getFID(onPerfEntry);   // First Input Delay
      getFCP(onPerfEntry);   // First Contentful Paint
      getLCP(onPerfEntry);   // Largest Contentful Paint
      getTTFB(onPerfEntry);  // Time to First Byte
    });
  }
};

export default reportWebVitals;
// This file is used to measure the performance of the app.