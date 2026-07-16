"use client"; // Error boundaries must be Client Components

import { useEffect } from "react";

interface GraphQLErrorExtensions {
  code?: string;
  statusCode?: number;
  http?: { status?: number };
}

function getGraphQLErrorCode(error: Error): string | null {
  try {
    const anyErr = error as unknown as {
      graphQLErrors?: Array<{ extensions?: GraphQLErrorExtensions }>;
      networkError?: { statusCode?: number };
    };

    // Apollo: networkError with statusCode
    if (anyErr.networkError?.statusCode) {
      return String(anyErr.networkError.statusCode);
    }

    // Apollo: graphQLErrors with extension codes
    const gqlErrors = anyErr.graphQLErrors;
    if (gqlErrors && gqlErrors.length > 0) {
      const ext = gqlErrors[0].extensions;
      if (ext?.code) return ext.code;
      if (ext?.statusCode) return String(ext.statusCode);
      if (ext?.http?.status) return String(ext.http.status);
    }
  } catch {
    // ignore parse errors
  }
  return null;
}

function isNotFoundError(error: Error): boolean {
  const code = getGraphQLErrorCode(error);
  if (code) {
    return (
      code === "404" ||
      code === "NOT_FOUND" ||
      code.toUpperCase().includes("NOT_FOUND")
    );
  }
  const msg = error.message?.toLowerCase() ?? "";
  return msg.includes("not found") || msg.includes("404");
}

function isForbiddenError(error: Error): boolean {
  const code = getGraphQLErrorCode(error);
  if (code) {
    return (
      code === "403" ||
      code === "FORBIDDEN" ||
      code === "UNAUTHORIZED" ||
      code === "ACCESS_DENIED" ||
      code.toUpperCase().includes("FORBIDDEN") ||
      code.toUpperCase().includes("UNAUTHORIZED")
    );
  }
  const msg = error.message?.toLowerCase() ?? "";
  return (
    msg.includes("forbidden") ||
    msg.includes("unauthorized") ||
    msg.includes("access denied") ||
    msg.includes("no access") ||
    msg.includes("403")
  );
}

export default function ErrorPage({
  error,
  unstable_retry: retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    console.error("[Email Error Boundary]", error);
  }, [error]);

  const notFound = isNotFoundError(error);
  const forbidden = !notFound && isForbiddenError(error);

  return (
    <div
      style={{
        minHeight: "60vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
        textAlign: "center",
        fontFamily: "inherit",
      }}
    >
      {/* Icon */}
      <div
        style={{
          width: 64,
          height: 64,
          borderRadius: "50%",
          background: notFound
            ? "rgba(99,102,241,0.12)"
            : forbidden
            ? "rgba(245,158,11,0.12)"
            : "rgba(239,68,68,0.12)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: "1.25rem",
          fontSize: 28,
        }}
      >
        {notFound ? "🔍" : forbidden ? "🔒" : "⚠️"}
      </div>

      {/* Title */}
      <h2
        style={{
          fontSize: "1.35rem",
          fontWeight: 700,
          color: "var(--foreground, #0f172a)",
          margin: "0 0 0.5rem",
        }}
      >
        {notFound
          ? "Resource Not Found"
          : forbidden
          ? "Access Denied"
          : "Something went wrong"}
      </h2>

      {/* Description */}
      <p
        style={{
          fontSize: "0.9rem",
          color: "var(--muted-foreground, #64748b)",
          maxWidth: 400,
          margin: "0 0 1.5rem",
          lineHeight: 1.6,
        }}
      >
        {notFound
          ? "The email resource you're looking for doesn't exist or may have been deleted."
          : forbidden
          ? "You don't have permission to access this email resource. Contact your administrator to request access."
          : error.message || "An unexpected error occurred. Please try again."}
      </p>

      {/* Error code badge */}
      {(notFound || forbidden) && (
        <span
          style={{
            display: "inline-block",
            padding: "2px 10px",
            borderRadius: 99,
            background: notFound
              ? "rgba(99,102,241,0.1)"
              : "rgba(245,158,11,0.1)",
            color: notFound ? "#6366f1" : "#d97706",
            fontSize: "0.75rem",
            fontWeight: 600,
            letterSpacing: "0.05em",
            marginBottom: "1.5rem",
          }}
        >
          {notFound ? "GRAPHQL · NOT_FOUND" : "GRAPHQL · FORBIDDEN"}
        </span>
      )}

      {/* Buttons */}
      <div style={{ display: "flex", gap: "0.75rem" }}>
        <button
          onClick={retry}
          style={{
            padding: "0.5rem 1.25rem",
            borderRadius: 8,
            border: "none",
            background: "#6366f1",
            color: "#fff",
            fontWeight: 600,
            fontSize: "0.875rem",
            cursor: "pointer",
          }}
        >
          Try again
        </button>
        <button
          onClick={() => window.history.back()}
          style={{
            padding: "0.5rem 1.25rem",
            borderRadius: 8,
            border: "1.5px solid #e2e8f0",
            background: "transparent",
            color: "var(--foreground, #0f172a)",
            fontWeight: 600,
            fontSize: "0.875rem",
            cursor: "pointer",
          }}
        >
          Go back
        </button>
      </div>
    </div>
  );
}
