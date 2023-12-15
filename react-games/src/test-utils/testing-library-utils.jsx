import React from "react";
import { render } from "@testing-library/react";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { BrowserRouter as Router } from "react-router-dom";
import { AuthProvider } from "../components/AuthContext";
import { I18nextProvider } from "react-i18next";
import i18next from "../__mocks__/i18next";

export const queryClient = new QueryClient({
  logger: {
    log: console.log,
    warn: console.warn,
    // ✅ no more errors on the console for tests
    error: process.env.NODE_ENV === "test" ? () => {} : console.error,
  },
  retry: false,
  defaultOptions: {
    queries: {
      staleTime: 5000,
    },
  },
});

const AllTheProviders = ({ children }) => {
  return (
    <AuthProvider>
      <Router>
        <QueryClientProvider client={queryClient}>
          <I18nextProvider i18n={i18next}>{children}</I18nextProvider>
        </QueryClientProvider>
      </Router>{" "}
    </AuthProvider>
  );
};

const customRender = (ui, options) =>
  render(ui, { wrapper: AllTheProviders, ...options });

export * from "@testing-library/react";

export { customRender as render };
