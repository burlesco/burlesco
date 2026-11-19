// Shared by the Sites behind the fivewall paywall: Jornal NH, Jornal VS and
// Diário de Canoas.

export const FIVEWALL = '*://*.fivewall.com.br/*';

// fivewall's own hosts, kept from the userscript's @match lines. These Rules
// have no page code, so nothing runs there.
export const FIVEWALL_MATCHES = [FIVEWALL];
