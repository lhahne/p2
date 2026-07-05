import { describe, expect, it } from "vitest";
import { escapeHtml } from "./layout";

describe("escapeHtml", () => {
  it("escapes ampersands", () => {
    expect(escapeHtml("Tom & Jerry")).toBe("Tom &amp; Jerry");
  });

  it("escapes angle brackets", () => {
    expect(escapeHtml("<script>alert(1)</script>")).toBe(
      "&lt;script&gt;alert(1)&lt;/script&gt;",
    );
  });

  it("escapes double and single quotes", () => {
    expect(escapeHtml(`"hello" and 'world'`)).toBe(
      "&quot;hello&quot; and &#39;world&#39;",
    );
  });

  it("escapes all special characters together", () => {
    expect(escapeHtml(`<&>"'>`)).toBe("&lt;&amp;&gt;&quot;&#39;&gt;");
  });
});
