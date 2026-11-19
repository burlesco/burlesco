// Shared by the Globo magazines and newspaper the extension unlocks before
// their scripts run: O Globo, Época and Casa e Jardim.

// The paywall script checks this flag.
export const noPaywall = () => {
  window.hasPaywall = false;
};
