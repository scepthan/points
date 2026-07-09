import { QueryClient, VueQueryPlugin } from "@tanstack/vue-query";

import type { App, Plugin } from "vue";

export const tanstack: Plugin = {
  install: (app: App) => {
    const queryClient = new QueryClient();

    app.use(VueQueryPlugin, {
      queryClient: queryClient,
      enableDevtoolsV6Plugin: true,
    });
  },
};

export default tanstack;
